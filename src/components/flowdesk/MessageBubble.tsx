import { cn } from "@/lib/utils";
import { timeShort } from "@/lib/time";
import { FdAvatar } from "./Avatar";
import type { Mensagem } from "@/lib/types";

export function MessageBubble({
  mensagem,
  remetenteNome,
}: {
  mensagem: Mensagem;
  remetenteNome: string;
}) {
  const m = mensagem;
  const isAgent = m.tipo_remetente === "agente" && !m.e_nota_interna;
  const isContato = m.tipo_remetente === "contato";

  if (m.e_nota_interna) {
    return (
      <div className="my-1 flex items-start gap-2">
        <div className="mt-1 h-2 w-2 rounded-full bg-warning" aria-hidden />
        <div
          className="max-w-[80%] rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm"
          style={{ color: "hsl(38 92% 30%)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
            Nota interna · {remetenteNome}
          </p>
          <p className="mt-0.5 whitespace-pre-wrap leading-relaxed">{m.corpo}</p>
          <p className="mt-1 text-right text-[10px] opacity-60">
            {timeShort(m.criado_em)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isAgent ? "justify-end" : "justify-start",
      )}
    >
      {isContato ? <FdAvatar name={remetenteNome} size="xs" /> : null}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
          isAgent
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{m.corpo}</p>
        <p
          className={cn(
            "mt-1 text-right text-[10px]",
            isAgent ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {timeShort(m.criado_em)}
        </p>
      </div>
    </div>
  );
}
