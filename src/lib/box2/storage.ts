// src/lib/box2/storage.ts — memória das sessões (localStorage), para acompanhar a evolução.
import { CarInput } from "./analise";
import { computeInsights, Metrics } from "./insights";

export interface StoredRow {
  num: number;
  lap: string;
  s1: string;
  s2: string;
  s3: string;
  ideal: string;
  laps: string;
}

export interface SessionMeta {
  sessao: string;
  data: string;
  aviso: string;
}

export interface SessionSnapshot {
  id: string;
  savedAt: number;
  meta: SessionMeta;
  rows: StoredRow[];
  metrics: Metrics;
}

const KEY = "box2.sessions.v1";

function rowsToCars(rows: StoredRow[]): CarInput[] {
  return rows.map((r) => ({
    num: r.num,
    lap: r.lap?.trim() || null,
    s1: r.s1?.trim() || null,
    s2: r.s2?.trim() || null,
    s3: r.s3?.trim() || null,
    ideal: r.ideal?.trim() || null,
    laps: r.laps?.trim() ? parseInt(r.laps, 10) : null,
  }));
}

export function loadSessions(): SessionSnapshot[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SessionSnapshot[];
    return Array.isArray(arr) ? arr.sort((a, b) => a.savedAt - b.savedAt) : [];
  } catch {
    return [];
  }
}

function persist(list: SessionSnapshot[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function saveSession(meta: SessionMeta, rows: StoredRow[], id?: string): SessionSnapshot {
  const list = loadSessions();
  const metrics = computeInsights(rowsToCars(rows)).metrics;
  const snap: SessionSnapshot = {
    id: id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    savedAt: Date.now(),
    meta,
    rows,
    metrics,
  };
  const idx = list.findIndex((s) => s.id === snap.id);
  if (idx >= 0) list[idx] = { ...snap, savedAt: list[idx].savedAt };
  else list.push(snap);
  persist(list);
  return snap;
}

export function deleteSession(id: string) {
  persist(loadSessions().filter((s) => s.id !== id));
}

export function clearSessions() {
  persist([]);
}
