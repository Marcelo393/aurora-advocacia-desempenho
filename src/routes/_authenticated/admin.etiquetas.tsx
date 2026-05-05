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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/hooks/useStore";
import { novoId, removerEtiqueta, upsertEtiqueta } from "@/lib/mockStore";
import type { Etiqueta } from "@/lib/types";
import { CrudHeader } from "@/components/flowdesk/CrudHeader";
import { RowActions } from "@/components/flowdesk/RowActions";

export const Route = createFileRoute("/_authenticated/admin/etiquetas")({
  component: AdminEtiquetas,
});

const empty = (): Etiqueta => ({
  id: novoId("e"),
  nome: "",
  cor_hex: "#a855f7",
});

function AdminEtiquetas() {
  const etiquetas = useStore((s) => s.etiquetas);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Etiqueta | null>(null);

  function start(et?: Etiqueta) {
    setEditing(et ? { ...et } : empty());
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.nome.trim()) {
      toast.error("Informe o nome da etiqueta.");
      return;
    }
    upsertEtiqueta({ ...editing, nome: editing.nome.trim() });
    toast.success("Etiqueta salva.");
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8">
      <CrudHeader
        titulo="Etiquetas"
        descricao="Marque conversas com cores para organizar a inbox."
        onNovo={() => start()}
        novoLabel="Nova etiqueta"
      />
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Etiqueta</TableHead>
              <TableHead className="w-32">Cor</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etiquetas.map((t) => (
              <TableRow key={t.id} className="border-border/40">
                <TableCell className="px-4 py-2.5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      background: `${t.cor_hex}1f`,
                      color: t.cor_hex,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: t.cor_hex }}
                      aria-hidden
                    />
                    {t.nome}
                  </span>
                </TableCell>
                <TableCell className="py-2.5 font-mono text-xs">
                  {t.cor_hex}
                </TableCell>
                <TableCell className="py-2.5 text-right">
                  <RowActions
                    onEdit={() => start(t)}
                    onDelete={() => {
                      removerEtiqueta(t.id);
                      toast.success("Etiqueta removida.");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {etiquetas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhuma etiqueta cadastrada.
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
              {editing && etiquetas.some((t) => t.id === editing.id)
                ? "Editar etiqueta"
                : "Nova etiqueta"}
            </DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={save} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="et-nome">Nome</Label>
                <Input
                  id="et-nome"
                  value={editing.nome}
                  onChange={(e) =>
                    setEditing({ ...editing, nome: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="et-cor">Cor</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="et-cor"
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
