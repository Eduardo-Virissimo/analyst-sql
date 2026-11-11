// Confere se a chave e o modelo da IA (.env.local) funcionam: faz uma pergunta simples e mostra a resposta.
// Não é parte da suíte de testes (`npm test`); rode com `npm run check:llm`.
import { askLLM } from "@/lib/llm/client";

async function main() {
  const reply = await askLLM(
    "Você responde sempre em uma única frase curta, em português.",
    "Diga olá e confirme que está funcionando.",
  );
  console.log("Resposta da IA:", reply);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
