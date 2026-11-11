import { askLLM } from "../lib/llm";

async function main() {
  const reply = await askLLM(
    "Voce responde sempre em uma unica frase curta, em portugues.",
    "Diga ola e confirme que esta funcionando.",
  );
  console.log("Resposta da IA: ", reply);
}

main().catch((err) => {
  (console.log(err), process.exit(1));
});
