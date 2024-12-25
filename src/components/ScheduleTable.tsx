import { days } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function ScheduleTable() {
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);

  return (
    <Table className="border border-black dark:border-white">
      <TableHeader>
        <TableRow className="border-black dark:border-white">
          {/* Additional empty cell */}
          <TableHead className="bg-secondary"></TableHead>

          {days.map((day) => (
            <TableHead
              key={day}
              className="border-l border-black bg-secondary text-center text-black dark:border-white dark:text-white"
            >
              {day.toUpperCase()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {hours.map((hour) => (
          <TableRow
            key={hour}
            className="h-[5rem] border-black hover:bg-transparent dark:border-white"
          >
            <TableCell className="bg-secondary text-center font-bold">
              {hour}:00 {hour < 12 ? "AM" : "PM"}
            </TableCell>

            {[...Array(7)].map((_, i) => (
              <TableCell
                key={i}
                className="cursor-pointer border-l border-black hover:bg-muted/70 active:bg-muted/90 dark:border-white"
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
