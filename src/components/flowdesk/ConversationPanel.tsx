import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  RotateCcw,
  Send,
  StickyNote,
  UserPlus,
  Forward,
  Phone,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/hooks/useStore";
import { useNow } from "@/hooks/useNow";
import { useMe } from "@/hooks/useMe";
import {
  atribuirAMim,
  enviarMensagem,
  marcarComoLida,
  mensagensByConversa,
  reabrirConversa,
  resolverConversa,
} from "@/lib/mockStore";
import type { Conversa, Mensagem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { dayHeader } from "@/lib/time";
import { FdAvatar } from "./Avatar";
import { MessageBubble } from "./MessageBubble";
import { QuickReplyPopover } from "./QuickReplyPopover";
import { TransferDialog } from "./TransferDialog";

export function ConversationPanel({
  conversa,
  onToggleDetails,
  detailsOpen,
}: {
  conversa: Conversa;
  onToggleDetails: () => void;
  detailsOpen: boolean;
}) {
  const setores = useStore((s) => s.setores);
  const agentes = useStore((s) => s.agentes);
  const { meId } = useMe();
  const me = agentes.find((a) => a.id === meId);
  const setor = setores.find((s) => s.id === conversa.setor_id);
  const responsavel =
    agentes.find((a) => a.id === conversa.agente_responsavel_id) ?? null;

  const mensagens = useStore(() => mensagensByConversa(conversa.id));
  const now = useNow(60_000);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);
  const initialPaintRef = useRef(true);
  const [draft, setDraft] = useState("");
  const [nota, setNota] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  useEffect(() => {
    setDraft("");
    setNota(false);
    setShowQuick(false);
    initialPaintRef.current = true;
    lastCountRef.current = 0;
    if (conversa.nao_lidas > 0) marcarComoLida(conversa.id);
  }, [conversa.id, conversa.nao_lidas]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prev = lastCountRef.current;
    lastCountRef.current = mensagens.length;
    if (initialPaintRef.current) {
      el.scrollTop = el.scrollHeight;
      initialPaintRef.current = false;
      return;
    }
    if (mensagens.length > prev) {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distanceFromBottom < 96) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }
  }, [mensagens.length]);

  const grouped = useMemo(() => {
    const out: Array<
      { type: "header"; iso: string } | { type: "msg"; m: Mensagem }
    > = [];
    let lastDay: string | null = null;
    for (const m of mensagens) {
      const day = m.criado_em.slice(0, 10);
      if (day !== lastDay) {
        out.push({ type: "header", iso: m.criado_em });
        lastDay = day;
      }
      out.push({ type: "msg", m });
    }
    return out;
  }, [mensagens]);

  const slashQuery = useMemo(() => {
    const m = /(^|\s)\/([\wÀ-ú-]*)$/i.exec(draft);
    if (!m) return null;
    return m[2];
  }, [draft]);

  useEffect(() => {
    setShowQuick(slashQuery !== null);
  }, [slashQuery]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    if (conversa.status === "resolvida") {
      toast.error("Reabra a conversa antes de enviar mensagens.");
      return;
    }
    enviarMensagem(conversa.id, meId, text, nota);
    setDraft("");
    setNota(false);
    setShowQuick(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !showQuick) {
      e.preventDefault();
      send();
    }
  }

  function pickQuick(corpo: string) {
    const m = /(^|\s)\/([\wÀ-ú-]*)$/i.exec(draft);
    if (!m) {
      setDraft(corpo);
    } else {
      const before = draft.slice(0, m.index + (m[1] ? 1 : 0));
      setDraft(`${before}${corpo}`);
    }
    setShowQuick(false);
  }

  function nomeRemetente(m: Mensagem): string {
    if (m.tipo_remetente === "contato") return conversa.nome_contato;
    return agentes.find((a) => a.id === m.remetente_id)?.nome ?? "Atendente";
  }

  return (
    <section
      className="chat-pane flex h-full min-w-0 flex-1 flex-col bg-background"
      aria-label="Conversa"
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-border/50 bg-card px-4 py-2.5">
        <FdAvatar name={conversa.nome_contato} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">
            {conversa.nome_contato}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" aria-hidden />
              {conversa.telefone_contato}
            </span>
            {setor ? (
              <>
                <span aria-hidden>·</span>
                <span
                  className="inline-flex items-center gap-1"
                  style={{ color: setor.cor_hex }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: setor.cor_hex }}
                    aria-hidden
                  />
                  {setor.nome}
                </span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>
              {responsavel ? `Atribuída a ${responsavel.nome}` : "Sem agente"}
            </span>
            {conversa.status === "resolvida" ? (
              <>
                <span aria-hidden>·</span>
                <span className="font-medium text-success">Resolvida</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {conversa.agente_responsavel_id !== meId &&
          conversa.status === "aberta" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                atribuirAMim(conversa.id, meId);
                toast.success("Conversa atribuída a você.");
              }}
              className="gap-1"
            >
              <UserPlus className="h-4 w-4" aria-hidden /> Atribuir a mim
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTransferOpen(true)}
            disabled={conversa.status === "resolvida"}
            className="gap-1"
          >
            <Forward className="h-4 w-4" aria-hidden /> Transferir
          </Button>
          {conversa.status === "aberta" ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                resolverConversa(conversa.id);
                toast.success("Conversa resolvida.");
              }}
              className="gap-1"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden /> Resolver
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reabrirConversa(conversa.id);
                toast.success("Conversa reaberta.");
              }}
              className="gap-1"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Reabrir
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleDetails}
            aria-label={detailsOpen ? "Recolher detalhes" : "Expandir detalhes"}
          >
            {detailsOpen ? (
              <PanelRightClose className="h-4 w-4" aria-hidden />
            ) : (
              <PanelRightOpen className="h-4 w-4" aria-hidden />
            )}
          </Button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 overflow-y-auto bg-[radial-gradient(circle_at_25%_25%,hsl(var(--muted))_0,transparent_45%)] px-4 py-4"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
          {grouped.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Sem mensagens nesta conversa.
            </p>
          ) : (
            grouped.map((g, i) =>
              g.type === "header" ? (
                <div
                  key={`h-${i}`}
                  className="my-2 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  <Separator className="flex-1" />
                  <span className="rounded-full bg-card px-2 py-0.5 ring-1 ring-border/60">
                    {dayHeader(g.iso, now)}
                  </span>
                  <Separator className="flex-1" />
                </div>
              ) : (
                <MessageBubble
                  key={g.m.id}
                  mensagem={g.m}
                  remetenteNome={nomeRemetente(g.m)}
                />
              ),
            )
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative shrink-0 border-t border-border/50 bg-card",
          conversa.status === "resolvida" && "opacity-60",
        )}
      >
        {showQuick && slashQuery !== null ? (
          <QuickReplyPopover
            setorId={conversa.setor_id}
            query={slashQuery}
            onPick={(r) => pickQuick(r.corpo)}
            onClose={() => setShowQuick(false)}
          />
        ) : null}
        <div className="flex items-end gap-2 p-2">
          <Button
            type="button"
            variant={nota ? "default" : "ghost"}
            size="icon"
            onClick={() => setNota((v) => !v)}
            aria-pressed={nota}
            aria-label="Alternar nota interna"
            className={cn(
              "h-9 w-9 shrink-0",
              nota && "bg-warning text-foreground hover:bg-warning/90",
            )}
            disabled={conversa.status === "resolvida"}
          >
            <StickyNote className="h-4 w-4" aria-hidden />
          </Button>
          <div className="flex-1">
            {nota ? (
              <p className="mb-1 text-[11px] font-medium text-warning">
                Modo nota interna · só agentes veem
              </p>
            ) : null}
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              rows={2}
              placeholder={
                conversa.status === "resolvida"
                  ? "Conversa resolvida — reabra para responder"
                  : nota
                    ? `Nota interna como ${me?.nome ?? "agente"}...`
                    : `Escreva uma mensagem... (digite / para respostas rápidas)`
              }
              disabled={conversa.status === "resolvida"}
              className="min-h-10 resize-none border-border/40"
            />
          </div>
          <Button
            type="button"
            onClick={send}
            disabled={!draft.trim() || conversa.status === "resolvida"}
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>

      <TransferDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        conversaId={conversa.id}
        setorOrigemId={conversa.setor_id}
      />
    </section>
  );
}
