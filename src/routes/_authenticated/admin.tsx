import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Layers,
  Users,
  Tag,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: Array<{
  to: "/admin/overview" | "/admin/setores" | "/admin/agentes" | "/admin/etiquetas" | "/admin/respostas";
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}> = [
  { to: "/admin/overview", label: "Visão geral", icon: LayoutDashboard },
  { to: "/admin/setores", label: "Setores", icon: Layers },
  { to: "/admin/agentes", label: "Agentes", icon: Users },
  { to: "/admin/etiquetas", label: "Etiquetas", icon: Tag },
  { to: "/admin/respostas", label: "Respostas rápidas", icon: Zap },
];

function AdminLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-row">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/50 bg-card p-3 md:flex">
        <Link
          to="/inbox"
          search={{ setor: undefined }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Voltar para inbox
        </Link>
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Administração
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: false }}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              )}
              activeProps={{
                className:
                  "bg-muted text-foreground",
                "aria-current": "page",
              }}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <nav className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border/50 bg-card px-3 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: false }}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{
                className: "bg-muted text-foreground",
                "aria-current": "page",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
