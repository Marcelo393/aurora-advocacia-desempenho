import { useMemo } from "react";
import { ArrowRightLeft, Tag, History, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { useNow } from "@/hooks/useNow";
import { toggleEtiqueta } from "@/lib/mockStore";
import { dateTimeLabel, relative } from "@/lib/time";
import type { Conversa } from "@/lib/types";
import { FdAvatar } from "./Avatar";

export function ContactDetailsPanel({ conversa }: { conversa: Conversa }) {
  const etiquetas = useStore((s) => s.etiquetas);
  const conversas = useStore((s) => s.conversas);
  const transferencias = useStore((s) => s.transferencias);
  const setores = useStore((s) => s.setores);
  const agentes = useStore((s) => s.agentes);
  const now = useNow(60_000);

  const transferenciasDaConversa = useMemo(
    () =>
      transferencias
        .filter((t) => t.conversa_id === conversa.id)
        .sort((a, b) => b.criado_em.localeCompare(a.criado_em)),
    [transferencias, conversa.id],
  );

  const conversasAnteriores = useMemo(
    () =>
      conversas
        .filter(
          (c) =>
            c.telefone_contato === conversa.telefone_contato &&
            c.id !== conversa.id,
        )
        .sort((a, b) => b.criado_em.localeCompare(a.criado_em))
        .slice(0, 5),
    [conversas, conversa.telefone_contato, conversa.id],
  );

  return (
    <aside
      className="hidden h-full w-80 shrink-0 flex-col border-l border-border/50 bg-card lg:flex"
      aria-label="Detalhes do contato"
    >
      <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-6 text-center">
        <FdAvatar name={conversa.nome_contato} size="lg" />
        <div>
          <p className="text-base font-semibold">{conversa.nome_contato}</p>
          <p className="text-xs text-muted-foreground">
            {conversa.telefone_contato}
          </p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-6">
        <Section icon={Tag} title="Etiquetas">
          <div className="flex flex-wrap gap-1.5">
            {etiquetas.map((t) => {
              const active = conversa.etiqueta_ids.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleEtiqueta(conversa.id, t.id)}
                  data-active={active}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors data-[active=false]:border-border/60 data-[active=false]:text-muted-foreground"
                  style={
                    active
                      ? {
                          background: `${t.cor_hex}1f`,
                          borderColor: `${t.cor_hex}55`,
                          color: t.cor_hex,
                        }
                      : undefined
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: t.cor_hex }}
                    aria-hidden
                  />
                  {t.nome}
                </button>
              );
            })}
          </div>
        </Section>

        <Section icon={History} title="Histórico de transferências">
          {transferenciasDaConversa.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhuma transferência registrada.
            </p>
          ) : (
            <ul className="space-y-3">
              {transferenciasDaConversa.map((t) => {
                const origem = setores.find((s) => s.id === t.setor_origem_id);
                const destino = setores.find(
                  (s) => s.id === t.setor_destino_id,
                );
                const por = agentes.find((a) => a.id === t.transferido_por_id);
                return (
                  <li
                    key={t.id}
                    className="rounded-md border border-border/50 bg-background p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <span style={{ color: origem?.cor_hex }}>
                        {origem?.nome ?? "—"}
                      </span>
                      <ArrowRightLeft
                        className="h-3 w-3 text-muted-foreground"
                        aria-hidden
                      />
                      <span style={{ color: destino?.cor_hex }}>
                        {destino?.nome ?? "—"}
                      </span>
                    </div>
                    {t.observacao ? (
                      <p className="mt-1 text-muted-foreground">
                        {t.observacao}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[10px] text-muted-foreground/80">
                      por {por?.nome ?? "—"} · {dateTimeLabel(t.criado_em)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section icon={MessageSquare} title="Conversas anteriores">
          {conversasAnteriores.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhuma conversa anterior com este contato.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {conversasAnteriores.map((c) => {
                const setor = setores.find((s) => s.id === c.setor_id);
                return (
                  <li key={c.id}>
                    <Link
                      to="/inbox/c/$conversaId"
                      params={{ conversaId: c.id }}
                      search={(s) => s}
                      className="block rounded-md border border-border/50 bg-background p-2 text-xs transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-medium"
                          style={{ color: setor?.cor_hex }}
                        >
                          {setor?.nome ?? "—"}
                        </span>
                        <span className="text-muted-foreground">
                          {relative(c.atualizado_em, now)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-muted-foreground">
                        {c.ultima_mensagem}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                        {c.status === "resolvida" ? "Resolvida" : "Aberta"}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>
    </aside>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border/40 py-3 last:border-b-0">
      <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}
