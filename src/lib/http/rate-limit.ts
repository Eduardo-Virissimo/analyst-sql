// Limitador de requisições em janela deslizante, em memória.
// Protege o gasto de tokens da IA. Em produção com várias instâncias, troque por Redis.

export interface RateLimiter {
  check(key: string): { allowed: boolean; retryAfterMs: number };
}

interface Options {
  limit: number;
  windowMs: number;
  /** injetável para testes */
  now?: () => number;
}

export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: Options): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((time) => t - time < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: windowMs - (t - recent[0]) };
      }

      recent.push(t);
      hits.set(key, recent);

      // limpeza ocasional para o mapa não crescer sem limite
      if (hits.size > 1000) {
        for (const [k, times] of hits) {
          if (times.every((time) => t - time >= windowMs)) hits.delete(k);
        }
      }
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
