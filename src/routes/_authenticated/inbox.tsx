import { useState } from "react";
import {
  createFileRoute,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { SectorSidebar } from "@/components/flowdesk/SectorSidebar";
import { ConversationList } from "@/components/flowdesk/ConversationList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type InboxSearch = {
  setor?: string;
};

export const Route = createFileRoute("/_authenticated/inbox")({
  validateSearch: (s: Record<string, unknown>): InboxSearch => ({
    setor: typeof s.setor === "string" ? s.setor : undefined,
  }),
  component: InboxLayout,
});

function InboxLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useParams({ strict: false }) as { conversaId?: string };
  const hasConversa = Boolean(params.conversaId);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-row">
      <SectorSidebar />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-72 p-0 md:hidden">
          <div className="flex h-full">
            <SectorSidebar />
            <div className="flex-1" />
          </div>
        </SheetContent>
        {isMobile && !hasConversa ? (
          <div className="flex h-10 items-center gap-2 border-b border-border/50 bg-card px-3 md:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" aria-hidden />
                <span className="sr-only">Abrir setores</span>
              </Button>
            </SheetTrigger>
            <span className="text-sm font-medium">Inbox</span>
          </div>
        ) : null}
      </Sheet>
      <div className="flex h-full min-w-0 flex-1 flex-row">
        {!hasConversa || !isMobile ? <ConversationList /> : null}
        <Outlet />
      </div>
    </div>
  );
}
