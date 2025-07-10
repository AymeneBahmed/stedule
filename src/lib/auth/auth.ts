import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "../prisma";
import { sendEmailVerificationMail } from "../mail";
import { cookies } from "next/headers";

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
  },
});
