import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/hooks/useStore";
import { novoId, removerResposta, upsertResposta } from "@/lib/mockStore";
import type { RespostaRapida } from "@/lib/types";
import { CrudHeader } from "@/components/flowdesk/CrudHeader";
import { RowActions } from "@/components/flowdesk/RowActions";

const GLOBAL = "__global__";

export const Route = createFileRoute("/_authenticated/admin/respostas")({
  component: AdminRespostas,
});

const empty = (): RespostaRapida => ({
  id: novoId("r"),
  setor_id: null,
  atalho: "/",
  corpo: "",
});

function AdminRespostas() {
  const respostas = useStore((s) => s.respostas);
  const setores = useStore((s) =>
    [...s.setores].sort((a, b) => a.ordem - b.ordem),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RespostaRapida | null>(null);

  function start(r?: RespostaRapida) {
    setEditing(r ? { ...r } : empty());
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    let atalho = editing.atalho.trim();
    if (!atalho.startsWith("/")) atalho = `/${atalho}`;
    if (atalho.length < 2 || !editing.corpo.trim()) {
      toast.error("Informe o atalho (ex: /oi) e o corpo.");
      return;
    }
    upsertResposta({
      ...editing,
      atalho,
      corpo: editing.corpo.trim(),
    });
    toast.success("Resposta salva.");
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <CrudHeader
        titulo="Respostas rápidas"
        descricao="Modelos acionados com / no campo de mensagem."
        onNovo={() => start()}
        novoLabel="Nova resposta"
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32 px-4">Atalho</TableHead>
              <TableHead>Corpo</TableHead>
              <TableHead className="w-40">Setor</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {respostas.map((r) => {
              const setor = r.setor_id
                ? setores.find((s) => s.id === r.setor_id)
                : null;
              return (
                <TableRow key={r.id} className="border-border/40">
                  <TableCell className="px-4 py-2.5 font-mono text-xs font-semibold text-primary">
                    {r.atalho}
                  </TableCell>
                  <TableCell className="py-2.5 text-xs text-muted-foreground">
                    <span className="line-clamp-2">{r.corpo}</span>
                  </TableCell>
                  <TableCell className="py-2.5 text-xs">
                    {setor ? (
                      <span style={{ color: setor.cor_hex }}>{setor.nome}</span>
                    ) : (
                      <span className="text-muted-foreground">Global</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <RowActions
                      onEdit={() => start(r)}
                      onDelete={() => {
                        removerResposta(r.id);
                        toast.success("Resposta removida.");
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {respostas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhuma resposta cadastrada.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing && respostas.some((r) => r.id === editing.id)
                ? "Editar resposta"
                : "Nova resposta"}
            </DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rr-atalho">Atalho</Label>
                  <Input
                    id="rr-atalho"
                    value={editing.atalho}
                    onChange={(e) =>
                      setEditing({ ...editing, atalho: e.target.value })
                    }
                    placeholder="/oi"
                    className="font-mono"
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rr-setor">Setor</Label>
                  <Select
                    value={editing.setor_id ?? GLOBAL}
                    onValueChange={(v) =>
                      setEditing({
                        ...editing,
                        setor_id: v === GLOBAL ? null : v,
                      })
                    }
                  >
                    <SelectTrigger id="rr-setor">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GLOBAL}>Global</SelectItem>
                      {setores.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-corpo">Corpo</Label>
                <Textarea
                  id="rr-corpo"
                  value={editing.corpo}
                  onChange={(e) =>
                    setEditing({ ...editing, corpo: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
