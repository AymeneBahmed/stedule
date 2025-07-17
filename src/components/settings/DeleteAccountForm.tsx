"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { deleteAccountSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { startTransition, useActionState, useEffect } from "react";
import { deleteAccount } from "@/actions/settings-actions";
import { toast } from "sonner";

export function DeleteAccountForm() {
  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });
  const [state, deleteAccountAction, isPending] = useActionState(
    deleteAccount,
    null,
  );

  async function onSubmit(values: z.infer<typeof deleteAccountSchema>) {
    startTransition(() => {
      deleteAccountAction(values);
    });
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);

      return;
    }

    if (state?.error) {
      toast.error(state.error.toString());
    }
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? "Deleting..." : "Delete account"}
        </Button>
      </form>
    </Form>
  );
}
