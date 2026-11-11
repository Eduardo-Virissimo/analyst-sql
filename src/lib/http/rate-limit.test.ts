import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRateLimiter } from "@/lib/http/rate-limit";

describe("rate limiter", () => {
  it("permite até o limite e bloqueia o excedente", () => {
    const t = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("a").allowed, true);
    const blocked = limiter.check("a");
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.retryAfterMs, 1000);
  });

  it("libera de novo depois da janela", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    assert.equal(limiter.check("a").allowed, true);
    t = 500;
    assert.equal(limiter.check("a").allowed, false);
    t = 1001;
    assert.equal(limiter.check("a").allowed, true);
  });

  it("conta cada cliente separadamente", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("b").allowed, true);
    assert.equal(limiter.check("a").allowed, false);
  });

  it("tentativas bloqueadas não prolongam o bloqueio", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    limiter.check("a");
    t = 900;
    limiter.check("a");
    t = 1001;
    assert.equal(limiter.check("a").allowed, true);
  });
});
