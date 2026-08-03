"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  baseProfileInformationSchemaExtendedWithCode,
  baseProfileInformationSchemaExtendedWithPassword,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { startTransition, useEffect, useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TriangleAlert } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useProfileInformationActions } from "@/hooks/use-profile-information-actions";
import { toast } from "sonner";

interface ProfileInformationFormProps {
  defaultFullName: string;
  defaultEmail: string;
  doesUserHavePassword: boolean;
  pendingNewEmailObject?: { email: string; remainingHours: number };
}

export function ProfileInformationForm({
  defaultFullName,
  defaultEmail,
  doesUserHavePassword,
  pendingNewEmailObject: pendingNewEmail,
}: ProfileInformationFormProps) {
  const schema = doesUserHavePassword
    ? baseProfileInformationSchemaExtendedWithPassword
    : baseProfileInformationSchemaExtendedWithCode;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: defaultFullName,
      email: defaultEmail,
      password: "",
      code: "",
    },
  });
  const {
    checkIfUserCanChangeEmailState,
    checkIfUserCanChangeEmailAction,
    isCheckIfUserCanChangeEmailPending,
    updateProfileInformationAction,
    isUpdateProfileInformationPending,
    sendNewEmailVerificationLinkAction,
    isSendNewEmailVerificationLinkPending,
    sendNewProfileInformationCodeAction,
    isSendNewProfileInformationCodePending,
  } = useProfileInformationActions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formId = useId();

  async function onSubmit(values: z.infer<typeof schema>) {
    startTransition(() => {
      updateProfileInformationAction(values);
      form.resetField("email");
      form.resetField("code");
      form.resetField("password");
      setIsDialogOpen(false);
    });
  }

  useEffect(() => {
    // This code will only execute when user tries to change email
    if (checkIfUserCanChangeEmailState?.success) {
      if (!doesUserHavePassword) {
        startTransition(() => {
          sendNewProfileInformationCodeAction();
        });
      }

      queueMicrotask(() => {
        setIsDialogOpen(true);
      });

      return;
    }

    if (checkIfUserCanChangeEmailState?.error) {
      toast.error(checkIfUserCanChangeEmailState.error);
    }
  }, [
    checkIfUserCanChangeEmailState,
    doesUserHavePassword,
    sendNewProfileInformationCodeAction,
  ]);

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
          <EmailChangeRequestedSection
            disabled={isSendNewEmailVerificationLinkPending}
            pendingNewEmail={pendingNewEmail}
            onClick={() =>
              startTransition(() => {
                sendNewEmailVerificationLinkAction(pendingNewEmail.email);
              })
            }
          />
        )}

        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setIsDialogOpen(false);
              return;
            }

            startTransition(() => {
              if (form.formState.dirtyFields.email) {
                checkIfUserCanChangeEmailAction(form.getValues("email"));
                return;
              }

              // This activates in case the user didn't change email.
              if (
                form.formState.dirtyFields.fullName &&
                !doesUserHavePassword
              ) {
                sendNewProfileInformationCodeAction();
              }

              setIsDialogOpen(true);
            });
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={
                !form.formState.isDirty ||
                isCheckIfUserCanChangeEmailPending ||
                isUpdateProfileInformationPending ||
                isSendNewProfileInformationCodePending
              }
              onClick={() => {}}
            >
              {isUpdateProfileInformationPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogTrigger>

          {doesUserHavePassword ? (
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
          ) : (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter the code to udpate your profile</DialogTitle>
                <DialogDescription>
                  For security reasons, please enter a code sent to your inbox
                  to save your new details.
                  <strong className="mt-2 block">
                    NOTE: we recommend setting a password for your account
                    instead of using a one-time password for better security.
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="!w-full *:h-10 *:grow">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || isUpdateProfileInformationPending
                }
                form={formId}
                className="mt-3"
              >
                Save changes
              </Button>
            </DialogContent>
          )}
        </Dialog>
      </form>
    </Form>
  );
}

interface EmailChangeRequestedSectionProps {
  disabled: boolean;
  pendingNewEmail: { email: string; remainingHours: number };
  onClick: () => void;
}

function EmailChangeRequestedSection({
  disabled,
  pendingNewEmail,
  onClick,
}: EmailChangeRequestedSectionProps) {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-lg bg-orange-100 p-4 text-sm text-orange-700 dark:bg-orange-400/20 dark:text-orange-200">
      <TriangleAlert className="mt-0.5 flex-shrink-0" size={20} />

      <div>
        <p className="font-medium">Email change requested</p>
        <p className="mt-1">
          To complete changing your email to{" "}
          <strong className="break-all">{pendingNewEmail.email}</strong>:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Check your new email&apos;s inbox for a verification link</li>
          <li>
            Verify within <strong>24 hours</strong> before the link expires{" "}
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
              onClick={onClick}
              disabled={disabled}
            >
              Resend verification email
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
