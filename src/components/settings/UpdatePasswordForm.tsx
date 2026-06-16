"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { updatePasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { startTransition, useActionState, useEffect, useState } from "react";
import { updatePassword } from "@/actions/settings-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { RemovePasswordForm } from "./RemovePasswordForm";

export function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [state, updatePasswordAction, isPending] = useActionState(
    updatePassword,
    null,
  );
  const [isRemovePasswordDialogOpen, setIsRemovePasswordDialogOpen] =
    useState(false);

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    startTransition(() => {
      updatePasswordAction(values);
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your old password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your new password"
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
                    placeholder="Confirm your new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-x-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRemovePasswordDialogOpen(true)}
            >
              Remove password
            </Button>
          </div>
        </form>
      </Form>

      <Dialog
        open={isRemovePasswordDialogOpen}
        onOpenChange={setIsRemovePasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to remove password?</DialogTitle>
            <DialogDescription>
              After removing the password, you will still be able to log in
              using social accounts.
            </DialogDescription>
          </DialogHeader>

          <RemovePasswordForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
