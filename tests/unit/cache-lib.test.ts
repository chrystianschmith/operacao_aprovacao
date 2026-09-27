import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cachedLoad, createTtlCache } from "@/lib/cache";

describe("createTtlCache (cache em memória com TTL)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-19T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("miss -> undefined e hit -> valor até o TTL expirar", () => {
    const cache = createTtlCache<number>(1_000);
    expect(cache.get("a")).toBeUndefined();
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
    vi.advanceTimersByTime(999);
    expect(cache.get("a")).toBe(1);
    vi.advanceTimersByTime(1);
    expect(cache.get("a")).toBeUndefined();
  });

  it("respeita ttlMs por set", () => {
    const cache = createTtlCache<number>(60_000);
    cache.set("curto", 1, 500);
    cache.set("longo", 2, 10_000);
    vi.advanceTimersByTime(501);
    expect(cache.get("curto")).toBeUndefined();
    expect(cache.get("longo")).toBe(2);
  });

  it("has/delete/clear/size", () => {
    const cache = createTtlCache<string>(60_000);
    cache.set("x", "v");
    expect(cache.has("x")).toBe(true);
    expect(cache.delete("x")).toBe(true);
    expect(cache.delete("x")).toBe(false);
    expect(cache.has("x")).toBe(false);
    cache.set("y", "v");
    cache.set("z", "v");
    expect(cache.size()).toBe(2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it("size() ignora entradas vencidas", () => {
    const cache = createTtlCache<number>(100);
    cache.set("a", 1);
    cache.set("b", 2, 1_000_000);
    vi.advanceTimersByTime(101);
    expect(cache.size()).toBe(1);
  });

  it("rejeita TTL inválido", () => {
    expect(() => createTtlCache(0)).toThrow(RangeError);
    const cache = createTtlCache<number>(1_000);
    expect(() => cache.set("a", 1, -1)).toThrow(RangeError);
  });
});

describe("cachedLoad (loader com single-flight)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("chama o loader apenas no miss e reusa no hit", async () => {
    const cache = createTtlCache<Promise<number>>(60_000);
    const loader = vi.fn(async () => 42);
    expect(await cachedLoad(cache, "k", loader)).toBe(42);
    expect(await cachedLoad(cache, "k", loader)).toBe(42);
    expect(loader).toHaveBeenCalledTimes(1);
    cache.delete("k");
    expect(await cachedLoad(cache, "k", loader)).toBe(42);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("deduplica chamadas em voo para a mesma chave", async () => {
    // Este teste usa um `setTimeout` REAL no loader → precisa de timers reais, senão o
    // `beforeEach` ("useFakeTimers") congela o timer e o Promise.all nunca resolve.
    vi.useRealTimers();
    const cache = createTtlCache<Promise<string>>(60_000);
    let inFlight = 0;
    const loader = vi.fn(async () => {
      inFlight += 1;
      await new Promise((resolve) => setTimeout(resolve, 50));
      return "ok";
    });
    const [a, b, c] = await Promise.all([
      cachedLoad(cache, "k", loader),
      cachedLoad(cache, "k", loader),
      cachedLoad(cache, "k", loader),
    ]);
    expect([a, b, c]).toEqual(["ok", "ok", "ok"]);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(inFlight).toBe(1);
  });

  it("rejeição do loader NÃO fica cacheada", async () => {
    const cache = createTtlCache<Promise<number>>(60_000);
    const loader = vi
      .fn<() => Promise<number>>()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(7);
    await expect(cachedLoad(cache, "k", loader)).rejects.toThrow("boom");
    expect(await cachedLoad(cache, "k", loader)).toBe(7);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});