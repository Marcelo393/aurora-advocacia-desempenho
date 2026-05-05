import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquareWarning } from "lucide-react";
import { ConversationPanel } from "@/components/flowdesk/ConversationPanel";
import { ContactDetailsPanel } from "@/components/flowdesk/ContactDetailsPanel";
import { EmptyState } from "@/components/flowdesk/EmptyState";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/_authenticated/inbox/c/$conversaId")({
  component: ConversaRoute,
});

function ConversaRoute() {
  const { conversaId } = Route.useParams();
  const conversa = useStore((s) =>
    s.conversas.find((c) => c.id === conversaId),
  );
  const [detailsOpen, setDetailsOpen] = useState(true);

  if (!conversa) {
    return (
      <div className="flex h-full min-w-0 flex-1 items-center justify-center bg-background">
        <EmptyState
          icon={MessageSquareWarning}
          title="Conversa não encontrada"
          description="Pode ter sido removida ou o link está incorreto."
          action={
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/inbox" search={{ setor: undefined }}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para a inbox
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <ConversationPanel
        conversa={conversa}
        onToggleDetails={() => setDetailsOpen((v) => !v)}
        detailsOpen={detailsOpen}
      />
      {detailsOpen ? <ContactDetailsPanel conversa={conversa} /> : null}
    </>
  );
}
