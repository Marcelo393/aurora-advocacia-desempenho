import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { Input } from "@/components/ui/input";
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
import { useMe } from "@/hooks/useMe";
import { criarConversa } from "@/lib/mockStore";

export function NewConversationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const setores = useStore((s) =>
    s.setores.filter((x) => x.ativo).sort((a, b) => a.ordem - b.ordem),
  );
  const { meId } = useMe();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [setorId, setSetorId] = useState(setores[0]?.id ?? "");
  const [mensagem, setMensagem] = useState("");

  function reset() {
    setNome("");
    setTelefone("");
    setSetorId(setores[0]?.id ?? "");
    setMensagem("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim() || !setorId || !mensagem.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const id = criarConversa({
      nome_contato: nome,
      telefone_contato: telefone,
      setor_id: setorId,
      primeira_mensagem: mensagem,
      agente_id: meId,
    });
    toast.success("Conversa criada.");
    onOpenChange(false);
    reset();
    navigate({ to: "/inbox/c/$conversaId", params: { conversaId: id } });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
          <DialogDescription>
            Inicie um atendimento manualmente para um contato novo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="nc-nome">Nome do contato</Label>
            <Input
              id="nc-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Maria Silva"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nc-tel">Telefone</Label>
            <Input
              id="nc-tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="+55 11 9..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nc-setor">Setor</Label>
            <Select value={setorId} onValueChange={setSetorId}>
              <SelectTrigger id="nc-setor">
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {setores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nc-msg">Primeira mensagem</Label>
            <Textarea
              id="nc-msg"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Olá! Em que posso ajudar?"
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
            <Button type="submit">Criar conversa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
