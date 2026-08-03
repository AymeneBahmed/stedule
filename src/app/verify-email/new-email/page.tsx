import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestNewVerificationLinkButton } from "@/components/verify-email/new-email/RequestNewVerificationLinkButton";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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

type VerificationResult =
  | { status: "NO_REQUEST" }
  | { status: "PENDING_REQUEST"; newEmail: string }
  | { status: "INVALID_TOKEN" }
  | { status: "EXPIRED_TOKEN"; newEmail: string }
  | { status: "SUCCESS" }
  | { status: "ERROR" };

async function processEmailVerification(
  token: string | undefined,
  userId: string,
): Promise<VerificationResult> {
  if (!token) {
    const existingEmailChangeRequest =
      await prisma.emailChangeRequest.findUnique({
        where: { userId },
      });

    if (!existingEmailChangeRequest) {
      return { status: "NO_REQUEST" };
    }

    return {
      status: "PENDING_REQUEST",
      newEmail: existingEmailChangeRequest.newEmail,
    };
  }

  try {
    const existingEmailChangeRequest =
      await prisma.emailChangeRequest.findUnique({
        where: { token },
      });

    if (!existingEmailChangeRequest) {
      return { status: "INVALID_TOKEN" };
    }

    if (existingEmailChangeRequest.expiresAt <= new Date()) {
      return {
        status: "EXPIRED_TOKEN",
        newEmail: existingEmailChangeRequest.newEmail,
      };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingEmailChangeRequest.userId },
        data: { email: existingEmailChangeRequest.newEmail },
      }),
      prisma.emailChangeRequest.delete({
        where: { id: existingEmailChangeRequest.id },
      }),
    ]);

    return { status: "SUCCESS" };
  } catch {
    return { status: "ERROR" };
  }
}

async function VerificationContent({ token }: { token: string | undefined }) {
  const { user } = await getSession({ redirectOnNull: true });
  const result = await processEmailVerification(token, user.id);

  return (
    <div className="flex min-h-full items-center justify-center">
      <Card className="max-w-md">
        {result.status === "NO_REQUEST" || result.status === "INVALID_TOKEN" ? (
          <>
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
                  className="ml-0 px-0 pt-0 text-[1rem] underline dark:text-white"
                  asChild
                >
                  <Link href="/settings">
                    changing the email in the settings
                  </Link>
                </Button>
                .
              </p>
            </CardContent>
          </>
        ) : null}

        {result.status === "PENDING_REQUEST" ? (
          <>
            <CardHeader>
              <CardTitle className="text-center">
                Invalid Verification Link
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>
                Please check your email for the correct verification link or{" "}
                <RequestNewVerificationLinkButton newEmail={result.newEmail}>
                  request a new one
                </RequestNewVerificationLinkButton>
                .
              </p>
            </CardContent>
          </>
        ) : null}

        {result.status === "EXPIRED_TOKEN" ? (
          <>
            <CardHeader>
              <CardTitle className="text-center">
                Verification Expired
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>
                This verification link expired. Links are valid for 24 hours.{" "}
                <RequestNewVerificationLinkButton newEmail={result.newEmail}>
                  Get a new link
                </RequestNewVerificationLinkButton>
                .
              </p>
            </CardContent>
          </>
        ) : null}

        {result.status === "SUCCESS" ? (
          <>
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
                  className="ml-0 px-0 pt-0 text-[1rem] underline dark:text-white"
                  asChild
                >
                  <Link href="/">Return to the app</Link>
                </Button>
                .
              </p>
            </CardContent>
          </>
        ) : null}

        {result.status === "ERROR" ? (
          <>
            <CardHeader>
              <CardTitle className="text-center">Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>
                An unexpected error occurred. Please try again later.{" "}
                <Button
                  variant="link"
                  className="ml-0 px-0 pt-0 text-[1rem] underline dark:text-white"
                  asChild
                >
                  <Link href="/">Return to the app</Link>
                </Button>
                .
              </p>
            </CardContent>
          </>
        ) : null}
      </Card>
    </div>
  );
}
