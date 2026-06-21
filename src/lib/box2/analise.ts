// src/lib/box2/analise.ts — análise da classe Carrera Sport a partir dos tempos lidos.
// Porte fiel de motor/analise.js (BOX 2), sem dependências externas.

export const SPORT: Record<number, string> = {
  1: "Alceu Feldmann", 2: "Silvio Morestoni", 3: "Cristian Mohr", 14: "Carlos Campos",
  22: "Raijan Mascarello", 23: "Leonardo Herrmann", 27: "Josimar Junior", 29: "Rodrigo Mello",
  31: "Sebá Malucelli", 51: "Israel Salmen", 67: "Gustavo Zanon", 77: "Francisco Horta",
  80: "Rouman Ziemkiewicz", 888: "Lineu Pires",
};

export const SILVIO = 2;

export type Tag = "forte" | "ok" | "sangra";

/** Entrada bruta de um carro: tempos como string ("1:33.085" / "26.000") ou null. */
export interface CarInput {
  num: number;
  lap?: string | null;
  s1?: string | null;
  s2?: string | null;
  s3?: string | null;
  ideal?: string | null;
  laps?: number | null;
}

export interface StandingRow {
  pos: number;
  num: number;
  name: string;
  lap: string;
  laps: number | null;
  me: boolean;
}

export interface SectorRow {
  s: string;
  me: string;
  delta: string;
  best: number;
  bestName: string;
  tag: Tag;
}

export interface RivalRef {
  num: number;
  name: string;
  gap: string;
}

export interface Summary {
  brigar: string;
  defender: string;
  mesa: string | null;
}

export interface Analysis {
  standings: StandingRow[];
  silvioFound: boolean;
  pos?: number;
  total?: number;
  leader?: RivalRef;
  mesa?: string;
  rivalAhead?: RivalRef;
  rivalBehind?: RivalRef;
  sectors?: SectorRow[];
  summary?: Summary;
}

export function toMs(t: string | number | null | undefined): number | null {
  if (t == null || t === "-" || t === "") return null;
  const str = ("" + t).trim();
  if (str.includes(":")) {
    const [m, r] = str.split(":");
    const v = +m * 60000 + Math.round(parseFloat(r) * 1000);
    return isNaN(v) ? null : v;
  }
  const v = Math.round(parseFloat(str) * 1000);
  return isNaN(v) ? null : v;
}

export function fmtDelta(ms: number | null): string {
  if (ms == null) return "--";
  return (ms >= 0 ? "+" : "-") + (Math.abs(ms) / 1000).toFixed(3);
}

export function fmtLap(ms: number | null): string {
  if (ms == null) return "--";
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(3);
  return m > 0 ? `${m}:${s.padStart(6, "0")}` : s;
}

interface CarCalc extends CarInput {
  _lap: number | null;
  _ideal: number | null;
  _s1: number | null;
  _s2: number | null;
  _s3: number | null;
  pos?: number;
}

export function analyze(carsInput: CarInput[]): Analysis {
  const cars: CarCalc[] = carsInput
    .filter((c) => SPORT[c.num]) // só Sport oficial
    .map((c) => ({
      ...c,
      _lap: toMs(c.lap),
      _ideal: toMs(c.ideal),
      _s1: toMs(c.s1),
      _s2: toMs(c.s2),
      _s3: toMs(c.s3),
    }));

  const ranked = cars.filter((c) => c._lap).sort((a, b) => (a._lap as number) - (b._lap as number));
  ranked.forEach((c, i) => (c.pos = i + 1));
  const me = cars.find((c) => c.num === SILVIO);

  const out: Analysis = {
    standings: ranked.map((c) => ({
      pos: c.pos as number,
      num: c.num,
      name: SPORT[c.num],
      lap: c.lap || fmtLap(c._lap),
      laps: c.laps ?? null,
      me: c.num === SILVIO,
    })),
    silvioFound: !!(me && me._lap),
  };

  if (out.silvioFound && me) {
    out.pos = me.pos;
    out.total = ranked.length;
    const leader = ranked[0];
    if (leader.num !== SILVIO) {
      out.leader = { num: leader.num, name: SPORT[leader.num], gap: fmtDelta((me._lap as number) - (leader._lap as number)) };
    }
    if (me._ideal) out.mesa = fmtDelta((me._lap as number) - me._ideal);
    if ((me.pos as number) > 1) {
      const r = ranked[(me.pos as number) - 2];
      out.rivalAhead = { num: r.num, name: SPORT[r.num], gap: fmtDelta((me._lap as number) - (r._lap as number)) };
    }
    if ((me.pos as number) < ranked.length) {
      const r = ranked[me.pos as number];
      out.rivalBehind = { num: r.num, name: SPORT[r.num], gap: fmtDelta((me._lap as number) - (r._lap as number)) };
    }
    out.sectors = [];
    ([["S1", "_s1"], ["S2", "_s2"], ["S3", "_s3"]] as const).forEach(([nm, k]) => {
      const vals = cars.filter((c) => c[k] != null).map((c) => c[k] as number);
      if (vals.length && me[k] != null) {
        const best = Math.min(...vals);
        const bc = cars.find((c) => c[k] === best) as CarCalc;
        const d = (me[k] as number) - best;
        out.sectors!.push({
          s: nm,
          me: fmtLap(me[k] as number),
          delta: fmtDelta(d),
          best: bc.num,
          bestName: SPORT[bc.num],
          tag: d <= 50 ? "forte" : d <= 150 ? "ok" : "sangra",
        });
      }
    });
    // resumo textual
    const worst = (out.sectors || [])
      .filter((s) => s.tag === "sangra")
      .sort((a, b) => parseFloat(b.delta) - parseFloat(a.delta))[0];
    const strong = (out.sectors || []).find((s) => s.tag === "forte");
    out.summary = {
      brigar: worst
        ? `Maior perda no ${worst.s}: ${worst.delta}s para #${worst.best} ${worst.bestName}. É onde está o tempo a recuperar.`
        : "Sem setor crítico identificado nos dados.",
      defender: strong
        ? `Forte no ${strong.s} — mantenha o ritmo desse setor.`
        : out.rivalBehind
        ? `Cuidado com #${out.rivalBehind.num} ${out.rivalBehind.name} logo atrás (${out.rivalBehind.gap}s).`
        : "—",
      mesa: out.mesa
        ? `Há ${out.mesa}s 'na mesa' — tempo já feito, juntando os melhores setores numa volta.`
        : null,
    };
  }
  return out;
}
