import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface StudentShellProps {
  children: ReactNode;
}

/**
 * Shell visual do aluno: sidebar (desktop) + topbar (com menu mobile) + conteúdo.
 * Server Component — composição de Sidebar/Topbar, que isolam suas próprias partes client.
 */
export function StudentShell({ children }: StudentShellProps) {
  return (
    <div className="bg-background flex min-h-screen">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus-visible:ring-ring fixed top-2 left-2 z-[100] -translate-y-24 rounded-md px-4 py-2 text-sm font-semibold focus:translate-y-0 focus:ring-2"
      >
        Pular para o conteúdo principal
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="focus-visible:outline-none flex-1 px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
