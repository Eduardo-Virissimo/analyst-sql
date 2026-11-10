type Provider = "anthropic" | "openai";

interface AnthropicResponse {
  content: { type: string; text?: string }[];
}

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

function getConfig() {
  const provider = (process.env.LLM_PROVIDER || "anthropic") as Provider;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!apiKey)
    throw new Error("LLM_API_KEY nao configurada no arquivo .env.local");
  if (!model)
    throw new Error("LLM_MODEL nao configurado no arquivo .env.local");

  return { provider, apiKey, model };
}

export async function askLLM(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const { provider, apiKey, model } = getConfig();

  if (provider === "anthropic") {
    return callAnthropic(apiKey, model, systemPrompt, userMessage);
  }
  return callOpenAICompatible(apiKey, model, systemPrompt, userMessage);
}

async function callAnthropic(
  apiKey: string,
  model: string,
  system: string,
  message: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
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

  const data: unknown = await response.json();
  if (!response.ok) {
    throw new Error(
      `Erro da API Anthropic (${response.status}): ${JSON.stringify(data)}`,
    );
  }
  return (data as AnthropicResponse).content
    .map((block) => block.text ?? "")
    .join("");
}

async function callOpenAICompatible(
  apiKey: string,
  model: string,
  system: string,
  message: string,
): Promise<string> {
  const baseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const response = await fetch(`${baseUrl}/chat/completions`, {
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

  const data: unknown = await response.json();
  if (!response.ok) {
    throw new Error(
      `Erro da API (${response.status}): ${JSON.stringify(data)}`,
    );
  }
  return (data as OpenAIResponse).choices[0].message.content;
}
