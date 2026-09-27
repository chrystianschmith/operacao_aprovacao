// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({ default: () => ({ auth: (handler: unknown) => handler }) }));
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ url, headers: new Headers() })),
    next: vi.fn(),
  },
}));
vi.mock("@/server/auth/config.edge", () => ({ authEdgeConfig: {} }));

import nextConfig from "../../next.config";
import { REDIRECT_SECURITY_HEADERS, applyRedirectSecurityHeaders, isPublicPath } from "@/proxy";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

async function loadHeaderRules(): Promise<HeaderRule[]> {
  const fn = nextConfig.headers as unknown as () => Promise<HeaderRule[]>;
  return fn();
}

describe("hardening de borda (next.config.ts)", () => {
  it("aplica os headers de segurança a TODAS as rotas, sem exceção seletiva", async () => {
    const rules = await loadHeaderRules();
    expect(rules).toHaveLength(1);
    const [rule] = rules;
    expect(rule?.source).toBe("/:path*");

    const map = Object.fromEntries(rule!.headers.map((header) => [header.key, header.value]));
    expect(map["X-Content-Type-Options"]).toBe("nosniff");
    expect(map["X-Frame-Options"]).toBe("DENY");
    expect(map["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(map["Strict-Transport-Security"]).toContain("max-age=63072000");
    expect(map["Permissions-Policy"]).toContain("camera=()");
  });

  it("isola o browsing context e impede carregamento cross-origin de recursos", async () => {
    const [rule] = await loadHeaderRules();
    const map = Object.fromEntries(rule!.headers.map((header) => [header.key, header.value]));
    expect(map["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(map["Cross-Origin-Resource-Policy"]).toBe("same-origin");
    expect(map["X-DNS-Prefetch-Control"]).toBe("off");
    expect(map["X-Permitted-Cross-Domain-Policies"]).toBe("none");
  });
});

describe("respostas de redirecionamento do proxy", () => {
  it("acompanha o redirect com anti-embed e isolamento de origem (não sai um 302 'cru')", () => {
    const response = { headers: new Headers() } as Parameters<
      typeof applyRedirectSecurityHeaders
    >[0];

    applyRedirectSecurityHeaders(response);

    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(response.headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
  });

  it("mantém o conjunto de headers alinhado ao de next.config.ts", () => {
    const keys = REDIRECT_SECURITY_HEADERS.map(([key]) => key);
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("Referrer-Policy");
    expect(keys).toContain("Cross-Origin-Opener-Policy");
    expect(keys).toContain("Cross-Origin-Resource-Policy");
  });
});

describe("rotas públicas do proxy", () => {
  it("permite o acesso anônimo aos canais de aquisição (página de vendas e variantes)", () => {
    expect(isPublicPath("/sales")).toBe(true);
    expect(isPublicPath("/sales/short")).toBe(true);
    expect(isPublicPath("/sales/vsl")).toBe(true);
    expect(isPublicPath("/sales/quiz")).toBe(true);
  });

  it("mantém autenticação nos canais de aluno e admin", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/admin")).toBe(false);
    expect(isPublicPath("/cursos")).toBe(false);
    expect(isPublicPath("/login")).toBe(true);
  });
});
