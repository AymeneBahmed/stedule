import { Check } from "lucide-react";

export default function FormSuccess({ message }: { message: string }) {
  return (
    <div className="mt-8 flex items-center gap-3 rounded bg-emerald-100 p-3 pl-5 text-sm text-emerald-700 dark:bg-emerald-400/50 dark:text-emerald-200">
      <Check size={20} />
      <div>{message}</div>
    </div>
  );
}
