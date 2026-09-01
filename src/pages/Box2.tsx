import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { analyze, CarInput, SPORT, SILVIO } from "@/lib/box2/analise";
import { gerarHTML } from "@/lib/box2/relatorio";
import { computeInsights } from "@/lib/box2/insights";
import { loadSessions, saveSession, SessionSnapshot, StoredRow } from "@/lib/box2/storage";
import Box2Analysis from "@/components/box2/Box2Analysis";
import Box2History from "@/components/box2/Box2History";

type Row = StoredRow;

const SPORT_NUMS = Object.keys(SPORT)
  .map(Number)
  .sort((a, b) => a - b);

const emptyRow = (num: number): Row => ({ num, lap: "", s1: "", s2: "", s3: "", ideal: "", laps: "" });

const DEMO_ROWS: Row[] = [
  { num: 2, lap: "1:33.085", s1: "", s2: "26.000", s3: "39.391", ideal: "1:32.721", laps: "6" },
  { num: 51, lap: "1:29.244", s1: "", s2: "", s3: "", ideal: "1:29.015", laps: "14" },
  { num: 31, lap: "1:29.736", s1: "26.563", s2: "26.563", s3: "", ideal: "1:29.692", laps: "15" },
  { num: 1, lap: "1:29.979", s1: "", s2: "26.474", s3: "", ideal: "1:29.803", laps: "19" },
  { num: 14, lap: "1:30.821", s1: "", s2: "26.711", s3: "", ideal: "1:30.314", laps: "13" },
];

function rowsToCars(rows: Row[]): CarInput[] {
  return rows.map((r) => ({
    num: r.num,
    lap: r.lap.trim() || null,
    s1: r.s1.trim() || null,
    s2: r.s2.trim() || null,
    s3: r.s3.trim() || null,
    ideal: r.ideal.trim() || null,
    laps: r.laps.trim() ? parseInt(r.laps, 10) : null,
  }));
}

