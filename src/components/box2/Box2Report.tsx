import React, { forwardRef } from "react";
import { Analysis } from "@/lib/box2/analise";
import { ReportMeta } from "@/lib/box2/relatorio";

interface Props {
  analysis: Analysis;
  meta: ReportMeta;
}

// CSS idêntico ao relatório autocontido, porém escopado em .box2-report
// para não vazar para o resto do app (que tem tema claro).
const REPORT_CSS = `
.box2-report{--bg:#0b0d10;--ink:#f2f5f8;--dim:#7d8794;--line:#1a1f26;--sport:#3b82f6;--sport-d:#15294d;--card:#10141a;--good:#34d399;--bad:#f87171;--mid:#fbbf24;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;max-width:560px;margin:0 auto;padding-bottom:50px;border-radius:18px;overflow:hidden}
.box2-report *{margin:0;padding:0;box-sizing:border-box}
.box2-report .hero{padding:30px 24px 20px}
.box2-report .flag{display:flex;gap:3px;margin-bottom:14px}
.box2-report .flag i{width:13px;height:13px;border-radius:2px;background:repeating-conic-gradient(#fff 0 25%,#0b0d10 0 50%) 0/8px 8px}
.box2-report .ey{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--sport);font-weight:700;display:flex;align-items:center;gap:8px}
.box2-report .ey::after{content:"";flex:1;height:1px;background:var(--line)}
.box2-report .name{font-size:30px;font-weight:800;letter-spacing:-.03em;margin-top:12px}
.box2-report .name .num{font-size:12px;color:var(--sport);border:1.5px solid var(--sport);border-radius:6px;padding:2px 7px;margin-left:9px;vertical-align:middle}
.box2-report .meta{color:var(--dim);font-size:13px;margin-top:9px}
.box2-report .wrap{padding:0 24px}
.box2-report .warn{background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);color:#e0c067;border-radius:12px;padding:12px 15px;font-size:12.5px;line-height:1.5;margin-bottom:16px}
.box2-report .verdict{background:linear-gradient(160deg,var(--sport-d),var(--card));border:1px solid var(--sport-d);border-radius:18px;padding:20px;margin-bottom:14px}
.box2-report .vp{font-size:11px;color:#9dc0ff;letter-spacing:.1em;text-transform:uppercase;font-weight:700}
.box2-report .vb{display:flex;align-items:baseline;gap:10px;margin-top:7px}
.box2-report .vb b{font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1}
.box2-report .vb span{font-size:14px;color:var(--dim);font-weight:600}
.box2-report .kpis{display:grid;gap:9px;margin-bottom:6px}
.box2-report .kpi{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:14px 12px;text-align:center}
.box2-report .kpi .kv{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}
.box2-report .kpi .kl{font-size:10px;color:var(--dim);margin-top:4px;text-transform:uppercase;letter-spacing:.04em}
.box2-report .sl{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);font-weight:700;margin:24px 4px 11px;display:flex;align-items:center;gap:10px}
.box2-report .sl::after{content:"";flex:1;height:1px;background:var(--line)}
.box2-report .sct{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:3px 15px}
.box2-report .srow{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line);flex-wrap:wrap}
.box2-report .srow:first-child{border-top:none}
.box2-report .sn{font-weight:800;font-size:14px;width:26px}
.box2-report .track{flex:1;height:6px;background:#1a2029;border-radius:3px;position:relative;min-width:80px}
.box2-report .mk{position:absolute;top:50%;transform:translateY(-50%);height:11px;width:3px;border-radius:2px}
.box2-report .sd{font-size:13px;font-weight:800;width:56px;text-align:right;font-variant-numeric:tabular-nums}
.box2-report .sr{font-size:11px;color:var(--dim);width:100%;padding-left:38px}
.box2-report .forte,.box2-report .bg-forte{color:var(--good)}
.box2-report .ok,.box2-report .bg-ok{color:var(--mid)}
.box2-report .sangra,.box2-report .bg-sangra{color:var(--bad)}
.box2-report .bg-forte{background:var(--good)}
.box2-report .bg-ok{background:var(--mid)}
.box2-report .bg-sangra{background:var(--bad)}
.box2-report .read p{font-size:14px;line-height:1.6;padding:11px 0;border-top:1px solid var(--line)}
.box2-report .read p:first-child{border-top:none}
.box2-report .read b{color:var(--ink);margin-right:6px}
.box2-report .tbl{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.box2-report .trow{display:flex;align-items:center;gap:11px;padding:12px 15px;border-top:1px solid var(--line);font-size:14px}
.box2-report .trow:first-child{border-top:none}
.box2-report .trow.me{background:rgba(59,130,246,.12)}
.box2-report .tp{color:var(--dim);font-weight:700;width:20px}
.box2-report .tc{color:var(--sport);font-weight:800;width:36px}
.box2-report .trow.me .tc{color:#7aa6ff}
.box2-report .tn{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.box2-report .trow.me .tn{font-weight:700}
.box2-report .tt{color:var(--dim);font-size:12.5px;font-variant-numeric:tabular-nums}
.box2-report .trow.me .tt{color:var(--ink)}
.box2-report .errbox{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);color:#fca5a5;border-radius:13px;padding:15px;font-size:13px;line-height:1.5;margin-bottom:14px}
.box2-report .foot{text-align:center;color:#4a5462;font-size:10.5px;margin-top:24px;line-height:1.6}
`;

