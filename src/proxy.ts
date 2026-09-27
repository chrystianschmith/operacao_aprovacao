import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authEdgeConfig } from "@/server/auth/config.edge";
import { AB_TEST_CONFIG } from "@/config/business";
import { computeBucket } from "@/app/(marketing)/sales/ab-test/lib";

const AB_COOKIE = AB_TEST_CONFIG.cookieName;

/**
 * Seta o bucket A/B da página de vendas (cookie `_oa_ab`) quando ausente.
 * Bucket é determinístico por visitante (IP + UA) e persistido em cookie de 90d.
 * Não atribui decisão no cliente — só o middleware decide; a UI apenas lê.
 */
function ensureAbCookie(request: Request, ip: string | null, userAgent: string | null): HeadersInit | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  if (cookieHeader.includes(`${AB_COOKIE}=`)) return undefined;
  const bucket = computeBucket(`${ip ?? "anonymous"}|${userAgent ?? ""}`);
  return { cookie: `${AB_COOKIE}=${bucket}; Path=/; Max-Age=7776000; SameSite=Lax` };
}

function isSalesPath(pathname: string): boolean {
  return pathname === "/sales" || pathname.startsWith("/sales/");
}

// Redirecionamentos são UX; autorização atualizada permanece no servidor.
const { auth } = NextAuth(authEdgeConfig);

const PUBLIC_PATHS = [
  "/login",
  "/cadastro",
  "/verificar-email",
  "/recuperar-senha",
  "/redefinir-senha",
  // Canais de aquisição (landing/página de vendas) — públicos por definição.
  "/sales",
];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Headers de hardening que também precisam acompanhar as respostas de
 * redirecionamento: `NextResponse.redirect` não herda automaticamente os headers
 * estáticos de `next.config.ts`, então um `302` sairia sem `nosniff`/anti-embed/
 * isolamento de origem. Mantido alinhado ao `securityHeaders` de `next.config.ts`.
 */
export const REDIRECT_SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
];

export function applyRedirectSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of REDIRECT_SECURITY_HEADERS) response.headers.set(key, value);
  return response;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (!session && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return applyRedirectSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (session && pathname.startsWith("/admin")) {
    const role = session.user?.role;
    if (role !== "admin" && role !== "moderador") {
      return applyRedirectSecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin)),
      );
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self' https: blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const abSetCookie = isSalesPath(pathname)
    ? ensureAbCookie(request, request.headers.get("x-forwarded-for"), request.headers.get("user-agent"))
    : undefined;

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  if (abSetCookie) {
    for (const value of Object.values(abSetCookie)) {
      response.headers.append("Set-Cookie", value);
    }
  }
  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
