import { PrismaTimeModified } from "@/lib/ts/interfaces";
import { TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { Time as TimeClass } from "@/lib/classes/Time";

interface ScheduleTableTimeCellProps {
  time: Omit<PrismaTimeModified, "userId">;
  onDelete: () => void;
  disabled: boolean;
}

export function ScheduleTableTimeCell({
  onDelete,
  disabled,
  time,
}: ScheduleTableTimeCellProps) {
  return (
    <TableCell className="bg-secondary group relative text-center font-bold">
      <Button
        size="icon"
        variant="destructive"
        className="absolute top-2 right-2 hidden size-8 group-hover:flex"
        onClick={onDelete}
        disabled={disabled}
      >
        <Trash2Icon />
      </Button>

      <div className="contents">
        {TimeClass.toString(time.hour, time.minute)}
      </div>
    </TableCell>
  );
}
