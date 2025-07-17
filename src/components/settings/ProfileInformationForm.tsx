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
import { startTransition, useActionState, useEffect } from "react";
import { updateProfileInformation } from "@/actions/settings-actions";
import { toast } from "sonner";

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
    },
  });
  const [state, updateProfileInformationAction, isPending] = useActionState(
    updateProfileInformation,
    null,
  );

  async function onSubmit(values: z.infer<typeof profileInformationSchema>) {
    startTransition(() => {
      updateProfileInformationAction(values);
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
