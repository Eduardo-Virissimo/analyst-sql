// Verificações de entrada da API, separadas da rota para serem testáveis.

// Bloqueia requisições vindas de outro site (CSRF): navegadores sempre enviam Origin
// em POST entre origens. Sem Origin (curl, testes) deixamos passar.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function isJson(request: Request): boolean {
  return (request.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith("application/json");
}

// identifica o cliente para o limite de requisições
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
}