const Box2Report = forwardRef<HTMLDivElement, Props>(({ analysis: j, meta }, ref) => {
  const titulo = meta.sessao || "Sessão";
  const data = meta.data || new Date().toLocaleDateString("pt-BR");
  const aviso = meta.aviso || "";

  const kpis: { v: string; l: string; good?: boolean }[] = [];
  if (j.mesa) kpis.push({ v: j.mesa, l: "na mesa · real vs ideal", good: parseFloat(j.mesa) <= 0 });
  if (j.leader) kpis.push({ v: j.leader.gap, l: `pro líder · #${j.leader.num}` });
  if (j.rivalAhead) kpis.push({ v: j.rivalAhead.gap, l: `rival à frente · #${j.rivalAhead.num}` });

  const sectors = j.sectors || [];
  const mx = Math.max(...sectors.map((x) => Math.abs(parseFloat(x.delta)) || 0), 0.2);
  const sum = j.summary;

  return (
    <div className="box2-report" ref={ref}>
      <style>{REPORT_CSS}</style>
      <div className="hero">
        <div className="flag">
          <i />
          <i />
          <i />
        </div>
        <div className="ey">Carrera Sport · {titulo}</div>
        <div className="name">
          Silvio Morestoni<span className="num">#2</span>
        </div>
        <div className="meta">{data}</div>
      </div>
      <div className="wrap">
        {aviso && <div className="warn">⚠ {aviso}</div>}
        {j.silvioFound && (
          <div className="verdict">
            <div className="vp">Posição na Sport</div>
            <div className="vb">
              <b>{j.pos}º</b>
              <span>de {j.total} na classe</span>
            </div>
          </div>
        )}
        {kpis.length > 0 && (
          <div className="kpis" style={{ gridTemplateColumns: `repeat(${kpis.length},1fr)` }}>
            {kpis.map((k, i) => (
              <div className="kpi" key={i}>
                <div className={`kv ${k.good ? "forte" : ""}`}>{k.v}</div>
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
                const dv = parseFloat(s.delta) || 0;
                const pct = Math.min(96, (Math.abs(dv) / mx) * 48);
                const left = dv >= 0 ? 50 + pct : 50 - pct;
                const bt = s.best === 2 ? "seu melhor setor" : `melhor: #${s.best} ${s.bestName}`;
                return (
                  <div className="srow" key={i}>
                    <span className="sn">{s.s}</span>
                    <div className="track">
                      <span className={`mk bg-${s.tag}`} style={{ left: `${left}%` }} />
                    </div>
                    <span className={`sd ${s.tag}`}>{s.delta}</span>
                    <span className="sr">{bt}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {j.silvioFound ? (
          <>
            <div className="sl">Leitura rápida</div>
            <div className="read">
              {sum?.brigar && (
                <p>
                  <b>🎯 Brigar</b> {sum.brigar}
                </p>
              )}
              {sum?.defender && (
                <p>
                  <b>🛡️ Defender</b> {sum.defender}
                </p>
              )}
              {sum?.mesa && (
                <p>
                  <b>⏱️ Ganho fácil</b> {sum.mesa}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="errbox">
            O #2 (Silvio) não estava nos dados desta sessão. Classificação da Sport abaixo.
          </div>
        )}
        <div className="sl">Classificação Sport</div>
        <div className="tbl">
          {(j.standings || []).map((c, i) => (
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
        <div className="foot">BOX 2 · classe Sport · gerado pelo Claude Code</div>
      </div>
    </div>
  );
});

Box2Report.displayName = "Box2Report";

export default Box2Report;
