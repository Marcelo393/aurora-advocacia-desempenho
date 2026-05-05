import type { ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { MeProvider } from "@/hooks/useMe";
import { Toaster } from "@/components/ui/sonner";
import stylesUrl from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FlowDesk — Atendimento multicanal" },
      {
        name: "description",
        content:
          "Plataforma de atendimento multicanal para escritórios de advocacia: inbox compartilhada, transferência entre setores, etiquetas e respostas rápidas.",
      },
    ],
    links: [
      { rel: "stylesheet", href: stylesUrl },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AuthProvider>
        <MeProvider>
          <Outlet />
          <Toaster />
        </MeProvider>
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <div id="app" className="h-full">
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
