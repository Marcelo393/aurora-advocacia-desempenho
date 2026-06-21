import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyze, CarInput, SPORT, SILVIO } from "@/lib/box2/analise";
import { gerarHTML } from "@/lib/box2/relatorio";
import { computeInsights } from "@/lib/box2/insights";
import {
  loadSessions,
  saveSession,
  SessionSnapshot,
  StoredRow,
} from "@/lib/box2/storage";
import Box2Report from "@/components/box2/Box2Report";
import Box2Insights from "@/components/box2/Box2Insights";
import Box2History from "@/components/box2/Box2History";

type Row = StoredRow;

const SPORT_NUMS = Object.keys(SPORT)
  .map(Number)
  .sort((a, b) => a - b);

const emptyRow = (num: number): Row => ({ num, lap: "", s1: "", s2: "", s3: "", ideal: "", laps: "" });

// Dados de demonstração (mesma sessão do exemplo) — para ver funcionando na hora.
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
  const [tab, setTab] = useState("analise");
  const [sessao, setSessao] = useState("Pré-temporada Interlagos");
  const [data, setData] = useState("28/02/2026");
  const [aviso, setAviso] = useState("Apenas 6 voltas do #2 — pace ainda imaturo.");
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

  const update = (i: number, field: keyof Row, value: string) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: field === "num" ? Number(value) : value } : r)));
  };

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
    toast.success("Sessão salva na memória. Veja a aba Evolução.");
  };

  const handleLoad = (s: SessionSnapshot) => {
    setSessao(s.meta.sessao);
    setData(s.meta.data);
    setAviso(s.meta.aviso);
    setRows(s.rows.map((r) => ({ ...emptyRow(r.num), ...r })));
    setCurrentId(s.id);
    setTab("analise");
    toast.success("Sessão carregada para edição.");
  };

  const fileBase = () =>
    (sessao || "box2")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "relatorio";

  const downloadHTML = () => {
    const html = gerarHTML(cars, meta);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
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
    return html2canvas(node, { backgroundColor: "#0b0d10", scale: 2, useCORS: true });
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
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
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
    "w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-[#0b0d10] text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-blue-500 font-bold">
            BOX 2 · Análise de pista
          </div>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">
            Silvio Morestoni
            <span className="text-xs text-blue-500 border border-blue-500 rounded-md px-2 py-0.5 ml-3 align-middle">
              #2
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Classe Carrera Sport · análise inteligente da sessão e evolução treino a treino.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="analise" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Análise
            </TabsTrigger>
            <TabsTrigger value="evolucao" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Evolução {sessions.length > 0 && `(${sessions.length})`}
            </TabsTrigger>
          </TabsList>

          {/* ===================== ANÁLISE ===================== */}
          <TabsContent value="analise" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* ---- Coluna de entrada ---- */}
              <div>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
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
                    <input className={inputCls} value={aviso} onChange={(e) => setAviso(e.target.value)} />
                  </label>
                </div>

                {/* Foto de referência opcional */}
                <div className="mb-5">
                  <span className="block text-slate-400 mb-1 text-sm">
                    Foto da cronometragem (referência para digitar)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImage}
                    className="text-sm text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:px-3 file:py-1.5 file:text-sm hover:file:bg-blue-500"
                  />
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt="cronometragem"
                      className="mt-3 rounded-lg border border-slate-700 max-h-64 object-contain"
                    />
                  )}
                </div>

                {/* Tabela de tempos */}
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-400">
                      <tr>
                        <th className="text-left font-medium px-2 py-2">Carro</th>
                        <th className="font-medium px-1 py-2">Melhor volta</th>
                        <th className="font-medium px-1 py-2">S1</th>
                        <th className="font-medium px-1 py-2">S2</th>
                        <th className="font-medium px-1 py-2">S3</th>
                        <th className="font-medium px-1 py-2">Ideal</th>
                        <th className="font-medium px-1 py-2">Voltas</th>
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
                          <td className="px-1 py-1.5 w-16">
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

                <div className="flex flex-wrap gap-3 mt-4">
                  <button onClick={addRow} className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm">
                    + Adicionar carro
                  </button>
                  <button onClick={() => { setRows(DEMO_ROWS); setCurrentId(undefined); }} className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm">
                    Carregar exemplo
                  </button>
                  <button onClick={clearAll} className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm">
                    Limpar
                  </button>
                  <button onClick={handleSave} className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium">
                    {currentId ? "Atualizar sessão" : "Salvar sessão"}
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Formato dos tempos: <code className="text-slate-300">1:33.085</code> para voltas,{" "}
                  <code className="text-slate-300">26.000</code> para setores. Deixe em branco o que não conseguir
                  ler — nunca invente um tempo. A análise compara somente dentro da Sport.
                </p>
              </div>

              {/* ---- Coluna de insights + relatório ---- */}
              <div className="space-y-6">
                <Box2Insights insights={insights} />

                <div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button onClick={downloadPNG} disabled={busy} className="rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-sm font-medium">
                      {busy ? "Gerando…" : "Baixar PNG"}
                    </button>
                    <button onClick={downloadPDF} disabled={busy} className="rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-sm font-medium">
                      Baixar PDF
                    </button>
                    <button onClick={downloadHTML} className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-sm font-medium">
                      Baixar HTML
                    </button>
                  </div>
                  <Box2Report ref={reportRef} analysis={analysis} meta={meta} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===================== EVOLUÇÃO ===================== */}
          <TabsContent value="evolucao" className="mt-6">
            <Box2History sessions={sessions} onChange={refreshSessions} onLoad={handleLoad} />
          </TabsContent>
        </Tabs>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
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
