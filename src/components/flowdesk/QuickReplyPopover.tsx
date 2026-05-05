import { useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { RespostaRapida } from "@/lib/types";

export function QuickReplyPopover({
  setorId,
  query,
  onPick,
  onClose,
}: {
  setorId: string;
  query: string;
  onPick: (r: RespostaRapida) => void;
  onClose: () => void;
}) {
  const respostas = useStore((s) => s.respostas);
  const lista = useMemo(() => {
    const base = respostas.filter(
      (r) => r.setor_id === null || r.setor_id === setorId,
    );
    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter(
      (r) =>
        r.atalho.toLowerCase().includes(q) ||
        r.corpo.toLowerCase().includes(q),
    );
  }, [respostas, setorId, query]);

  const [highlight, setHighlight] = useState(0);
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (lista.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % lista.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + lista.length) % lista.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = lista[highlight];
        if (r) onPick(r);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lista, highlight, onPick, onClose]);

  if (lista.length === 0) return null;

  return (
    <div className="absolute bottom-full left-2 right-2 z-30 mb-2 max-h-64 overflow-y-auto rounded-lg border border-border/60 bg-popover p-1 shadow-lg">
      <p className="flex items-center gap-1 px-2 pb-1 pt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Zap className="h-3 w-3" aria-hidden />
        Respostas rápidas
      </p>
      <ul>
        {lista.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              onMouseEnter={() => setHighlight(i)}
              onClick={() => onPick(r)}
              data-highlight={highlight === i}
              className="block w-full rounded-md px-2 py-1.5 text-left transition-colors data-[highlight=true]:bg-muted"
            >
              <p className="text-xs font-semibold text-primary">{r.atalho}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {r.corpo}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
