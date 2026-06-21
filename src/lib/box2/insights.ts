// src/lib/box2/insights.ts — análise inteligente da sessão para o #2 (Silvio).
// Vai além do relatório base: foco prioritário, pior/melhor setor, rival principal,
// volta teórica + projeção de posição, potencial da classe e maturidade de pace.
import { CarInput, SPORT, SILVIO, Tag, toMs, fmtDelta, fmtLap } from "./analise";

const SECTOR_LABELS = ["S1", "S2", "S3"] as const;

interface ParsedCar {
  num: number;
  name: string;
  lap: number | null;
  ideal: number | null;
  s: (number | null)[];
  laps: number | null;
}

function parse(cars: CarInput[]): ParsedCar[] {
  return cars
    .filter((c) => SPORT[c.num])
    .map((c) => ({
      num: c.num,
      name: SPORT[c.num],
      lap: toMs(c.lap),
      ideal: toMs(c.ideal),
      s: [toMs(c.s1), toMs(c.s2), toMs(c.s3)],
      laps: c.laps ?? null,
    }));
}

function tagFor(deltaMs: number): Tag {
  return deltaMs <= 50 ? "forte" : deltaMs <= 150 ? "ok" : "sangra";
}

export interface SectorInsight {
  s: string;
  meMs: number;
  bestMs: number;
  deltaMs: number;
  deltaStr: string;
  best: number;
  bestName: string;
  tag: Tag;
  isOwn: boolean;
}

export interface RivalInsight {
  num: number;
  name: string;
  gapMs: number;
  gapStr: string;
  laps: number | null;
}

export interface Metrics {
  bestLapMs: number | null;
  pos: number | null;
  total: number | null;
  mesaMs: number | null;
  gapLeaderMs: number | null;
  sectorDeltaMs: { S1: number | null; S2: number | null; S3: number | null };
}

export interface Insights {
  silvioFound: boolean;
  pos: number | null;
  total: number;
  laps: number | null;
  sectors: SectorInsight[];
  worstSector: SectorInsight | null;
  bestSector: SectorInsight | null;
  leader: RivalInsight | null;
  rivalAhead: RivalInsight | null;
  rivalBehind: RivalInsight | null;
  mainRival: { rival: RivalInsight; kind: "ahead" | "behind" } | null;
  mesaMs: number | null;
  mesaStr: string | null;
  // foco prioritário
  foco: { kind: "setor" | "consistencia" | "geral"; gainMs: number; title: string; detail: string } | null;
  // volta teórica (juntando os melhores setores próprios = ideal) e projeção
  voltaTeorica: { idealStr: string; projectedPos: number; posGain: number } | null;
  // potencial da classe (somar o melhor setor de cada um na Sport)
  potencialClasse: { sumStr: string; deltaToIdealMs: number; deltaStr: string } | null;
  // maturidade
  maturidade: { laps: number; imatura: boolean; msg: string } | null;
  metrics: Metrics;
}

