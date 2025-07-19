"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { deleteUserSchema } from "@/lib/schemas";
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
import { deleteUser } from "@/actions/settings-actions";
import { toast } from "sonner";

export function DeleteUserForm() {
  const form = useForm<z.infer<typeof deleteUserSchema>>({
    resolver: zodResolver(deleteUserSchema),
  });
  const [state, deleteUserAction, isPending] = useActionState(deleteUser, null);

  async function onSubmit(values: z.infer<typeof deleteUserSchema>) {
    startTransition(() => {
      deleteUserAction(values);
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
          name="delete"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm deletion</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter DELETE to continue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? "Deleting..." : "Delete accounts"}
        </Button>
      </form>
    </Form>
  );
}
