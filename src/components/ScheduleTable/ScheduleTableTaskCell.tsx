import { Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell } from "../ui/table";
import { cn } from "@/lib/utils";

interface ScheduleTableTaskCellProps {
  taskName?: string;
  disabled: boolean;
  onDelete: () => void;
  onClick: () => void;
}

export function ScheduleTableTaskCell({
  taskName,
  disabled,
  onDelete,
  onClick,
}: ScheduleTableTaskCellProps) {
  return (
    <TableCell
      className="hover:bg-muted/70 active:bg-muted/90 cell group relative cursor-pointer border-l border-black py-6 text-center break-words hyphens-auto whitespace-break-spaces dark:border-white"
      onClick={onClick}
    >
      {taskName && (
        <Button
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2 hidden size-8 group-hover:flex"
          onClick={(e) => {
            // Stop propagation to preven NewTaskForm from opening
            e.stopPropagation();
            onDelete();
          }}
          disabled={disabled}
        >
          <Trash2Icon />
        </Button>
      )}

      <div className="line-clamp-3 flex min-h-8 items-center justify-center text-ellipsis">
        {taskName || ""}
      </div>
    </TableCell>
  );
}