export function computeInsights(cars: CarInput[]): Insights {
  const p = parse(cars);
  const ranked = p.filter((c) => c.lap != null).sort((a, b) => (a.lap as number) - (b.lap as number));
  const me = p.find((c) => c.num === SILVIO);
  const silvioFound = !!(me && me.lap != null);

  const emptyMetrics: Metrics = {
    bestLapMs: null,
    pos: null,
    total: ranked.length,
    mesaMs: null,
    gapLeaderMs: null,
    sectorDeltaMs: { S1: null, S2: null, S3: null },
  };

  if (!silvioFound || !me) {
    return {
      silvioFound: false,
      pos: null,
      total: ranked.length,
      laps: null,
      sectors: [],
      worstSector: null,
      bestSector: null,
      leader: null,
      rivalAhead: null,
      rivalBehind: null,
      mainRival: null,
      mesaMs: null,
      mesaStr: null,
      foco: null,
      voltaTeorica: null,
      potencialClasse: null,
      maturidade: null,
      metrics: emptyMetrics,
    };
  }

  const pos = ranked.findIndex((c) => c.num === SILVIO) + 1;
  const total = ranked.length;

  // ---- setores ----
  const sectors: SectorInsight[] = [];
  SECTOR_LABELS.forEach((label, i) => {
    const vals = p.filter((c) => c.s[i] != null).map((c) => c.s[i] as number);
    if (vals.length && me.s[i] != null) {
      const bestMs = Math.min(...vals);
      const owner = p.find((c) => c.s[i] === bestMs) as ParsedCar;
      const deltaMs = (me.s[i] as number) - bestMs;
      sectors.push({
        s: label,
        meMs: me.s[i] as number,
        bestMs,
        deltaMs,
        deltaStr: fmtDelta(deltaMs),
        best: owner.num,
        bestName: owner.name,
        tag: tagFor(deltaMs),
        isOwn: owner.num === SILVIO,
      });
    }
  });

  const lossSectors = sectors.filter((s) => s.deltaMs > 0);
  const worstSector = lossSectors.length
    ? lossSectors.reduce((a, b) => (b.deltaMs > a.deltaMs ? b : a))
    : null;
  const bestSector = sectors.length
    ? sectors.reduce((a, b) => (b.deltaMs < a.deltaMs ? b : a))
    : null;

  // ---- rivais ----
  const mkRival = (c: ParsedCar): RivalInsight => ({
    num: c.num,
    name: c.name,
    gapMs: (me.lap as number) - (c.lap as number),
    gapStr: fmtDelta((me.lap as number) - (c.lap as number)),
    laps: c.laps,
  });
  const leader = ranked[0] && ranked[0].num !== SILVIO ? mkRival(ranked[0]) : null;
  const rivalAhead = pos > 1 ? mkRival(ranked[pos - 2]) : null;
  const rivalBehind = pos < ranked.length ? mkRival(ranked[pos]) : null;

  let mainRival: Insights["mainRival"] = null;
  if (rivalAhead && rivalBehind) {
    mainRival =
      Math.abs(rivalAhead.gapMs) <= Math.abs(rivalBehind.gapMs)
        ? { rival: rivalAhead, kind: "ahead" }
        : { rival: rivalBehind, kind: "behind" };
  } else if (rivalAhead) {
    mainRival = { rival: rivalAhead, kind: "ahead" };
  } else if (rivalBehind) {
    mainRival = { rival: rivalBehind, kind: "behind" };
  }

  // ---- consistência (na mesa) ----
  const mesaMs = me.ideal != null ? (me.lap as number) - me.ideal : null;
  const mesaStr = mesaMs != null ? fmtDelta(mesaMs) : null;

  // ---- foco prioritário ----
  const candidates: { kind: "setor" | "consistencia"; gainMs: number }[] = [];
  if (worstSector && worstSector.deltaMs > 30) candidates.push({ kind: "setor", gainMs: worstSector.deltaMs });
  if (mesaMs != null && mesaMs > 30) candidates.push({ kind: "consistencia", gainMs: mesaMs });
  let foco: Insights["foco"] = null;
  if (candidates.length) {
    const top = candidates.reduce((a, b) => (b.gainMs > a.gainMs ? b : a));
    if (top.kind === "setor" && worstSector) {
      foco = {
        kind: "setor",
        gainMs: top.gainMs,
        title: `Foco no ${worstSector.s}`,
        detail: `É onde mais sangra: ${worstSector.deltaStr}s para #${worstSector.best} ${worstSector.bestName}. Igualar esse setor vale ~${(top.gainMs / 1000).toFixed(3)}s na volta — o ganho mais rápido agora.`,
      };
    } else {
      foco = {
        kind: "consistencia",
        gainMs: top.gainMs,
        title: "Foco em consistência",
        detail: `Há ${mesaStr}s 'na mesa' — esse tempo já foi feito em setores soltos. Juntar numa volta limpa vale ~${(top.gainMs / 1000).toFixed(3)}s sem andar mais rápido.`,
      };
    }
  } else {
    foco = {
      kind: "geral",
      gainMs: 0,
      title: "Pace maduro e limpo",
      detail: "Sem setor crítico nem tempo solto relevante. O ganho agora é baixar o ritmo geral — busque referência nos parciais do líder da classe.",
    };
  }

  // ---- volta teórica + projeção de posição (se bater a própria ideal) ----
  let voltaTeorica: Insights["voltaTeorica"] = null;
  if (me.ideal != null) {
    const field = ranked.map((c) => ({ num: c.num, t: c.num === SILVIO ? (me.ideal as number) : (c.lap as number) }));
    field.sort((a, b) => a.t - b.t);
    const newPos = field.findIndex((c) => c.num === SILVIO) + 1;
    voltaTeorica = { idealStr: fmtLap(me.ideal), projectedPos: newPos, posGain: pos - newPos };
  }

  // ---- potencial da classe (soma do melhor setor de cada na Sport) ----
  let potencialClasse: Insights["potencialClasse"] = null;
  const classBest = SECTOR_LABELS.map((_, i) => {
    const vals = p.filter((c) => c.s[i] != null).map((c) => c.s[i] as number);
    return vals.length ? Math.min(...vals) : null;
  });
  if (classBest.every((v) => v != null) && me.ideal != null) {
    const sum = classBest.reduce((a, b) => (a as number) + (b as number), 0) as number;
    potencialClasse = {
      sumStr: fmtLap(sum),
      deltaToIdealMs: (me.ideal as number) - sum,
      deltaStr: fmtDelta((me.ideal as number) - sum),
    };
  }

  // ---- maturidade de pace ----
  const maturidade =
    me.laps != null
      ? {
          laps: me.laps,
          imatura: me.laps < 8,
          msg:
            me.laps < 8
              ? `Apenas ${me.laps} volta(s) — pace ainda imaturo, os números tendem a melhorar com mais rodagem.`
              : `${me.laps} voltas — amostra sólida, os tempos já são representativos.`,
        }
      : null;

  const metrics: Metrics = {
    bestLapMs: me.lap as number,
    pos,
    total,
    mesaMs,
    gapLeaderMs: leader ? leader.gapMs : 0,
    sectorDeltaMs: {
      S1: sectors.find((s) => s.s === "S1")?.deltaMs ?? null,
      S2: sectors.find((s) => s.s === "S2")?.deltaMs ?? null,
      S3: sectors.find((s) => s.s === "S3")?.deltaMs ?? null,
    },
  };

  return {
    silvioFound: true,
    pos,
    total,
    laps: me.laps,
    sectors,
    worstSector,
    bestSector,
    leader,
    rivalAhead,
    rivalBehind,
    mainRival,
    mesaMs,
    mesaStr,
    foco,
    voltaTeorica,
    potencialClasse,
    maturidade,
    metrics,
  };
}
