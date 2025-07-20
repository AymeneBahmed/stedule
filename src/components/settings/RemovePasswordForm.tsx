import { removePasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { removePassword } from "@/actions/settings-actions";
import { toast } from "sonner";

export default function RemovePasswordForm() {
  const form = useForm<z.infer<typeof removePasswordSchema>>({
    resolver: zodResolver(removePasswordSchema),
    defaultValues: {
      currentPassword: "",
    },
  });
  const [state, removePasswordAction, isPending] = useActionState(
    removePassword,
    null,
  );

  function onSubmit(values: z.infer<typeof removePasswordSchema>) {
    startTransition(() => {
      removePasswordAction(values);
    });
  }

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your current password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending}>Remove password</Button>
      </form>
    </Form>
  );
}
