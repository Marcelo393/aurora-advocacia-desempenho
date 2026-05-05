import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronUp,
  Clock,
  MessageSquare,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { dateLabel } from "@/lib/time";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/overview")({
  component: AdminOverview,
});

function AdminOverview() {
  const conversas = useStore((s) => s.conversas);
  const agentes = useStore((s) => s.agentes);
  const setores = useStore((s) => s.setores);

  const abertas = conversas.filter((c) => c.status === "aberta").length;

  const resolvidasHoje = useMemo(() => {
    const today = dateLabel(new Date().toISOString());
    return conversas.filter(
      (c) => c.status === "resolvida" && c.resolvida_em && dateLabel(c.resolvida_em) === today,
    ).length;
  }, [conversas]);

  const tempoMedio = useMemo(() => {
    const resolved = conversas.filter((c) => c.status === "resolvida" && c.resolvida_em);
    if (resolved.length === 0) return null;
    const totalMin =
      resolved.reduce((acc, c) => {
        const start = new Date(c.criado_em).getTime();
        const end = new Date(c.resolvida_em as string).getTime();
        return acc + Math.max(0, end - start);
      }, 0) /
      resolved.length /
      60_000;
    return Math.round(totalMin);
  }, [conversas]);

  const onlineCount = agentes.filter((a) => a.ativo && a.status === "online").length;

  const porSetor = setores.map((s) => ({
    setor: s,
    total: conversas.filter((c) => c.setor_id === s.id).length,
    abertas: conversas.filter((c) => c.setor_id === s.id && c.status === "aberta").length,
  }));
  const maxBar = Math.max(1, ...porSetor.map((p) => p.total));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Visão geral</h1>
          <p className="text-sm text-muted-foreground">
            Métricas operacionais do escritório em tempo real (demo).
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden /> Atualizado agora
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Conversas abertas"
          value={abertas}
          delta={`${conversas.length} no total`}
          icon={MessageSquare}
        />
        <Kpi
          label="Resolvidas hoje"
          value={resolvidasHoje}
          delta="últimas 24h"
          icon={ChevronUp}
        />
        <Kpi
          label="Tempo médio de resolução"
          value={tempoMedio === null ? "—" : `${tempoMedio} min`}
          delta="média histórica"
          icon={Clock}
        />
        <Kpi
          label="Agentes online"
          value={`${onlineCount}/${agentes.filter((a) => a.ativo).length}`}
          delta="ativos agora"
          icon={UserCheck}
        />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Conversas por setor</h2>
            <span className="text-xs text-muted-foreground">
              total · abertas
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {porSetor.map((p) => (
              <div key={p.setor.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className="inline-flex items-center gap-1.5 font-medium"
                    style={{ color: p.setor.cor_hex }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: p.setor.cor_hex }}
                      aria-hidden
                    />
                    {p.setor.nome}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {p.total} <span className="opacity-60">·</span> {p.abertas} abertas
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(p.total / maxBar) * 100}%`,
                      background: p.setor.cor_hex,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-semibold">Equipe</h2>
          <ul className="mt-3 space-y-2">
            {agentes
              .filter((a) => a.ativo)
              .map((a) => {
                const setor = setores.find((s) => s.id === a.setor_id);
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <StatusDot status={a.status} />
                      <span className="font-medium text-foreground">
                        {a.nome}
                      </span>
                    </div>
                    {setor ? (
                      <span style={{ color: setor.cor_hex }}>{setor.nome}</span>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{delta}</p>
    </div>
  );
}

function StatusDot({ status }: { status: "online" | "ausente" | "offline" }) {
  const color =
    status === "online"
      ? "hsl(var(--success))"
      : status === "ausente"
        ? "hsl(var(--warning))"
        : "hsl(var(--muted-foreground))";
  return (
    <span
      className="h-2 w-2 rounded-full"
      style={{ background: color }}
      aria-label={status}
    />
  );
}
