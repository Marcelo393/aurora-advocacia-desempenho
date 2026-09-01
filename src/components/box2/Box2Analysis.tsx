import React, { forwardRef } from "react";
import { Analysis } from "@/lib/box2/analise";
import { Insights } from "@/lib/box2/insights";
import { ReportMeta } from "@/lib/box2/relatorio";

interface Props {
  analysis: Analysis;
  insights: Insights;
  meta: ReportMeta;
}

const CSS = `
.b2a{--ink:#f3f6fa;--dim:#8b95a3;--line:#222936;--accent:#3b82f6;--lite:#9dc0ff;--card:#141a24;--good:#34d399;--mid:#fbbf24;--bad:#f87171;
  color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;
  background:radial-gradient(120% 60% at 50% -10%,#1b2740 0%,#0d1117 55%);
  border:1px solid #1d2533;border-radius:22px;overflow:hidden;max-width:600px;margin:0 auto}
.b2a *{margin:0;padding:0;box-sizing:border-box}

.b2a .hero{padding:26px 22px 18px}
.b2a .flag{display:flex;gap:3px;margin-bottom:14px}
.b2a .flag i{width:13px;height:13px;border-radius:3px;background:repeating-conic-gradient(#fff 0 25%,#0d1117 0 50%) 0/8px 8px}
.b2a .ey{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--lite);font-weight:700}
.b2a .name{font-size:32px;font-weight:800;letter-spacing:-.03em;margin-top:10px;line-height:1}
.b2a .name .num{font-size:13px;color:var(--accent);border:1.5px solid var(--accent);border-radius:7px;padding:2px 8px;margin-left:10px;vertical-align:middle}
.b2a .meta{color:var(--dim);font-size:13px;margin-top:10px}

.b2a .focus{margin:4px 22px 0;display:flex;align-items:flex-start;gap:14px;
  background:linear-gradient(135deg,rgba(59,130,246,.22),rgba(59,130,246,.05));
  border:1px solid rgba(59,130,246,.4);border-radius:18px;padding:18px}
.b2a .focus .ico{font-size:26px;line-height:1.1}
.b2a .focus .fl{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--lite);font-weight:700}
.b2a .focus .ft{font-size:19px;font-weight:800;margin-top:3px;letter-spacing:-.02em}
.b2a .focus .fd{font-size:13.5px;color:#c7d2e0;line-height:1.55;margin-top:6px}
.b2a .focus .badge{margin-left:auto;background:var(--accent);color:#fff;font-weight:800;font-size:15px;
  border-radius:11px;padding:8px 12px;white-space:nowrap;font-variant-numeric:tabular-nums;align-self:center}

.b2a .verdict{margin:16px 22px 0;display:flex;align-items:center;gap:18px;
  background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px 20px}
.b2a .vbig{font-size:46px;font-weight:800;letter-spacing:-.04em;line-height:1}
.b2a .vlab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);font-weight:700}
.b2a .vsub{font-size:14px;color:var(--dim);font-weight:600;margin-top:4px}
.b2a .dots{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end;max-width:120px}
.b2a .dot{width:9px;height:9px;border-radius:50%;background:#2a3340}
.b2a .dot.on{background:var(--accent);box-shadow:0 0 0 4px rgba(59,130,246,.18)}

.b2a .kpis{display:grid;gap:10px;margin:14px 22px 0}
.b2a .kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 10px;text-align:center}
.b2a .kpi .kv{font-size:21px;font-weight:800;font-variant-numeric:tabular-nums}
.b2a .kpi .kv.good{color:var(--good)}
.b2a .kpi .kl{font-size:10px;color:var(--dim);margin-top:5px;text-transform:uppercase;letter-spacing:.04em;line-height:1.3}

.b2a .sl{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);font-weight:700;margin:26px 26px 12px;display:flex;align-items:center;gap:10px}
.b2a .sl::after{content:"";flex:1;height:1px;background:var(--line)}

.b2a .sct{margin:0 22px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:4px 16px}
.b2a .srow{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid var(--line);flex-wrap:wrap}
.b2a .srow:first-child{border-top:none}
.b2a .sn{font-weight:800;font-size:14px;width:26px}
.b2a .track{flex:1;height:7px;background:#1c2531;border-radius:4px;position:relative;min-width:90px}
.b2a .mk{position:absolute;top:50%;transform:translate(-50%,-50%);height:13px;width:4px;border-radius:3px}
.b2a .sd{font-size:13px;font-weight:800;width:56px;text-align:right;font-variant-numeric:tabular-nums}
.b2a .sr{font-size:11.5px;color:var(--dim);width:100%;padding-left:38px}
.b2a .g-forte{background:var(--good)} .b2a .g-ok{background:var(--mid)} .b2a .g-sangra{background:var(--bad)}
.b2a .t-forte{color:var(--good)} .b2a .t-ok{color:var(--mid)} .b2a .t-sangra{color:var(--bad)}

.b2a .read{margin:0 22px;display:grid;gap:10px}
.b2a .ritem{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:13px 15px;display:flex;gap:11px;align-items:flex-start}
.b2a .ritem .ri{font-size:18px;line-height:1.3}
.b2a .ritem .rt{font-size:13.5px;line-height:1.55;color:#d3dbe6}
.b2a .ritem .rt b{color:#fff}

.b2a .tbl{margin:0 22px;background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.b2a .trow{display:flex;align-items:center;gap:11px;padding:12px 15px;border-top:1px solid var(--line);font-size:14px}
.b2a .trow:first-child{border-top:none}
.b2a .trow.me{background:rgba(59,130,246,.14)}
.b2a .tp{color:var(--dim);font-weight:700;width:20px}
.b2a .tc{color:var(--accent);font-weight:800;width:38px}
.b2a .trow.me .tc{color:#8fb4ff}
.b2a .tn{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.b2a .trow.me .tn{font-weight:700}
.b2a .tt{color:var(--dim);font-size:12.5px;font-variant-numeric:tabular-nums}
.b2a .trow.me .tt{color:var(--ink)}

.b2a .errbox{margin:4px 22px 0;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);color:#fca5a5;border-radius:14px;padding:15px;font-size:13.5px;line-height:1.5}
.b2a .foot{text-align:center;color:#48515f;font-size:10.5px;margin:26px 0 22px}
`;

