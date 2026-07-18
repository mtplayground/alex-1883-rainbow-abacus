import type { ReactNode } from "react";

type AppShellProps = Readonly<{
  children?: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="app-shell" aria-label="Abacus activity">
      <section className="app-shell__scene" aria-label="Abacus scene">
        <div className="app-shell__stage">{children}</div>
      </section>
    </main>
  );
}
