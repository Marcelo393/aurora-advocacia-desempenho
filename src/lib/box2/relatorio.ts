// src/lib/box2/relatorio.ts — gera o HTML bonito e autocontido (idêntico ao motor/relatorio.js).
import { analyze, CarInput } from "./analise";

export interface ReportMeta {
  sessao?: string;
  data?: string;
  aviso?: string;
}

function esc(s: unknown): string {
  return ("" + s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}

export function gerarHTML(cars: CarInput[], meta: ReportMeta = {}): string {
  const j = analyze(cars);
  const titulo = meta.sessao || "Sessão";
  const data = meta.data || new Date().toLocaleDateString("pt-BR");
  const aviso = meta.aviso || "";

  const kpis: { v: string; l: string; good?: boolean }[] = [];
  if (j.mesa) kpis.push({ v: j.mesa, l: "na mesa · real vs ideal", good: parseFloat(j.mesa) <= 0 });
  if (j.leader) kpis.push({ v: j.leader.gap, l: `pro líder · #${j.leader.num}` });
  if (j.rivalAhead) kpis.push({ v: j.rivalAhead.gap, l: `rival à frente · #${j.rivalAhead.num}` });

  const sectorsHTML = (j.sectors || [])
    .map((s) => {
      const dv = parseFloat(s.delta) || 0;
      const mx = Math.max(...(j.sectors || []).map((x) => Math.abs(parseFloat(x.delta)) || 0), 0.2);
      const pct = Math.min(96, (Math.abs(dv) / mx) * 48);
      const pos = dv >= 0 ? `left:${50 + pct}%` : `left:${50 - pct}%`;
      const bt = s.best === 2 ? "seu melhor setor" : `melhor: #${s.best} ${esc(s.bestName)}`;
      return `<div class="srow"><span class="sn">${s.s}</span>
      <div class="track"><span class="mk bg-${s.tag}" style="${pos}"></span></div>
      <span class="sd ${s.tag}">${s.delta}</span>
      <span class="sr">${bt}</span></div>`;
    })
    .join("");

  const standingsHTML = (j.standings || [])
    .map(
      (c) => `
    <div class="trow ${c.me ? "me" : ""}">
      <span class="tp">${c.pos}</span><span class="tc">#${c.num}</span>
      <span class="tn">${esc(c.name)}</span>
      <span class="tt">${esc(c.lap || "--")}${c.laps ? ` · ${c.laps}v` : ""}</span>
    </div>`
    )
    .join("");

  const sum = j.summary || ({} as NonNullable<typeof j.summary>);
  const readHTML = j.silvioFound
    ? `
    <div class="sl">Leitura rápida</div>
    <div class="read">
      ${sum.brigar ? `<p><b>🎯 Brigar</b> ${esc(sum.brigar)}</p>` : ""}
      ${sum.defender ? `<p><b>🛡️ Defender</b> ${esc(sum.defender)}</p>` : ""}
      ${sum.mesa ? `<p><b>⏱️ Ganho fácil</b> ${esc(sum.mesa)}</p>` : ""}
    </div>`
    : `<div class="errbox">O #2 (Silvio) não estava nos dados desta sessão. Classificação da Sport abaixo.</div>`;

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BOX 2 · ${esc(titulo)}</title><style>
:root{--bg:#0b0d10;--ink:#f2f5f8;--dim:#7d8794;--line:#1a1f26;--sport:#3b82f6;--sport-d:#15294d;--card:#10141a;--good:#34d399;--bad:#f87171;--mid:#fbbf24}
*{margin:0;padding:0;box-sizing:border-box}body{background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;max-width:560px;margin:0 auto;padding-bottom:50px}
.hero{padding:30px 24px 20px}.flag{display:flex;gap:3px;margin-bottom:14px}.flag i{width:13px;height:13px;border-radius:2px;background:repeating-conic-gradient(#fff 0 25%,#0b0d10 0 50%) 0/8px 8px}
.ey{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--sport);font-weight:700;display:flex;align-items:center;gap:8px}.ey::after{content:"";flex:1;height:1px;background:var(--line)}
.name{font-size:30px;font-weight:800;letter-spacing:-.03em;margin-top:12px}.name .num{font-size:12px;color:var(--sport);border:1.5px solid var(--sport);border-radius:6px;padding:2px 7px;margin-left:9px;vertical-align:middle}
.meta{color:var(--dim);font-size:13px;margin-top:9px}.wrap{padding:0 24px}
.warn{background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);color:#e0c067;border-radius:12px;padding:12px 15px;font-size:12.5px;line-height:1.5;margin-bottom:16px}
.verdict{background:linear-gradient(160deg,var(--sport-d),var(--card));border:1px solid var(--sport-d);border-radius:18px;padding:20px;margin-bottom:14px}
.vp{font-size:11px;color:#9dc0ff;letter-spacing:.1em;text-transform:uppercase;font-weight:700}.vb{display:flex;align-items:baseline;gap:10px;margin-top:7px}.vb b{font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1}.vb span{font-size:14px;color:var(--dim);font-weight:600}
.kpis{display:grid;gap:9px;margin-bottom:6px}.kpi{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:14px 12px;text-align:center}.kpi .kv{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}.kpi .kl{font-size:10px;color:var(--dim);margin-top:4px;text-transform:uppercase;letter-spacing:.04em}
.sl{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);font-weight:700;margin:24px 4px 11px;display:flex;align-items:center;gap:10px}.sl::after{content:"";flex:1;height:1px;background:var(--line)}
.sct{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:3px 15px}.srow{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line);flex-wrap:wrap}.srow:first-child{border-top:none}.sn{font-weight:800;font-size:14px;width:26px}.track{flex:1;height:6px;background:#1a2029;border-radius:3px;position:relative;min-width:80px}.mk{position:absolute;top:50%;transform:translateY(-50%);height:11px;width:3px;border-radius:2px}.sd{font-size:13px;font-weight:800;width:56px;text-align:right;font-variant-numeric:tabular-nums}.sr{font-size:11px;color:var(--dim);width:100%;padding-left:38px}
.forte,.bg-forte{color:var(--good)}.ok,.bg-ok{color:var(--mid)}.sangra,.bg-sangra{color:var(--bad)}.bg-forte{background:var(--good)}.bg-ok{background:var(--mid)}.bg-sangra{background:var(--bad)}
.read p{font-size:14px;line-height:1.6;padding:11px 0;border-top:1px solid var(--line)}.read p:first-child{border-top:none}.read b{color:var(--ink);margin-right:6px}
.tbl{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}.trow{display:flex;align-items:center;gap:11px;padding:12px 15px;border-top:1px solid var(--line);font-size:14px}.trow:first-child{border-top:none}.trow.me{background:rgba(59,130,246,.12)}.tp{color:var(--dim);font-weight:700;width:20px}.tc{color:var(--sport);font-weight:800;width:36px}.trow.me .tc{color:#7aa6ff}.tn{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.trow.me .tn{font-weight:700}.tt{color:var(--dim);font-size:12.5px;font-variant-numeric:tabular-nums}.trow.me .tt{color:var(--ink)}
.errbox{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);color:#fca5a5;border-radius:13px;padding:15px;font-size:13px;line-height:1.5;margin-bottom:14px}
.foot{text-align:center;color:#4a5462;font-size:10.5px;margin-top:24px;line-height:1.6}
</style></head><body>
<div class="hero"><div class="flag"><i></i><i></i><i></i></div>
<div class="ey">Carrera Sport · ${esc(titulo)}</div>
<div class="name">Silvio Morestoni<span class="num">#2</span></div>
<div class="meta">${esc(data)}</div></div>
<div class="wrap">
${aviso ? `<div class="warn">⚠ ${esc(aviso)}</div>` : ""}
${j.silvioFound ? `<div class="verdict"><div class="vp">Posição na Sport</div><div class="vb"><b>${j.pos}º</b><span>de ${j.total} na classe</span></div></div>` : ""}
${kpis.length ? `<div class="kpis" style="grid-template-columns:repeat(${kpis.length},1fr)">${kpis.map((k) => `<div class="kpi"><div class="kv ${k.good ? "forte" : ""}">${k.v}</div><div class="kl">${k.l}</div></div>`).join("")}</div>` : ""}
${sectorsHTML ? `<div class="sl">Setor a setor</div><div class="sct">${sectorsHTML}</div>` : ""}
${readHTML}
<div class="sl">Classificação Sport</div><div class="tbl">${standingsHTML}</div>
<div class="foot">BOX 2 · classe Sport · gerado pelo Claude Code</div>
</div></body></html>`;
}
