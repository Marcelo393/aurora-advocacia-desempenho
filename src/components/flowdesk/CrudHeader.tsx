import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrudHeader({
  titulo,
  descricao,
  onNovo,
  novoLabel,
}: {
  titulo: string;
  descricao: string;
  onNovo: () => void;
  novoLabel: string;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{titulo}</h1>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>
      <Button onClick={onNovo} size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" aria-hidden />
        {novoLabel}
      </Button>
    </header>
  );
}
