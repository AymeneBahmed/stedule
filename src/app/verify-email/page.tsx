import VerifyEmailForm from "@/components/VerifyEmailForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage() {
  const emailCookie = (await cookies()).get("email");

  if (emailCookie == null) {
    redirect("/login");
  }

  return (
    <>
      <VerifyEmailForm email={emailCookie.value} />
    </>
  );
}
