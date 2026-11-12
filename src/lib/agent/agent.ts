// O agente: recebe uma pergunta em português e devolve a resposta.
// fluxo: entender o banco -> gerar SQL -> validar -> executar -> se der erro, corrigir sozinho -> explicar o resultado

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { runQuery } from "@/lib/db/mysql";
import { getSchemaText } from "@/lib/db/schema-cache";
import { AgentError, isDbConnectionError, sanitizeDbError } from "@/lib/agent/errors";
import { ANSWER_SYSTEM_PROMPT, NO_ANSWER, SQL_SYSTEM_PROMPT } from "@/lib/agent/prompts";
import { askLLM } from "@/lib/llm/client";
import { validateSql } from "@/lib/sql/validator";
import type { AgentProgress, AgentResult, Attempt, Row } from "@/lib/types";

export const MAX_ATTEMPTS = 3;

// extrai o SQL de dentro do bloco ```sql ... ``` que a IA devolve
export function extractSql(text: string): string {
  const block = text.match(/```(?:sql)?\s*([\s\S]*?)```/i);
  return (block ? block[1] : text).trim();
}

// nomes das tabelas descritas na estrutura (usado pelo validador como lista permitida)
export function tablesFromSchema(schema: string): string[] {
  return [...schema.matchAll(/^Tabela (\w+)/gm)].map((m) => m[1]);
}

// impede que a pergunta "feche" a etiqueta e escape do bloco de dados
function wrapQuestion(question: string): string {
  return `<pergunta>\n${question.replaceAll(/<\/?pergunta>/gi, "")}\n</pergunta>`;
}

/** Dependências injetáveis, para testar o ciclo sem banco nem IA reais. */
export interface AgentDeps {
  askLLM: (system: string, user: string) => Promise<string>;
  runQuery: (sql: string) => Promise<Row[]>;
  getSchema: () => Promise<string>;
  writeLog: (result: AgentResult) => Promise<void>;
}

const defaultDeps: AgentDeps = {
  askLLM,
  runQuery,
  getSchema: async () => {
    try {
      return await getSchemaText();
    } catch (err) {
      throw new AgentError("db", "Não foi possível ler a estrutura do banco.", {
        cause: err,
      });
    }
  },
  writeLog,
};

interface AnswerOptions {
  /** false pula a explicação em português (a avaliação usa isso para economizar) */
  explain?: boolean;
  /** avisado a cada etapa (escrever, conferir, consultar, explicar), para a tela mostrar o andamento */
  onStep?: (progress: AgentProgress) => void;
}

export async function answerQuestion(
  question: string,
  { explain = true, onStep }: AnswerOptions = {},
  deps: AgentDeps = defaultDeps,
): Promise<AgentResult> {
  const startedAt = Date.now();
  const attempts: Attempt[] = [];
  const schema = await deps.getSchema();
  const allowedTables = tablesFromSchema(schema);

  let prompt = `Estrutura do banco:\n${schema}\nPergunta:\n${wrapQuestion(question)}`;
  let finalSql: string | null = null;
  let rows: Row[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // 1) a IA gera o SQL
    onStep?.({ step: "writing", attempt });
    const llmOutput = await deps.askLLM(SQL_SYSTEM_PROMPT, prompt);
    const sql = extractSql(llmOutput);

    if (sql.includes(NO_ANSWER)) {
      attempts.push({
        attempt,
        sql: null,
        error:
          "O agente recusou: os dados não respondem à pergunta ou o pedido envolve alterar dados.",
      });
      break;
    }

    // 2) o validador confere se é seguro
    onStep?.({ step: "checking", attempt });
    const validation = validateSql(sql, { allowedTables });
    if (!validation.valid) {
      attempts.push({
        attempt,
        sql,
        error: `Bloqueado pelo validador: ${validation.reason}`,
      });
      prompt += `\n\nSua consulta anterior foi BLOQUEADA: ${validation.reason}\nConsulta:\n${sql}\nGere uma nova consulta que respeite as regras.`;
      continue;
    }

    // 3) executa no banco (usuário somente leitura)
    onStep?.({ step: "running", attempt });
    try {
      rows = await deps.runQuery(validation.safeSql);
      finalSql = validation.safeSql;
      attempts.push({ attempt, sql: validation.safeSql, error: null });
      break;
    } catch (err) {
      // banco fora do ar não é culpa do SQL: não adianta pedir correção à IA
      if (isDbConnectionError(err)) {
        throw new AgentError("db", "Banco de dados inacessível.", { cause: err });
      }
      // 4) erro de SQL? devolve a mensagem (sem dados sensíveis) para a IA corrigir
      const raw = err instanceof Error ? err.message : String(err);
      const message = sanitizeDbError(raw);
      attempts.push({ attempt, sql: validation.safeSql, error: message });
      prompt += `\n\nSua consulta anterior deu erro no MySQL: ${message}\nConsulta:\n${validation.safeSql}\nCorrija e gere novamente.`;
    }
  }

  // 5) transforma o resultado em resposta em português
  let answer: string | undefined;
  if (!finalSql) {
    answer =
      "Não posso responder isso. Ou os dados disponíveis não têm essa informação, ou o pedido envolve alterar dados, e eu só faço consultas de leitura.";
  } else if (explain) {
    onStep?.({ step: "explaining", attempt: attempts.length });
    const sample = JSON.stringify(rows.slice(0, 50));
    answer = await deps.askLLM(
      ANSWER_SYSTEM_PROMPT,
      `Pergunta: ${question}\nSQL usado: ${finalSql}\nResultado (${rows.length} linhas):\n${sample}`,
    );
  }

  const result: AgentResult = {
    question,
    success: finalSql !== null,
    sql: finalSql,
    rows,
    answer,
    attempts,
    durationMs: Date.now() - startedAt,
  };

  await deps.writeLog(result);
  return result;
}

// guarda cada interação em logs/agent.jsonl (uma linha JSON por pergunta)
async function writeLog(result: AgentResult): Promise<void> {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    question: result.question,
    success: result.success,
    sql: result.sql,
    attempts: result.attempts,
    rowCount: result.rows.length,
    durationMs: result.durationMs,
  });
  const dir = path.join(process.cwd(), "logs");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "agent.jsonl"), line + "\n");
}
