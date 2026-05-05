import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onEdit}
        aria-label="Editar"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden />
      </Button>
      {confirm ? (
        <Button
          variant="destructive"
          size="sm"
          className="h-8"
          onClick={() => {
            setConfirm(false);
            onDelete();
          }}
        >
          Confirmar?
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setConfirm(true)}
          onBlur={() => setConfirm(false)}
          aria-label="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </Button>
      )}
    </div>
  );
}
