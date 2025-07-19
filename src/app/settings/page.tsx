import { CreateCredentialAccountForm } from "@/components/settings/CreateCredentialAccountForm";
import { DeleteAccountForm } from "@/components/settings/DeleteAccountForm";
import { ProfileInformationForm } from "@/components/settings/ProfileInformationForm";
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
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await getSession({ redirectOnNull: true });
  const userAccounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const doesUserHaveCredentialAccount = !!userAccounts.find(
    (account) => account.provider === "credential",
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileInformationForm
              defaultFullName={session.user.name}
              defaultEmail={session.user.email}
            />
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

        {/* Delete Account */}
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader className="">
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription className="text-destructive">
              Please proceed with caution, this cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete account</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete your account?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone and will permanently delete
                    your account and all your data.
                  </DialogDescription>
                </DialogHeader>

                <DeleteAccountForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
