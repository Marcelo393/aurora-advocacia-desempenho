import { useMemo, useState } from "react";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { Search, Plus, MessageSquarePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { useMe } from "@/hooks/useMe";
import { useNow } from "@/hooks/useNow";
import { relative } from "@/lib/time";
import { FdAvatar } from "./Avatar";
import { NewConversationDialog } from "./NewConversationDialog";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import type { Conversa } from "@/lib/types";

type Status = "aberta" | "resolvida";

export function ConversationList() {
  const conversas = useStore((s) => s.conversas);
  const setores = useStore((s) => s.setores);
  const etiquetas = useStore((s) => s.etiquetas);
  const { meId } = useMe();
  const search = useSearch({ from: "/_authenticated/inbox" }) as {
    setor?: string;
  };
  const params = useParams({ strict: false }) as { conversaId?: string };

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("aberta");
  const [openNew, setOpenNew] = useState(false);
  const now = useNow(60_000);

  const setorTitulo = useMemo(() => {
    if (!search.setor) return "Todas as conversas";
    if (search.setor === "minhas") return "Minhas conversas";
    return setores.find((s) => s.id === search.setor)?.nome ?? "Conversas";
  }, [search.setor, setores]);

  const filtered = useMemo(() => {
    let list: Conversa[] = conversas;
    if (search.setor === "minhas") {
      list = list.filter((c) => c.agente_responsavel_id === meId);
    } else if (search.setor) {
      list = list.filter((c) => c.setor_id === search.setor);
    }
    list = list.filter((c) => c.status === status);
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.nome_contato.toLowerCase().includes(q) ||
          c.telefone_contato.toLowerCase().includes(q) ||
          c.ultima_mensagem.toLowerCase().includes(q),
      );
    }
    return [...list].sort(
      (a, b) => b.atualizado_em.localeCompare(a.atualizado_em),
    );
  }, [conversas, search.setor, status, query, meId]);

  return (
    <div
      className="chat-list flex h-full w-full flex-col border-r border-border/50 bg-card md:w-[320px] md:shrink-0"
      aria-label="Lista de conversas"
    >
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          {setorTitulo}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpenNew(true)}
          aria-label="Nova conversa"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, telefone, mensagem"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <div className="flex gap-1 px-3 pb-2">
        {(["aberta", "resolvida"] as Status[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            data-active={status === s}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground"
          >
            {s === "aberta" ? "Abertas" : "Resolvidas"}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquarePlus}
            title="Nenhuma conversa"
            description={
              status === "aberta"
                ? "Quando uma conversa chegar nesse setor, ela aparecerá aqui."
                : "Nenhuma conversa resolvida nesse filtro."
            }
            className="py-12"
          />
        ) : (
          <ul className="flex flex-col">
            {filtered.map((c) => {
              const setor = setores.find((s) => s.id === c.setor_id);
              const isActive = params.conversaId === c.id;
              const tags = c.etiqueta_ids
                .map((id) => etiquetas.find((e) => e.id === id))
                .filter(Boolean);
              return (
                <li key={c.id}>
                  <Link
                    to="/inbox/c/$conversaId"
                    params={{ conversaId: c.id }}
                    search={(s) => s}
                    data-active={isActive}
                    className={cn(
                      "relative flex w-full items-start gap-3 border-b border-border/40 px-3 py-3 text-left transition-colors hover:bg-muted/60 data-[active=true]:bg-muted",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      aria-hidden
                      data-active={isActive}
                      className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 transition-opacity data-[active=true]:opacity-100"
                    />
                    <FdAvatar name={c.nome_contato} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {c.nome_contato}
                        </p>
                        <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {relative(c.atualizado_em, now)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        {setor ? (
                          <span
                            className="inline-flex items-center gap-1 truncate"
                            style={{ color: setor.cor_hex }}
                          >
                            <span
                              className="inline-block h-1.5 w-1.5 rounded-full"
                              style={{ background: setor.cor_hex }}
                              aria-hidden
                            />
                            {setor.nome}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {c.ultima_mensagem}
                      </p>
                      {tags.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {tags.map((t) =>
                            t ? (
                              <span
                                key={t.id}
                                className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                                style={{
                                  background: `${t.cor_hex}1f`,
                                  color: t.cor_hex,
                                }}
                              >
                                {t.nome}
                              </span>
                            ) : null,
                          )}
                        </div>
                      ) : null}
                    </div>
                    {c.nao_lidas > 0 ? (
                      <span
                        role="status"
                        className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
                      >
                        {c.nao_lidas}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <NewConversationDialog open={openNew} onOpenChange={setOpenNew} />
    </div>
  );
}
