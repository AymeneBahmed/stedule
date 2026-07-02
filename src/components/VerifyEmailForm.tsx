"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyEmailSchema } from "@/lib/schemas";
import { authClient } from "@/lib/auth/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function VerifyEmailForm({ email }: { email: string }) {
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
    await authClient.emailOtp.verifyEmail(
      {
        email,
        otp: values.code,
      },
      {
        onSuccess() {
          toast.success("Email verified successfully!");

          router.replace("/");
          router.refresh();
        },
        onError() {
          // TODO: handle a bug where a new code isn't sent after the old one expires
          toast.error(
            "Couldn't verify email! Please check your inbox for a new code.",
          );
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Enter your code to verify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code:</FormLabel>
                      <FormControl className="">
                        <InputOTP maxLength={6} {...field} className="!w-full">
                          <InputOTPGroup className="!w-full *:grow">
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
              </div>

              <Button
                type="submit"
                className="mt-10 w-full"
                disabled={form.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
