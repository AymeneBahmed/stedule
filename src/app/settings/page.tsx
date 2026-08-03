import { CreateCredentialAccountForm } from "@/components/settings/CreateCredentialAccountForm";
import { DeleteUserForm } from "@/components/settings/DeleteUserForm";
import { ProfileInformationForm } from "@/components/settings/ProfileInformationForm";
import { ProfilePictureForm } from "@/components/settings/ProfilePictureForm";
import { UpdatePasswordForm } from "@/components/settings/UpdatePasswordForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth, getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

function getRemainingHours(expiresAt: Date): number {
  const diffMs = expiresAt.getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
}

export default async function SettingsPage() {
  const session = await getSession({ redirectOnNull: true });

  const [userAccounts, existingEmailChangeRequest] = await Promise.all([
    auth.api.listUserAccounts({
      headers: await headers(),
    }),
    prisma.emailChangeRequest.findFirst({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() },
      },
    }),
  ]);

  const doesUserHaveCredentialAccount = !!userAccounts.find(
    (account) => account.provider === "credential",
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Button asChild>
          <Link href="/">
            <ArrowLeftIcon />
            Return to schedule
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileInformationForm
              defaultFullName={session.user.name}
              defaultEmail={session.user.email}
              doesUserHavePassword={doesUserHaveCredentialAccount}
              {...(existingEmailChangeRequest && {
                pendingNewEmailObject: {
                  email: existingEmailChangeRequest.newEmail,
                  remainingHours: getRemainingHours(
                    existingEmailChangeRequest.expiresAt,
                  ),
                },
              })}
            />
          </CardContent>
        </Card>

        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfilePictureForm />
          </CardContent>
        </Card>

        {/* The reason why we are hiding the forms instead of not rendering them is because the success message won't display if the components are not mounted */}
        {/* Update Password */}
        <Card className={cn(!doesUserHaveCredentialAccount && "hidden")}>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>

        {/* Create Credential Account */}
        <Card className={cn(doesUserHaveCredentialAccount && "hidden")}>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Add a password to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCredentialAccountForm />
          </CardContent>
        </Card>

        {/* Delete User */}
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Accounts</CardTitle>
            <CardDescription className="text-destructive">
              Please proceed with caution, this cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete accounts</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete all your accounts?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone and will permanently delete all
                    your accounts and data.
                  </DialogDescription>
                </DialogHeader>

                <DeleteUserForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
