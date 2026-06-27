import { TableCell, TableRow } from "../ui/table";

export function ScheduleTableTimeSeparator() {
  return (
    <TableRow className="h-[1rem] border-black dark:border-white">
      <TableCell className="bg-secondary text-center font-bold"></TableCell>

      {[...Array(7)].map((_, i) => (
        <TableCell
          key={i}
          className="bg-secondary border-l border-black dark:border-white"
        />
      ))}
    </TableRow>
  );
}
