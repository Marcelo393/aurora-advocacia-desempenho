import { Sparkles, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { useMe } from "@/hooks/useMe";
import { useAuth } from "@/hooks/useAuth";

export function DemoBar() {
  const agentes = useStore((s) => s.agentes);
  const { meId, setMeId } = useMe();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-card px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        <span className="font-medium">FlowDesk</span>
        <span className="hidden text-muted-foreground/70 sm:inline">
          · Demo — dados em memória
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/inbox"
          className="rounded px-2 py-1 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          Inbox
        </Link>
        <Link
          to="/admin"
          className="rounded px-2 py-1 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          Admin
        </Link>
        <span className="hidden text-muted-foreground/60 sm:inline">·</span>
        <span className="hidden sm:inline">Logado como</span>
        <Select value={meId} onValueChange={setMeId}>
          <SelectTrigger className="h-7 w-44 text-xs" aria-label="Agente atual">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {agentes.map((a) => (
              <SelectItem key={a.id} value={a.id} className="text-xs">
                {a.nome}
                <span className="ml-2 text-muted-foreground/70">{a.role}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-7 gap-1 px-2 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