const Box2: React.FC = () => {
  const [tab, setTab] = useState<"analise" | "evolucao">("analise");
  const [editorOpen, setEditorOpen] = useState(false);
  const [sessao, setSessao] = useState("Pré-temporada Interlagos");
  const [data, setData] = useState("28/02/2026");
  const [aviso, setAviso] = useState("");
  const [rows, setRows] = useState<Row[]>(DEMO_ROWS);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [sessions, setSessions] = useState<SessionSnapshot[]>(() => loadSessions());

  const reportRef = useRef<HTMLDivElement>(null);

  const cars = useMemo(() => rowsToCars(rows), [rows]);
  const analysis = useMemo(() => analyze(cars), [cars]);
  const insights = useMemo(() => computeInsights(cars), [cars]);
  const meta = { sessao, data, aviso };

  const update = (i: number, field: keyof Row, value: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: field === "num" ? Number(value) : value } : r)));

  const addRow = () => {
    const used = new Set(rows.map((r) => r.num));
    const next = SPORT_NUMS.find((n) => !used.has(n)) ?? SPORT_NUMS[0];
    setRows((prev) => [...prev, emptyRow(next)]);
  };
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const clearAll = () => {
    setRows([emptyRow(SILVIO)]);
    setCurrentId(undefined);
  };

  const refreshSessions = () => setSessions(loadSessions());

  const handleSave = () => {
    if (!insights.silvioFound) {
      toast.error("Inclua a melhor volta do #2 antes de salvar.");
      return;
    }
    const snap = saveSession(meta, rows, currentId);
    setCurrentId(snap.id);
    refreshSessions();
    toast.success("Sessão salva. Veja a evolução na aba ao lado.");
  };

  const handleLoad = (s: SessionSnapshot) => {
    setSessao(s.meta.sessao);
    setData(s.meta.data);
    setAviso(s.meta.aviso);
    setRows(s.rows.map((r) => ({ ...emptyRow(r.num), ...r })));
    setCurrentId(s.id);
    setTab("analise");
    toast.success("Sessão carregada.");
  };

  const fileBase = () =>
    (sessao || "box2")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "relatorio";

  const downloadHTML = () => {
    const blob = new Blob([gerarHTML(cars, meta)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const capture = async () => {
    const node = reportRef.current;
    if (!node) return null;
    return html2canvas(node, { backgroundColor: "#0d1117", scale: 2, useCORS: true });
  };

  const downloadPNG = async () => {
    setBusy(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${fileBase()}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  const downloadPDF = async () => {
    setBusy(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileBase()}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImgUrl(URL.createObjectURL(f));
  };

  const inputCls =
    "w-full bg-slate-900/70 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500";
  const tabBtn = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-200"
    }`;
  const actionBtn =
    "rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 px-4 py-2 text-sm font-medium transition disabled:opacity-50";

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{ background: "radial-gradient(120% 50% at 50% -5%,#16213a 0%,#0a0d12 50%)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-7">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-[12px] tracking-[0.22em] uppercase text-blue-400 font-extrabold">BOX 2</div>
          <div className="flex gap-1 bg-slate-900/60 border border-slate-800 rounded-full p-1">
            <button className={tabBtn(tab === "analise")} onClick={() => setTab("analise")}>
              Análise
            </button>
            <button className={tabBtn(tab === "evolucao")} onClick={() => setTab("evolucao")}>
              Evolução{sessions.length > 0 ? ` (${sessions.length})` : ""}
            </button>
          </div>
        </div>

        {tab === "analise" ? (
          <>
            {/* Ações */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                className={`${actionBtn} ${editorOpen ? "border-blue-500 text-blue-300" : ""}`}
                onClick={() => setEditorOpen((v) => !v)}
              >
                ✎ Editar tempos
              </button>
              <button
                className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold transition"
                onClick={handleSave}
              >
                {currentId ? "✓ Atualizar sessão" : "💾 Salvar sessão"}
              </button>
              <div className="flex-1" />
              <button className={actionBtn} onClick={downloadPNG} disabled={busy}>
                {busy ? "…" : "PNG"}
              </button>
              <button className={actionBtn} onClick={downloadPDF} disabled={busy}>
                PDF
              </button>
              <button className={actionBtn} onClick={downloadHTML}>
                HTML
              </button>
            </div>

            {/* Editor recolhível */}
            {editorOpen && (
              <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <label className="text-sm">
                    <span className="block text-slate-400 mb-1">Sessão</span>
                    <input className={inputCls} value={sessao} onChange={(e) => setSessao(e.target.value)} />
                  </label>
                  <label className="text-sm">
                    <span className="block text-slate-400 mb-1">Data</span>
                    <input className={inputCls} value={data} onChange={(e) => setData(e.target.value)} />
                  </label>
                  <label className="text-sm">
                    <span className="block text-slate-400 mb-1">Aviso (opcional)</span>
                    <input className={inputCls} value={aviso} onChange={(e) => setAviso(e.target.value)} placeholder="ex: poucas voltas" />
                  </label>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="text-left font-medium px-2 py-2">Carro</th>
                        <th className="font-medium px-1 py-2">Volta</th>
                        <th className="font-medium px-1 py-2">S1</th>
                        <th className="font-medium px-1 py-2">S2</th>
                        <th className="font-medium px-1 py-2">S3</th>
                        <th className="font-medium px-1 py-2">Ideal</th>
                        <th className="font-medium px-1 py-2">Vlt</th>
                        <th className="px-1 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className={r.num === SILVIO ? "bg-blue-500/10" : ""}>
                          <td className="px-2 py-1.5">
                            <select className={inputCls} value={r.num} onChange={(e) => update(i, "num", e.target.value)}>
                              {SPORT_NUMS.map((n) => (
                                <option key={n} value={n}>
                                  #{n} {SPORT[n]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-1 py-1.5">
                            <input className={inputCls} placeholder="1:33.085" value={r.lap} onChange={(e) => update(i, "lap", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5">
                            <input className={inputCls} placeholder="—" value={r.s1} onChange={(e) => update(i, "s1", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5">
                            <input className={inputCls} placeholder="—" value={r.s2} onChange={(e) => update(i, "s2", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5">
                            <input className={inputCls} placeholder="—" value={r.s3} onChange={(e) => update(i, "s3", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5">
                            <input className={inputCls} placeholder="1:32.721" value={r.ideal} onChange={(e) => update(i, "ideal", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5 w-14">
                            <input className={inputCls} placeholder="6" value={r.laps} onChange={(e) => update(i, "laps", e.target.value)} />
                          </td>
                          <td className="px-1 py-1.5">
                            <button onClick={() => removeRow(i)} className="text-slate-500 hover:text-red-400 px-2" title="Remover">
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button onClick={addRow} className={actionBtn}>
                    + Carro
                  </button>
                  <button onClick={() => { setRows(DEMO_ROWS); setCurrentId(undefined); }} className={actionBtn}>
                    Exemplo
                  </button>
                  <button onClick={clearAll} className={actionBtn}>
                    Limpar
                  </button>
                  <label className="ml-auto text-xs text-slate-400 cursor-pointer hover:text-slate-200">
                    📷 Foto de referência
                    <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                  </label>
                </div>
                {imgUrl && <img src={imgUrl} alt="cronometragem" className="mt-3 rounded-xl border border-slate-700 max-h-72 object-contain mx-auto" />}

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Voltas como <code className="text-slate-300">1:33.085</code>, setores como{" "}
                  <code className="text-slate-300">26.000</code>. Deixe em branco o que não conseguir ler.
                </p>
              </div>
            )}

            <Box2Analysis ref={reportRef} analysis={analysis} insights={insights} meta={meta} />
          </>
        ) : (
          <Box2History sessions={sessions} onChange={refreshSessions} onLoad={handleLoad} />
        )}

        <div className="mt-10 pt-6 border-t border-slate-800/70 text-center text-xs text-slate-600">
          BOX 2 · classe Sport ·{" "}
          <Link to="/avaliacao" className="text-slate-500 hover:text-slate-300 underline underline-offset-2">
            App de avaliação da advocacia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Box2;
