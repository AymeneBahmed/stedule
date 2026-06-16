import { TriangleAlert } from "lucide-react";

export function FormWarning({ message }: { message: string }) {
  return (
    <div className="mt-8 flex items-center gap-3 rounded bg-orange-100 p-3 pl-5 text-sm text-orange-700 dark:bg-orange-400/20 dark:text-orange-200">
      <TriangleAlert size={20} />
      <div>{message}</div>
    </div>
  );
}
