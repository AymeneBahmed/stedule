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
import {
  sendNewEmailVerificationLink,
  updateProfileInformation,
} from "@/actions/settings-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TriangleAlert } from "lucide-react";

interface ProfileInformationFormProps {
  defaultFullName: string;
  defaultEmail: string;
  pendingNewEmailObject?: { email: string; remainingHours: number };
}

export function ProfileInformationForm({
  defaultFullName,
  defaultEmail,
  pendingNewEmailObject: pendingNewEmail,
}: ProfileInformationFormProps) {
  const form = useForm<z.infer<typeof profileInformationSchema>>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      fullName: defaultFullName,
      email: defaultEmail,
      password: "",
    },
  });
  const [
    updateProfileInformationState,
    updateProfileInformationAction,
    isUpdateProfileInformationPending,
  ] = useActionState(updateProfileInformation, null);
  const formId = useId();
  const [
    sendNewEmailVerificationLinkState,
    sendNewEmailVerificationLinkAction,
    isSendNewEmailVerificationLinkPending,
  ] = useActionState(sendNewEmailVerificationLink, null);

  async function onSubmit(values: z.infer<typeof profileInformationSchema>) {
    startTransition(() => {
      updateProfileInformationAction(values);
      form.reset();
    });
  }

  useEffect(() => {
    if (updateProfileInformationState?.success) {
      toast.success(updateProfileInformationState.success);

      return;
    }

    if (updateProfileInformationState?.error) {
      toast.error(updateProfileInformationState.error.toString());
    }
  }, [updateProfileInformationState]);

  useEffect(() => {
    if (sendNewEmailVerificationLinkState?.success) {
      toast.success(sendNewEmailVerificationLinkState.success);

      return;
    }

    if (sendNewEmailVerificationLinkState?.error) {
      toast.error(sendNewEmailVerificationLinkState.error.toString());
    }
  }, [sendNewEmailVerificationLinkState]);

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

        {pendingNewEmail && (
          <div className="mt-8 flex items-start gap-3 rounded-lg bg-orange-100 p-4 text-sm text-orange-700 dark:bg-orange-400/20 dark:text-orange-200">
            <TriangleAlert className="mt-0.5 flex-shrink-0" size={20} />

            <div>
              <p className="font-medium">Email change requested</p>
              <p className="mt-1">
                To complete changing your email to{" "}
                <strong className="break-all">{pendingNewEmail.email}</strong>:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Check your new email&apos;s inbox for a verification link
                </li>
                <li>
                  Verify within <strong>24 hours</strong> before the link
                  expires{" "}
                  <strong>
                    ({pendingNewEmail.remainingHours} hour
                    {pendingNewEmail.remainingHours > 1 && "s"} left)
                  </strong>
                </li>
                <li>
                  Didn&apos;t receive it?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-orange-700 underline dark:text-orange-200"
                    onClick={() => {
                      startTransition(() => {
                        sendNewEmailVerificationLinkAction(
                          pendingNewEmail.email,
                        );
                      });
                    }}
                    disabled={isSendNewEmailVerificationLinkPending}
                  >
                    Resend verification email
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" disabled={isUpdateProfileInformationPending}>
              {isUpdateProfileInformationPending ? "Saving..." : "Save changes"}
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

            <Button
              type="submit"
              disabled={isUpdateProfileInformationPending}
              form={formId}
              className="mt-3"
            >
              Save changes
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
