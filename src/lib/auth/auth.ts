import { betterAuth, Session, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "../prisma";
import { sendEmailVerificationMail } from "../mail";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendEmailVerificationMail(email, otp);

          (await cookies()).set("email", email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 300,
            sameSite: "lax",
          });
        }
      },
      sendVerificationOnSignUp: true,
      disableSignUp: true,
    }),
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
});

// 1. Define function overloads
export async function getSession(options?: {
  redirectOnNull?: false;
}): Promise<{ session: Session; user: User } | null>;
export async function getSession(options: {
  redirectOnNull: true;
}): Promise<{ session: Session; user: User }>;
export async function getSession({
  redirectOnNull = false,
}: { redirectOnNull?: boolean } = {}): Promise<{
  session: Session;
  user: User;
} | null> {
  // 2. Original implementation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null) {
    if (redirectOnNull) {
      redirect("/login"); // Never returns when redirecting
    } else {
      return null;
    }
  }

  return session;
}
