// Cliente da IA. Fala com a Anthropic ou com qualquer serviço compatível com a API da OpenAI
// (inclusive o Gemini), escolhido por LLM_PROVIDER no .env.local.
// Só sabe pedir e receber texto: o que perguntar fica em agent/prompts.ts.
import { AgentError } from "@/lib/agent/errors";

type Provider = "anthropic" | "openai";

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

function getConfig() {
  const provider = (process.env.LLM_PROVIDER || "anthropic") as Provider;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!apiKey) throw new Error("LLM_API_KEY não configurada no arquivo .env.local");
  if (!model) throw new Error("LLM_MODEL não configurado no arquivo .env.local");

  return { provider, apiKey, model };
}

export async function askLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const { provider, apiKey, model } = getConfig();

  try {
    if (provider === "anthropic") {
      return await callAnthropic(apiKey, model, systemPrompt, userMessage);
    }
    return await callOpenAICompatible(apiKey, model, systemPrompt, userMessage);
  } catch (err) {
    if (err instanceof AgentError) throw err;
    const reason = err instanceof Error ? err.message : String(err);
    throw new AgentError("llm", `Falha ao chamar a IA: ${reason}`, { cause: err });
  }
}

async function callAnthropic(apiKey: string, model: string, system: string, message: string): Promise<string> {
  const response = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0,
      system,
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new AgentError("llm", `Erro da API Anthropic (${response.status}): ${JSON.stringify(data)}`);
  }
  return (data.content as { text?: string }[]).map((block) => block.text ?? "").join("");
}

async function callOpenAICompatible(apiKey: string, model: string, system: string, message: string): Promise<string> {
  const baseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const response = await fetchWithRetry(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new AgentError("llm", `Erro da API (${response.status}): ${JSON.stringify(data)}`);
  }
  return data.choices[0].message.content as string;
}

// fetch com timeout e novas tentativas quando a API está sobrecarregada (429/503)
async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      const retryable = response.status === 429 || response.status === 503;
      if (!retryable || attempt >= MAX_RETRIES) return response;
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
  }
}
