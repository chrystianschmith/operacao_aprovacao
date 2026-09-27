import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Operação Aprovação",
    template: "%s · Operação Aprovação",
  },
};

/**
 * Layout dos canais de aquisição (landing/páginas de vendas).
 * Público — sem sidebar/topbar do aluno, sem exigir autenticação.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#marketing-content"
        className="bg-primary text-primary-foreground focus-visible:ring-ring fixed top-2 left-2 z-[100] -translate-y-24 rounded-md px-4 py-2 text-sm font-semibold focus:translate-y-0 focus:ring-2"
      >
        Pular para o conteúdo principal
      </a>
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Operação Aprovação">
            <ShieldCheck className="text-primary h-6 w-6" aria-hidden="true" />
            <span className="font-semibold tracking-tight">Operação Aprovação</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
        </div>
      </header>
      <main id="marketing-content" tabIndex={-1} className="flex-1">
        {children}
      </main>
    </div>
  );
}