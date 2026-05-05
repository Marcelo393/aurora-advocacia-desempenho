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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/hooks/useStore";
import { novoId, removerSetor, upsertSetor } from "@/lib/mockStore";
import type { Setor } from "@/lib/types";
import { CrudHeader } from "@/components/flowdesk/CrudHeader";
import { RowActions } from "@/components/flowdesk/RowActions";

export const Route = createFileRoute("/_authenticated/admin/setores")({
  component: AdminSetores,
});

const empty = (): Setor => ({
  id: novoId("s"),
  nome: "",
  cor_hex: "#3b82f6",
  ativo: true,
  ordem: 99,
});

function AdminSetores() {
  const setores = useStore((s) =>
    [...s.setores].sort((a, b) => a.ordem - b.ordem),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Setor | null>(null);

  function start(setor?: Setor) {
    setEditing(setor ? { ...setor } : empty());
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.nome.trim()) {
      toast.error("Informe o nome do setor.");
      return;
    }
    upsertSetor({ ...editing, nome: editing.nome.trim() });
    toast.success("Setor salvo.");
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <CrudHeader
        titulo="Setores"
        descricao="Departamentos do escritório que recebem conversas."
        onNovo={() => start()}
        novoLabel="Novo setor"
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Setor</TableHead>
              <TableHead className="w-24">Cor</TableHead>
              <TableHead className="w-24">Ordem</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {setores.map((s) => (
              <TableRow key={s.id} className="border-border/40">
                <TableCell className="px-4 py-2.5 font-medium">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: s.cor_hex }}
                      aria-hidden
                    />
                    {s.nome}
                  </span>
                </TableCell>
                <TableCell className="py-2.5 font-mono text-xs">
                  {s.cor_hex}
                </TableCell>
                <TableCell className="py-2.5 tabular-nums">{s.ordem}</TableCell>
                <TableCell className="py-2.5 text-xs">
                  {s.ativo ? (
                    <span className="text-success">Ativo</span>
                  ) : (
                    <span className="text-muted-foreground">Inativo</span>
                  )}
                </TableCell>
                <TableCell className="py-2.5 text-right">
                  <RowActions
                    onEdit={() => start(s)}
                    onDelete={() => {
                      removerSetor(s.id);
                      toast.success("Setor removido.");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {setores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhum setor cadastrado.
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing && setores.some((s) => s.id === editing.id)
                ? "Editar setor"
                : "Novo setor"}
            </DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={save} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="set-nome">Nome</Label>
                <Input
                  id="set-nome"
                  value={editing.nome}
                  onChange={(e) =>
                    setEditing({ ...editing, nome: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="set-cor">Cor (hex)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="set-cor"
                      type="color"
                      value={editing.cor_hex}
                      onChange={(e) =>
                        setEditing({ ...editing, cor_hex: e.target.value })
                      }
                      className="h-9 w-12 cursor-pointer rounded-md border border-border/60 bg-background"
                    />
                    <Input
                      value={editing.cor_hex}
                      onChange={(e) =>
                        setEditing({ ...editing, cor_hex: e.target.value })
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-ord">Ordem</Label>
                  <Input
                    id="set-ord"
                    type="number"
                    value={editing.ordem}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ordem: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2">
                <Label htmlFor="set-ativo" className="text-sm">
                  Ativo
                </Label>
                <Switch
                  id="set-ativo"
                  checked={editing.ativo}
                  onCheckedChange={(v) => setEditing({ ...editing, ativo: v })}
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
