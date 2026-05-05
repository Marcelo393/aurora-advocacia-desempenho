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
import { novoId, removerAgente, upsertAgente } from "@/lib/mockStore";
import type { Agente, AgenteRole, AgenteStatus } from "@/lib/types";
import { CrudHeader } from "@/components/flowdesk/CrudHeader";
import { RowActions } from "@/components/flowdesk/RowActions";
import { FdAvatar } from "@/components/flowdesk/Avatar";

export const Route = createFileRoute("/_authenticated/admin/agentes")({
  component: AdminAgentes,
});

const empty = (defaultSetor: string): Agente => ({
  id: novoId("a"),
  nome: "",
  email: "",
  setor_id: defaultSetor,
  status: "online",
  ativo: true,
  role: "agente",
});

function AdminAgentes() {
  const setores = useStore((s) =>
    [...s.setores].sort((a, b) => a.ordem - b.ordem),
  );
  const agentes = useStore((s) => s.agentes);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Agente | null>(null);

  function start(ag?: Agente) {
    setEditing(ag ? { ...ag } : empty(setores[0]?.id ?? ""));
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.nome.trim() || !editing.email.trim() || !editing.setor_id) {
      toast.error("Preencha nome, email e setor.");
      return;
    }
    upsertAgente({
      ...editing,
      nome: editing.nome.trim(),
      email: editing.email.trim(),
    });
    toast.success("Agente salvo.");
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <CrudHeader
        titulo="Agentes"
        descricao="Equipe que atende as conversas, com setor e status."
        onNovo={() => start()}
        novoLabel="Novo agente"
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Agente</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-24">Função</TableHead>
              <TableHead className="w-24">Ativo</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentes.map((a) => {
              const setor = setores.find((s) => s.id === a.setor_id);
              return (
                <TableRow key={a.id} className="border-border/40">
                  <TableCell className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FdAvatar name={a.nome} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.nome}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    {setor ? (
                      <span style={{ color: setor.cor_hex }}>{setor.nome}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-xs capitalize">
                    {a.status}
                  </TableCell>
                  <TableCell className="py-2.5 text-xs capitalize">
                    {a.role}
                  </TableCell>
                  <TableCell className="py-2.5 text-xs">
                    {a.ativo ? (
                      <span className="text-success">Ativo</span>
                    ) : (
                      <span className="text-muted-foreground">Inativo</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <RowActions
                      onEdit={() => start(a)}
                      onDelete={() => {
                        removerAgente(a.id);
                        toast.success("Agente removido.");
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {agentes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhum agente cadastrado.
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
              {editing && agentes.some((a) => a.id === editing.id)
                ? "Editar agente"
                : "Novo agente"}
            </DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={save} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ag-nome">Nome</Label>
                <Input
                  id="ag-nome"
                  value={editing.nome}
                  onChange={(e) =>
                    setEditing({ ...editing, nome: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ag-email">Email</Label>
                <Input
                  id="ag-email"
                  type="email"
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ag-setor">Setor</Label>
                  <Select
                    value={editing.setor_id}
                    onValueChange={(v) =>
                      setEditing({ ...editing, setor_id: v })
                    }
                  >
                    <SelectTrigger id="ag-setor">
                      <SelectValue />
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
                  <Label htmlFor="ag-role">Função</Label>
                  <Select
                    value={editing.role}
                    onValueChange={(v: AgenteRole) =>
                      setEditing({ ...editing, role: v })
                    }
                  >
                    <SelectTrigger id="ag-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agente">Agente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ag-status">Status</Label>
                <Select
                  value={editing.status}
                  onValueChange={(v: AgenteStatus) =>
                    setEditing({ ...editing, status: v })
                  }
                >
                  <SelectTrigger id="ag-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="ausente">Ausente</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2">
                <Label htmlFor="ag-ativo" className="text-sm">
                  Ativo
                </Label>
                <Switch
                  id="ag-ativo"
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
