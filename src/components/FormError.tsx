import { TriangleAlert } from "lucide-react";

export function FormError({ message }: { message: string }) {
  return (
    <div className="dark:bg-destructive/50 mt-8 flex items-center gap-3 rounded bg-red-100 p-3 pl-5 text-sm text-red-700 dark:text-red-200">
      <TriangleAlert size={20} />
      <div>{message}</div>
    </div>
  );
}
