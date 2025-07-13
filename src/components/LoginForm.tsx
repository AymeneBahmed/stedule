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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginSchema } from "@/lib/schemas";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.remember,
        callbackURL: "/",
      },
      {
        async onError(context) {
          if (context.error.code === "EMAIL_NOT_VERIFIED") {
            await authClient.emailOtp.sendVerificationOtp(
              {
                email: values.email,
                type: "email-verification",
              },
              {
                onSuccess() {
                  toast.success("Check your inbox for verification.", {
                    position: "top-center",
                  });

                  router.push("/verify-email")
                },
                onError(context) {
                  toast.error(context.error.message, {
                    position: "top-center",
                  });
                },
              },
            );

            return;
          }

          toast.error(context.error.message, { position: "top-center" });
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Log in
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-[0.8rem]">
                        Keep me logged in
                      </FormLabel>
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

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="mt-2 p-0 text-white underline"
                  asChild
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
