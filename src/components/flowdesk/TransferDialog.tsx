import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/hooks/useStore";
import { transferir } from "@/lib/mockStore";
import { useMe } from "@/hooks/useMe";

export function TransferDialog({
  open,
  onOpenChange,
  conversaId,
  setorOrigemId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversaId: string;
  setorOrigemId: string;
}) {
  const setores = useStore((s) =>
    s.setores.filter((x) => x.ativo).sort((a, b) => a.ordem - b.ordem),
  );
  const agentes = useStore((s) => s.agentes);
  const { meId } = useMe();

  const primeiroOutro =
    setores.find((s) => s.id !== setorOrigemId)?.id ?? setores[0]?.id ?? "";
  const [destinoSetorId, setDestinoSetorId] = useState<string>(primeiroOutro);
  const [destinoAgenteId, setDestinoAgenteId] = useState<string>("none");
  const [observacao, setObservacao] = useState<string>("");

  useEffect(() => {
    if (open) {
      setDestinoSetorId(primeiroOutro);
      setDestinoAgenteId("none");
      setObservacao("");
    }
  }, [open, primeiroOutro]);

  const agentesDoSetor = agentes.filter(
    (a) => a.ativo && a.setor_id === destinoSetorId,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = transferir(
      conversaId,
      destinoSetorId,
      observacao,
      meId,
      destinoAgenteId === "none" ? null : destinoAgenteId,
    );
    if (!result.ok) {
      toast.error(result.erro ?? "Falha ao transferir.");
      return;
    }
    toast.success("Conversa transferida.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir conversa</DialogTitle>
          <DialogDescription>
            Escolha o setor de destino e, opcionalmente, um agente específico.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="td-setor">Setor de destino</Label>
            <Select
              value={destinoSetorId}
              onValueChange={(v) => {
                setDestinoSetorId(v);
                setDestinoAgenteId("none");
              }}
            >
              <SelectTrigger id="td-setor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setores.map((s) => (
                  <SelectItem
                    key={s.id}
                    value={s.id}
                    disabled={s.id === setorOrigemId}
                  >
                    {s.nome}
                    {s.id === setorOrigemId ? " (atual)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="td-ag">Agente (opcional)</Label>
            <Select
              value={destinoAgenteId}
              onValueChange={setDestinoAgenteId}
            >
              <SelectTrigger id="td-ag">
                <SelectValue placeholder="Sem agente atribuído" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem agente atribuído</SelectItem>
                {agentesDoSetor.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.nome}{" "}
                    <span className="ml-1 text-muted-foreground">
                      · {a.status}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {agentesDoSetor.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum agente ativo nesse setor.
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="td-obs">Observação</Label>
            <Textarea
              id="td-obs"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Contexto para quem vai receber..."
              rows={3}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!destinoSetorId || destinoSetorId === setorOrigemId}
            >
              Transferir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
