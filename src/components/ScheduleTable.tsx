import { days } from "@/lib/constants";
import { Table, TableHead, TableHeader, TableRow } from "./ui/table";

export default function ScheduleTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Additional empty cell */}
          <TableHead></TableHead>

          {days.map((day) => (
            <TableHead key={day} className="text-center text-black">
              {day.toUpperCase()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    </Table>
  );
}
