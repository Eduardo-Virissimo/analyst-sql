// evaluate.ts — mede a taxa de acerto do agente.
//
// Para cada pergunta de eval/questions.json, o agente responde e comparamos o RESULTADO
// da busca dele com o da busca "gabarito" (escrita à mão). Comparar resultados, e não o texto
// do SQL, evita punir quem escreveu uma consulta diferente mas correta.
//
//   npm run evaluate                    todas as perguntas
//   npm run evaluate -- --limit 5       só as 5 primeiras (teste rápido)
//   npm run evaluate -- --pause 3000    espera 3 s entre perguntas (cota da API)
//
// Tipos de pergunta no arquivo:
//   expected_sql    tem resposta certa: o resultado precisa ser igual ao do gabarito
//   no_answer       o banco não tem a informação: o certo é recusar
//   should_refuse   pedido perigoso (apagar dados, injeção): o certo é não executar nada
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { answerQuestion } from "@/lib/agent/agent";
import { closePool, runQuery } from "@/lib/db/mysql";
import { normalizeRows, sameRows } from "@/lib/eval/compare-rows";

interface EvalCase {
  question: string;
  category?: string;
  expected_sql?: string;
  order_matters?: boolean;
  no_answer?: boolean;
  should_refuse?: boolean;
}

function option(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Responde uma pergunta e diz se o agente acertou.
async function checkCase(testCase: EvalCase): Promise<{ passed: boolean; details: string }> {
  const result = await answerQuestion(testCase.question, { explain: false });

  // perguntas que devem ser recusadas: acertar é não executar nada
  if (testCase.should_refuse || testCase.no_answer) {
    return result.success
      ? { passed: false, details: `executou: ${result.sql}` }
      : { passed: true, details: "recusou" };
  }

  if (!result.success) return { passed: false, details: "não conseguiu executar uma busca" };

  const expected = await runQuery(testCase.expected_sql!);
  const passed = sameRows(
    normalizeRows(result.rows, testCase.order_matters),
    normalizeRows(expected, testCase.order_matters),
  );
  return { passed, details: passed ? "resultado igual ao gabarito" : "resultado diferente do gabarito" };
}

async function main() {
  const limit = option("limit") ? Number(option("limit")) : undefined;
  const pauseMs = Number(option("pause") ?? 1500);

  let cases: EvalCase[] = JSON.parse(await readFile(path.join(process.cwd(), "eval", "questions.json"), "utf8"));
  if (limit) cases = cases.slice(0, limit);

  console.log(`Modelo: ${process.env.LLM_MODEL} · ${cases.length} perguntas\n`);

  let passedCount = 0;
  const results = [];

  for (const [i, testCase] of cases.entries()) {
    process.stdout.write(`[${i + 1}/${cases.length}] ${testCase.question.slice(0, 70)} ... `);

    let outcome: { passed: boolean; details: string };
    try {
      outcome = await checkCase(testCase);
    } catch (err) {
      // falha da IA ou do banco (cota, rede): conta como erro nesta pergunta
      outcome = { passed: false, details: `erro: ${err instanceof Error ? err.message : err}` };
    }

    console.log(outcome.passed ? "✅" : `❌ (${outcome.details.slice(0, 90)})`);
    if (outcome.passed) passedCount++;
    results.push({ question: testCase.question, category: testCase.category, ...outcome });

    if (i < cases.length - 1) await sleep(pauseMs);
  }

  const accuracy = Math.round((passedCount / cases.length) * 1000) / 10;
  console.log(`\nTaxa de acerto: ${passedCount}/${cases.length} (${accuracy}%)`);

  // o detalhe de cada pergunta fica em eval/results.json (não vai para o Git)
  await writeFile(
    path.join(process.cwd(), "eval", "results.json"),
    JSON.stringify({ model: process.env.LLM_MODEL, passed: passedCount, total: cases.length, accuracy, results }, null, 2),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closePool());
