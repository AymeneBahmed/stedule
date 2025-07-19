"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { createCredentialAccountSchema } from "@/lib/schemas";
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
import { createCredentialAccount } from "@/actions/settings-actions";
import { toast } from "sonner";

export function CreateCredentialAccountForm() {
  const form = useForm<z.infer<typeof createCredentialAccountSchema>>({
    resolver: zodResolver(createCredentialAccountSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [state, createCredentialAccountAction, isPending] = useActionState(
    createCredentialAccount,
    null,
  );

  async function onSubmit(
    values: z.infer<typeof createCredentialAccountSchema>,
  ) {
    startTransition(() => {
      createCredentialAccountAction(values);
    });
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      form.reset();

      return;
    }

    if (state?.error) {
      toast.error(state.error.toString());
    }
  }, [form, state]);

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
                  placeholder="Enter a password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
