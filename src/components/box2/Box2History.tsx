import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SessionSnapshot, deleteSession } from "@/lib/box2/storage";
import { fmtLap, fmtDelta } from "@/lib/box2/analise";

interface Props {
  sessions: SessionSnapshot[];
  onChange: () => void;
  onLoad: (s: SessionSnapshot) => void;
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div className="text-[10px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-3">{title}</div>
    <div style={{ width: "100%", height: 180 }}>{children}</div>
  </div>
);

const axis = { stroke: "#475569", fontSize: 11 };

const Box2History: React.FC<Props> = ({ sessions, onChange, onLoad }) => {
  const data = useMemo(
    () =>
      sessions.map((s, i) => ({
        idx: i + 1,
        label: s.meta.sessao || `Sessão ${i + 1}`,
        date: s.meta.data,
        lapMs: s.metrics.bestLapMs,
        lapSec: s.metrics.bestLapMs != null ? +(s.metrics.bestLapMs / 1000).toFixed(3) : null,
        pos: s.metrics.pos,
        mesaSec: s.metrics.mesaMs != null ? +(s.metrics.mesaMs / 1000).toFixed(3) : null,
        s1: s.metrics.sectorDeltaMs.S1 != null ? +(s.metrics.sectorDeltaMs.S1 / 1000).toFixed(3) : null,
        s2: s.metrics.sectorDeltaMs.S2 != null ? +(s.metrics.sectorDeltaMs.S2 / 1000).toFixed(3) : null,
        s3: s.metrics.sectorDeltaMs.S3 != null ? +(s.metrics.sectorDeltaMs.S3 / 1000).toFixed(3) : null,
      })),
    [sessions]
  );

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400 text-sm">
        Nenhuma sessão salva ainda. Na aba <b className="text-slate-200">Análise</b>, preencha os tempos e
        clique em <b className="text-slate-200">Salvar sessão</b> — aqui você acompanha a evolução treino a
        treino.
      </div>
    );
  }

  // comparação última vs penúltima
  const last = sessions[sessions.length - 1];
  const prev = sessions.length > 1 ? sessions[sessions.length - 2] : null;
  const lapDelta =
    prev && last.metrics.bestLapMs != null && prev.metrics.bestLapMs != null
      ? last.metrics.bestLapMs - prev.metrics.bestLapMs
      : null;
  const posDelta =
    prev && last.metrics.pos != null && prev.metrics.pos != null ? last.metrics.pos - prev.metrics.pos : null;

  return (
    <div className="space-y-5">
      {/* Resumo da evolução */}
      {prev && (
        <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
          <div className="text-[10px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-2">
            Última sessão vs anterior
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {lapDelta != null && (
              <div>
                <span className="text-slate-400">Volta: </span>
                <span className={`font-extrabold tabular-nums ${lapDelta <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {lapDelta <= 0 ? "▼" : "▲"} {fmtDelta(lapDelta)}s
                </span>
              </div>
            )}
            {posDelta != null && (
              <div>
                <span className="text-slate-400">Posição: </span>
                <span
                  className={`font-extrabold tabular-nums ${
                    posDelta < 0 ? "text-emerald-400" : posDelta > 0 ? "text-red-400" : "text-slate-300"
                  }`}
                >
                  {posDelta < 0 ? `subiu ${-posDelta}` : posDelta > 0 ? `caiu ${posDelta}` : "manteve"}
                </span>
              </div>
            )}
            <div>
              <span className="text-slate-400">Agora: </span>
              <span className="font-bold text-white tabular-nums">
                {last.metrics.pos ? `${last.metrics.pos}º` : "—"} ·{" "}
                {last.metrics.bestLapMs != null ? fmtLap(last.metrics.bestLapMs) : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Melhor volta (s) — menor é melhor">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="idx" {...axis} />
              <YAxis domain={["auto", "auto"]} {...axis} width={48} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(i) => data[(i as number) - 1]?.label || ""}
              />
              <Line type="monotone" dataKey="lapSec" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Posição na Sport — menor é melhor">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="idx" {...axis} />
              <YAxis reversed allowDecimals={false} domain={[1, "auto"]} {...axis} width={48} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(i) => data[(i as number) - 1]?.label || ""}
              />
              <Line type="monotone" dataKey="pos" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Déficit por setor (s) — menor é melhor">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="idx" {...axis} />
              <YAxis domain={["auto", "auto"]} {...axis} width={48} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(i) => data[(i as number) - 1]?.label || ""}
              />
              <Line type="monotone" dataKey="s1" name="S1" stroke="#f87171" strokeWidth={2} dot={{ r: 2 }} connectNulls />
              <Line type="monotone" dataKey="s2" name="S2" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2 }} connectNulls />
              <Line type="monotone" dataKey="s3" name="S3" stroke="#a78bfa" strokeWidth={2} dot={{ r: 2 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Na mesa / consistência (s)">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="idx" {...axis} />
              <YAxis domain={["auto", "auto"]} {...axis} width={48} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(i) => data[(i as number) - 1]?.label || ""}
              />
              <Line type="monotone" dataKey="mesaSec" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Lista de sessões */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="text-[10px] tracking-[0.14em] uppercase text-slate-400 font-bold px-4 py-3 bg-slate-900">
          Histórico ({sessions.length})
        </div>
        {[...sessions].reverse().map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 px-4 py-3 border-t border-slate-800 text-sm hover:bg-slate-900/50"
          >
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{s.meta.sessao || "Sessão"}</div>
              <div className="text-xs text-slate-500">{s.meta.data}</div>
            </div>
            <div className="text-right tabular-nums">
              <div className="text-white">{s.metrics.pos ? `${s.metrics.pos}º` : "—"}</div>
              <div className="text-xs text-slate-500">
                {s.metrics.bestLapMs != null ? fmtLap(s.metrics.bestLapMs) : "—"}
              </div>
            </div>
            <button
              onClick={() => onLoad(s)}
              className="text-xs rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
            >
              Abrir
            </button>
            <button
              onClick={() => {
                if (confirm("Remover esta sessão do histórico?")) {
                  deleteSession(s.id);
                  onChange();
                }
              }}
              className="text-slate-500 hover:text-red-400 px-1"
              title="Remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Box2History;
