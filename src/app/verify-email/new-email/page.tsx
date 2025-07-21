import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// TODO: fix this page later to handle sending a new verification request
export default async function VerifyEmailNewEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerificationContent token={token} />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
    </div>
  );
}

async function VerificationContent({ token }: { token: string | undefined }) {
  if (token == null) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="flex min-h-full items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Invalid Verification Link
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <p>
                Please check your email for the correct verification link or{" "}
                <Button
                  variant="link"
                  className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
                >
                  request a new one
                </Button>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  try {
    const existingEmailChangeRequest =
      await prisma.emailChangeRequest.findUnique({
        where: {
          token,
        },
      });

    if (existingEmailChangeRequest == null) {
      return (
        <div className="flex min-h-full items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Invalid Verification Link
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <p>
                This verification link is invalid or already used. Please
                request a new verification email by{" "}
                <Button
                  variant="link"
                  className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
                  asChild
                >
                  <Link href="/settings">
                    changing the email in the settings
                  </Link>
                </Button>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (existingEmailChangeRequest.expiresAt.getTime() > Date.now()) {
      return (
        <div className="flex min-h-full items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Verification Expired
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <p>
                This verification link expired. Links are valid for 24 hours.{" "}
                <Button
                  variant="link"
                  className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
                >
                  Get a new link
                </Button>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Valid token case
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: existingEmailChangeRequest.userId,
        },
        data: {
          email: existingEmailChangeRequest.newEmail,
        },
      }),
      prisma.emailChangeRequest.delete({
        where: {
          id: existingEmailChangeRequest.id,
        },
      }),
    ]);

    return (
      <div className="flex min-h-full items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              Email Updated Successfully
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p>
              Your email address has been updated.{" "}
              <Button
                variant="link"
                className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
                asChild
              >
                <Link href="/">Return to the app</Link>
              </Button>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verification Failed</CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p>
              An unexpected error occurred. Please try again later.{" "}
              <Button
                variant="link"
                className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
                asChild
              >
                <Link href="/">Return to the app</Link>
              </Button>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
