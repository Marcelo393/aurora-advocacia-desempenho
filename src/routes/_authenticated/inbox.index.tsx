import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/flowdesk/EmptyState";

export const Route = createFileRoute("/_authenticated/inbox/")({
  component: InboxEmpty,
});

function InboxEmpty() {
  return (
    <div className="hidden h-full min-w-0 flex-1 items-center justify-center bg-background md:flex">
      <EmptyState
        icon={MessagesSquare}
        title="Selecione uma conversa"
        description="Escolha um setor à esquerda e uma conversa para começar a atender. Você pode usar atalhos com / para respostas rápidas."
      />
    </div>
  );
}
