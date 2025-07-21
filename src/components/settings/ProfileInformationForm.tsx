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
import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  sendNewEmailVerificationLink,
  sendNewProfileInformationCode,
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

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
  const schema = useMemo(() => {
    return doesUserHavePassword
      ? baseProfileInformationSchemaExtendedWithPassword
      : baseProfileInformationSchemaExtendedWithCode;
  }, [doesUserHavePassword]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: defaultFullName,
      email: defaultEmail,
      password: "",
      code: "",
    },
  });
  const [
    updateProfileInformationState,
    updateProfileInformationAction,
    isUpdateProfileInformationPending,
  ] = useActionState(updateProfileInformation, null);
  const [
    sendNewEmailVerificationLinkState,
    sendNewEmailVerificationLinkAction,
    isSendNewEmailVerificationLinkPending,
  ] = useActionState(sendNewEmailVerificationLink, null);
  const [
    sendNewProfileInformationCodeState,
    sendNewProfileInformationCodeAction,
    isSendNewProfileInformationCodePending,
  ] = useActionState(sendNewProfileInformationCode, null);
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
    if (sendNewProfileInformationCodeState?.success) {
      toast.success(sendNewProfileInformationCodeState.success);

      return;
    }

    if (sendNewProfileInformationCodeState?.success) {
      toast.error(sendNewProfileInformationCodeState.error);
    }
  }, [sendNewProfileInformationCodeState]);

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

        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            startTransition(() => {
              if (isOpen && !doesUserHavePassword) {
                sendNewProfileInformationCodeAction();
              }

              setIsDialogOpen(isOpen);
            });
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={
                isUpdateProfileInformationPending ||
                isSendNewProfileInformationCodePending
              }
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
                disabled={isUpdateProfileInformationPending}
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