const Box2Analysis = forwardRef<HTMLDivElement, Props>(({ analysis: a, insights: j, meta }, ref) => {
  const titulo = meta.sessao || "Sessão";
  const data = meta.data || new Date().toLocaleDateString("pt-BR");

  const kpis: { v: string; l: string; good?: boolean }[] = [];
  if (a.mesa) kpis.push({ v: `${a.mesa}s`, l: "na mesa · real vs ideal", good: parseFloat(a.mesa) <= 0 });
  if (a.leader) kpis.push({ v: `${a.leader.gap}s`, l: `pro líder · #${a.leader.num}` });
  if (a.rivalAhead) kpis.push({ v: `${a.rivalAhead.gap}s`, l: `rival à frente · #${a.rivalAhead.num}` });

  const sectors = j.sectors || [];
  const mx = Math.max(...sectors.map((s) => Math.abs(s.deltaMs)), 200);

  const brigar =
    j.worstSector && j.worstSector.deltaMs > 0
      ? `Ataque o ${j.worstSector.s} — perde ${j.worstSector.deltaStr}s para #${j.worstSector.best} ${j.worstSector.bestName}. É o tempo mais barato de recuperar.`
      : j.rivalAhead
      ? `Mire o #${j.rivalAhead.num} ${j.rivalAhead.name}, ${j.rivalAhead.gapStr}s à frente — está ao alcance.`
      : "Sem ponto crítico claro. Busque ritmo geral colando nos parciais do líder.";
  const defender =
    j.bestSector && j.bestSector.isOwn
      ? `Você manda no ${j.bestSector.s} — é o melhor da classe ali. Mantenha essa referência.`
      : j.bestSector
      ? `Seu ponto mais forte é o ${j.bestSector.s} (${j.bestSector.deltaStr}s do melhor). Segure esse ritmo.`
      : j.rivalBehind
      ? `De olho no #${j.rivalBehind.num} ${j.rivalBehind.name} logo atrás (${j.rivalBehind.gap}s).`
      : "—";
  const ganho =
    j.voltaTeorica && j.voltaTeorica.posGain > 0
      ? `Juntando seus melhores setores numa volta (${j.voltaTeorica.idealStr}), você sobe para ${j.voltaTeorica.projectedPos}º — ${j.mesaStr}s já estão na mesa.`
      : a.mesa
      ? `Há ${a.mesa}s na mesa: tempo já feito em setores soltos, esperando uma volta limpa.`
      : null;

  return (
    <div className="b2a" ref={ref}>
      <style>{CSS}</style>

      <div className="hero">
        <div className="flag">
          <i /><i /><i />
        </div>
        <div className="ey">Carrera Sport · {titulo}</div>
        <div className="name">
          Silvio Morestoni<span className="num">#2</span>
        </div>
        <div className="meta">
          {data}
          {j.laps ? ` · ${j.laps} voltas` : ""}
        </div>
      </div>

      {!j.silvioFound ? (
        <div className="errbox">
          O #2 (Silvio) não está nos dados desta sessão. Adicione a melhor volta dele para a análise completa.
        </div>
      ) : (
        <>
          {j.foco && (
            <div className="focus">
              <div className="ico">{j.foco.kind === "setor" ? "🎯" : j.foco.kind === "consistencia" ? "⏱️" : "🏁"}</div>
              <div>
                <div className="fl">Onde focar agora</div>
                <div className="ft">{j.foco.title}</div>
                <div className="fd">{j.foco.detail}</div>
              </div>
              {j.foco.gainMs > 0 && <div className="badge">~{(j.foco.gainMs / 1000).toFixed(2)}s</div>}
            </div>
          )}

          <div className="verdict">
            <div className="vbig">{j.pos}º</div>
            <div>
              <div className="vlab">Posição na Sport</div>
              <div className="vsub">de {j.total} na classe</div>
            </div>
            <div className="dots">
              {Array.from({ length: j.total || 0 }).map((_, i) => (
                <div key={i} className={`dot ${i + 1 === j.pos ? "on" : ""}`} />
              ))}
            </div>
          </div>

          {kpis.length > 0 && (
            <div className="kpis" style={{ gridTemplateColumns: `repeat(${kpis.length},1fr)` }}>
              {kpis.map((k, i) => (
                <div className="kpi" key={i}>
                  <div className={`kv ${k.good ? "good" : ""}`}>{k.v}</div>
                  <div className="kl">{k.l}</div>
                </div>
              ))}
            </div>
          )}

          {sectors.length > 0 && (
            <>
              <div className="sl">Setor a setor</div>
              <div className="sct">
                {sectors.map((s, i) => {
                  const pct = Math.min(96, (Math.abs(s.deltaMs) / mx) * 48);
                  const left = s.deltaMs >= 0 ? 50 + pct : 50 - pct;
                  return (
                    <div className="srow" key={i}>
                      <span className="sn">{s.s}</span>
                      <div className="track">
                        <span className={`mk g-${s.tag}`} style={{ left: `${left}%` }} />
                      </div>
                      <span className={`sd t-${s.tag}`}>{s.deltaStr}</span>
                      <span className="sr">
                        {s.isOwn ? "seu melhor setor — você lidera" : `melhor: #${s.best} ${s.bestName}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="sl">Leitura rápida</div>
          <div className="read">
            <div className="ritem">
              <span className="ri">🎯</span>
              <span className="rt">
                <b>Brigar.</b> {brigar}
              </span>
            </div>
            {defender !== "—" && (
              <div className="ritem">
                <span className="ri">🛡️</span>
                <span className="rt">
                  <b>Defender.</b> {defender}
                </span>
              </div>
            )}
            {ganho && (
              <div className="ritem">
                <span className="ri">⚡</span>
                <span className="rt">
                  <b>Ganho fácil.</b> {ganho}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="sl">Classificação Sport</div>
      <div className="tbl">
        {(a.standings || []).map((c, i) => (
          <div className={`trow ${c.me ? "me" : ""}`} key={i}>
            <span className="tp">{c.pos}</span>
            <span className="tc">#{c.num}</span>
            <span className="tn">{c.name}</span>
            <span className="tt">
              {c.lap || "--"}
              {c.laps ? ` · ${c.laps}v` : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="foot">BOX 2 · classe Sport</div>
    </div>
  );
});

Box2Analysis.displayName = "Box2Analysis";

export default Box2Analysis;
