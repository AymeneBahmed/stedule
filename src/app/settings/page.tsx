import { ProfileInformationForm } from "@/components/settings/ProfileInformationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth";

export default async function SettingsPage() {
  const session = await getSession({ redirectOnNull: true });

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
      </div>
    </div>
  );
}
