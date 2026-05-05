import { Inbox, User, Layers } from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { useMe } from "@/hooks/useMe";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SectorSidebar() {
  const setores = useStore((s) =>
    [...s.setores].filter((x) => x.ativo).sort((a, b) => a.ordem - b.ordem),
  );
  const conversas = useStore((s) => s.conversas);
  const { meId } = useMe();
  const search = useSearch({ from: "/_authenticated/inbox" }) as {
    setor?: string;
  };
  const activeSetor = search.setor;

  const totalAbertas = conversas.filter(
    (c) => c.status === "aberta" && c.nao_lidas > 0,
  ).length;
  const totalMinhas = conversas.filter(
    (c) => c.status === "aberta" && c.agente_responsavel_id === meId,
  ).length;

  const itemBase =
    "group relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors";

  const counter = (n: number) =>
    n > 0 ? (
      <span
        role="status"
        className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground ring-2 ring-card"
      >
        {n > 99 ? "99+" : n}
      </span>
    ) : null;

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        aria-label="Setores"
        className="hidden h-full w-16 shrink-0 flex-col items-center gap-1 border-r border-border/50 bg-card py-3 md:flex"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/inbox"
              search={{ setor: undefined }}
              data-active={!activeSetor && !search.setor}
              className={cn(
                itemBase,
                "text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground",
              )}
              aria-label="Todas as conversas"
              aria-current={!activeSetor ? "page" : undefined}
            >
              <Inbox className="h-5 w-5" aria-hidden />
              {counter(totalAbertas)}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Todas</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/inbox"
              search={{ setor: "minhas" }}
              data-active={activeSetor === "minhas"}
              className={cn(
                itemBase,
                "text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground",
              )}
              aria-label="Minhas conversas"
              aria-current={activeSetor === "minhas" ? "page" : undefined}
            >
              <User className="h-5 w-5" aria-hidden />
              {counter(totalMinhas)}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Minhas</TooltipContent>
        </Tooltip>

        <div className="my-2 h-px w-8 bg-border/60" aria-hidden />

        {setores.map((s) => {
          const naoLidas = conversas
            .filter((c) => c.setor_id === s.id && c.status === "aberta")
            .reduce((acc, c) => acc + c.nao_lidas, 0);
          const isActive = activeSetor === s.id;
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <Link
                  to="/inbox"
                  search={{ setor: s.id }}
                  data-active={isActive}
                  className={cn(
                    itemBase,
                    "hover:bg-muted data-[active=true]:bg-muted",
                  )}
                  aria-label={s.nome}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ background: s.cor_hex }}
                  >
                    {s.nome.slice(0, 2).toUpperCase()}
                  </span>
                  <span
                    aria-hidden
                    data-active={isActive}
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-foreground opacity-0 transition-opacity data-[active=true]:opacity-100"
                  />
                  {counter(naoLidas)}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{s.nome}</TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mt-auto pb-1 text-muted-foreground/50">
          <Layers className="h-4 w-4" aria-hidden />
        </div>
      </aside>
    </TooltipProvider>
  );
}
