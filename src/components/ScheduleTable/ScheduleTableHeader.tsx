import { days } from "@/lib/constants";
import { TableHead, TableHeader, TableRow } from "../ui/table";

export function ScheduleTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-black dark:border-white">
        {/* Additional empty cell */}
        <TableHead className="bg-secondary"></TableHead>

        {days.map((day) => (
          <TableHead
            key={day}
            className="bg-secondary border-l border-black text-center text-black dark:border-white dark:text-white"
          >
            {day.toUpperCase()}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
