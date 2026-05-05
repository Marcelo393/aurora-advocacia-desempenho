import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("ana@flowdesk.adv");
  const [senha, setSenha] = useState("demo123");
  const [loading, setLoading] = useState(false);

  if (user) {
    void navigate({ to: "/inbox" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha) {
      toast.error("Informe email e senha.");
      return;
    }
    setLoading(true);
    login(email.trim(), senha);
    setLoading(false);
    void navigate({ to: "/inbox" });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/inbox"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            FlowDesk
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Entrar na sua conta
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo — qualquer email e senha funcionam.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@escritorio.adv"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Autenticação fake. Nenhum dado é enviado para um servidor.
          </p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(280_65%_60%/0.15),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-left">
          <div className="max-w-md rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              FlowDesk para advocacia
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              Inbox compartilhada por setor, transferência fluida entre equipes
              e respostas rápidas — tudo em um só lugar.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Recepção, Trabalhista, Previdenciário e Financeiro trabalhando
              em conjunto, com histórico unificado por contato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
