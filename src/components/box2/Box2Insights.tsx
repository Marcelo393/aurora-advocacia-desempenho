import React from "react";
import { Insights } from "@/lib/box2/insights";

const tagColor: Record<string, string> = {
  forte: "text-emerald-400",
  ok: "text-amber-400",
  sangra: "text-red-400",
};

const Card: React.FC<{ title: string; children: React.ReactNode; accent?: boolean }> = ({
  title,
  children,
  accent,
}) => (
  <div
    className={`rounded-xl border p-4 ${
      accent ? "border-blue-500/40 bg-blue-500/10" : "border-slate-800 bg-slate-900/60"
    }`}
  >
    <div className="text-[10px] tracking-[0.14em] uppercase text-slate-400 font-bold mb-2">{title}</div>
    {children}
  </div>
);

const Box2Insights: React.FC<{ insights: Insights }> = ({ insights: j }) => {
  if (!j.silvioFound) {
    return (
      <div className="rounded-xl border border-red-400/25 bg-red-400/10 text-red-300 text-sm px-4 py-3">
        Inclua a melhor volta do #2 (Silvio) para ver a análise inteligente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Foco principal */}
      {j.foco && (
        <Card title="Onde focar agora" accent>
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-lg font-extrabold text-white">{j.foco.title}</div>
            {j.foco.gainMs > 0 && (
              <div className="text-blue-300 font-extrabold text-lg tabular-nums">
                ~{(j.foco.gainMs / 1000).toFixed(3)}s
              </div>
            )}
          </div>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{j.foco.detail}</p>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Pior setor */}
        {j.worstSector && j.worstSector.deltaMs > 0 ? (
          <Card title="Pior setor — recuperar">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{j.worstSector.s}</span>
              <span className={`font-extrabold tabular-nums ${tagColor[j.worstSector.tag]}`}>
                {j.worstSector.deltaStr}s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              melhor da classe: #{j.worstSector.best} {j.worstSector.bestName}
            </p>
          </Card>
        ) : (
          <Card title="Pior setor">
            <p className="text-sm text-slate-400">Sem setor crítico nos dados.</p>
          </Card>
        )}

        {/* Melhor setor */}
        {j.bestSector ? (
          <Card title="Melhor setor — defender">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{j.bestSector.s}</span>
              <span className={`font-extrabold tabular-nums ${tagColor[j.bestSector.tag]}`}>
                {j.bestSector.isOwn ? "líder" : `${j.bestSector.deltaStr}s`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {j.bestSector.isOwn
                ? "você tem o melhor da classe aqui"
                : `referência: #${j.bestSector.best} ${j.bestSector.bestName}`}
            </p>
          </Card>
        ) : null}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Rival principal */}
        {j.mainRival && (
          <Card title={j.mainRival.kind === "ahead" ? "Rival a atacar" : "Ameaça atrás"}>
            <div className="flex items-baseline gap-2">
              <span className="text-blue-300 font-extrabold">#{j.mainRival.rival.num}</span>
              <span className="text-white font-bold truncate">{j.mainRival.rival.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 tabular-nums">
              {j.mainRival.kind === "ahead" ? "à frente" : "logo atrás"} · {j.mainRival.rival.gapStr}s
              {j.mainRival.rival.laps ? ` · ${j.mainRival.rival.laps}v` : ""}
            </p>
          </Card>
        )}

        {/* Líder da classe */}
        {j.leader && (
          <Card title="Líder da classe">
            <div className="flex items-baseline gap-2">
              <span className="text-blue-300 font-extrabold">#{j.leader.num}</span>
              <span className="text-white font-bold truncate">{j.leader.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 tabular-nums">gap: {j.leader.gapStr}s</p>
          </Card>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Volta teórica / projeção */}
        {j.voltaTeorica && (
          <Card title="Volta teórica (seus melhores setores)">
            <div className="text-2xl font-extrabold text-white tabular-nums">{j.voltaTeorica.idealStr}</div>
            <p className="text-xs text-slate-400 mt-1">
              juntando numa volta, você seria{" "}
              <span className="text-emerald-400 font-bold">{j.voltaTeorica.projectedPos}º</span>
              {j.voltaTeorica.posGain > 0 && (
                <span className="text-emerald-400 font-bold"> (+{j.voltaTeorica.posGain} pos)</span>
              )}
            </p>
          </Card>
        )}

        {/* Consistência (na mesa) */}
        {j.mesaStr && (
          <Card title="Na mesa (consistência)">
            <div className="text-2xl font-extrabold text-white tabular-nums">{j.mesaStr}s</div>
            <p className="text-xs text-slate-400 mt-1">tempo já feito, esperando uma volta limpa</p>
          </Card>
        )}
      </div>

      {/* Potencial da classe */}
      {j.potencialClasse && (
        <Card title="Potencial máximo da classe">
          <p className="text-sm text-slate-300">
            Somando o melhor setor de cada piloto da Sport, a volta perfeita da classe seria{" "}
            <span className="text-white font-bold tabular-nums">{j.potencialClasse.sumStr}</span> — sua volta
            ideal está a <span className="text-amber-400 font-bold tabular-nums">{j.potencialClasse.deltaStr}s</span>{" "}
            desse teto. Esse é o déficit de pace puro.
          </p>
        </Card>
      )}

      {/* Maturidade */}
      {j.maturidade && (
        <Card title="Maturidade de pace">
          <p className={`text-sm ${j.maturidade.imatura ? "text-amber-300" : "text-slate-300"}`}>
            {j.maturidade.imatura ? "⚠ " : "✓ "}
            {j.maturidade.msg}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Box2Insights;
