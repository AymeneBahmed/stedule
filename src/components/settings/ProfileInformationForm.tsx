"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { profileInformationSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { startTransition, useActionState, useEffect, useId } from "react";
import { updateProfileInformation } from "@/actions/settings-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ProfileInformationFormProps {
  defaultFullName: string;
  defaultEmail: string;
}

export function ProfileInformationForm({
  defaultFullName,
  defaultEmail,
}: ProfileInformationFormProps) {
  const form = useForm<z.infer<typeof profileInformationSchema>>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      fullName: defaultFullName,
      email: defaultEmail,
      password: "",
    },
  });
  const [state, updateProfileInformationAction, isPending] = useActionState(
    updateProfileInformation,
    null,
  );
  const formId = useId();

  async function onSubmit(values: z.infer<typeof profileInformationSchema>) {
    startTransition(() => {
      updateProfileInformationAction(values);
      form.reset();
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        id={formId}
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Enter your password to udpate your profile
              </DialogTitle>
              <DialogDescription>
                For security reasons, please enter your password to save your
                new details.
              </DialogDescription>
            </DialogHeader>

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

            <Button type="submit" disabled={isPending} form={formId}>
              Save changes
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
