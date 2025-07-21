"use server";

import { auth, getSession } from "@/lib/auth/auth";
import { sendNewEmailVerificationMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  createCredentialAccountSchema,
  deleteUserSchema,
  profileInformationSchema,
  removePasswordSchema,
  updatePasswordSchema,
} from "@/lib/schemas";
import { EmailChangeRequest } from "@prisma/client";
import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function updateProfileInformation(
  _prevState: unknown,
  values: z.infer<typeof profileInformationSchema>,
): Promise<
  | {
      success?: never;
      error: string;
    }
  | {
      success: string;
      error?: never;
    }
> {
  const session = await getSession({ redirectOnNull: true });
  const validated = profileInformationSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  const { fullName, email: newEmail, password } = validated.data;

  try {
    const authContext = await auth.$context;
    const accounts = await authContext.internalAdapter.findAccounts(
      session.user.id,
    );
    const credentialAccount = accounts.find(
      (account) => account.providerId === "credential",
    );

    // TODO: Fix later for those who don't have a credential account
    if (!credentialAccount) {
      return {
        error: "You need to have a credential account to change your email.",
      };
    }

    if (
      session.user.email !== newEmail &&
      (await authContext.password.verify({
        password,
        hash: credentialAccount.password!,
      }))
    ) {
      const emailChangeRequest = await prisma.emailChangeRequest.create({
        data: {
          newEmail,
          expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      await sendNewEmailVerificationMail(newEmail, emailChangeRequest.token);
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: fullName,
      },
    });
  } catch (e) {
    if ((e as APIError).body?.code === "COULDNT_UPDATE_YOUR_EMAIL") {
      return {
        error: "Couldn't update your email. Please try a different email.",
      };
    }

    return {
      error: "Something went wrong! Please try again",
    };
  }

  revalidatePath("/settings");

  if (session.user.email !== newEmail) {
    return {
      success:
        "Updated full name successfully! Check your new email's inbox to verify the new email.",
    };
  }

  return {
    success: "Updated full name successfully!",
  };
}

export async function updatePassword(
  _prevState: unknown,
  values: Omit<z.infer<typeof updatePasswordSchema>, "oldPassword">,
): Promise<
  | {
      success?: never;
      error: string;
    }
  | {
      success: string;
      error?: never;
    }
> {
  const session = await getSession({ redirectOnNull: true });
  const validated = updatePasswordSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  const { oldPassword, newPassword } = validated.data;

  try {
    const authContext = await auth.$context;
    const accounts = await authContext.internalAdapter.findAccounts(
      session.user.id,
    );
    const credentialAccount = accounts.find(
      (account) => account.providerId === "credential",
    );

    if (!credentialAccount) {
      return {
        error: "The user doesn't have a credential account.",
      };
    } else {
      await auth.api.changePassword({
        headers: await headers(),
        body: { currentPassword: oldPassword, newPassword },
      });
    }
  } catch {
    return {
      error: "Something went wrong! Please try again",
    };
  }

  revalidatePath("/settings");

  return {
    success: "Updated password successfully!",
  };
}

export async function createCredentialAccount(
  _prevState: unknown,
  values: z.infer<typeof createCredentialAccountSchema>,
): Promise<
  | {
      success?: never;
      error: string;
    }
  | {
      success: string;
      error?: never;
    }
> {
  const session = await getSession({ redirectOnNull: true });
  const validated = createCredentialAccountSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  const { password } = validated.data;

  try {
    const authContext = await auth.$context;
    const accounts = await authContext.internalAdapter.findAccounts(
      session.user.id,
    );
    const credentialAccount = accounts.find(
      (account) => account.providerId === "credential",
    );

    if (!credentialAccount) {
      await auth.api.setPassword({
        headers: await headers(),
        body: {
          newPassword: password,
        },
      });
    } else {
      return {
        error: "The user already have a credential account.",
      };
    }
  } catch {
    return {
      error: "Something went wrong! Please try again",
    };
  }

  revalidatePath("/settings");

  return {
    success: "Created a credential account successfully!",
  };
}

export async function deleteUser(
  _prevState: unknown,
  values: z.infer<typeof deleteUserSchema>,
): Promise<
  | {
      success?: never;
      error: string;
    }
  | {
      success: string;
      error?: never;
    }
> {
  await getSession({ redirectOnNull: true });

  const validated = deleteUserSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        callbackURL: "/",
      },
    });
  } catch {
    return {
      error: "Something went wrong! Please try again",
    };
  }

  revalidatePath("/");

  return {
    success: "Check your inbox to complete deletion process.",
  };
}

export async function removePassword(
  _prevState: unknown,
  values: z.infer<typeof removePasswordSchema>,
): Promise<{ error: string }> {
  const session = await getSession({ redirectOnNull: true });
  const validated = removePasswordSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  const { currentPassword } = validated.data;

  try {
    const authContext = await auth.$context;
    const accounts = await authContext.internalAdapter.findAccounts(
      session.user.id,
    );
    const credentialAccount = accounts.find(
      (account) => account.providerId === "credential",
    );

    if (credentialAccount == null) {
      return {
        error: "The user does not have a credential account.",
      };
    }

    if (
      !(await authContext.password.verify({
        password: currentPassword,
        hash: credentialAccount.password!,
      }))
    ) {
      return {
        error: "Incorrect password.",
      };
    }

    await auth.api.unlinkAccount({
      headers: await headers(),

      body: {
        providerId: "credential",
      },
    });
  } catch {
    return {
      error: "Something went wrong! Please try again.",
    };
  }

  return redirect("/settings");
}

// Add `newEmail` parameter just in case the corresponding `EmailChangeRequest` record is deleted or not correct.
export async function sendNewEmailVerificationLink(
  _prevState: unknown,
  newEmail: string,
): Promise<
  | {
      success?: never;
      error: string;
    }
  | {
      success: string;
      error?: never;
    }
> {
  const { user } = await getSession({ redirectOnNull: true });
  let existingEmailChangeRequest: EmailChangeRequest | null = null;
  let token: string | null = null;

  try {
    existingEmailChangeRequest = await prisma.emailChangeRequest.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (existingEmailChangeRequest != null) {
      await prisma.emailChangeRequest.update({
        where: {
          id: existingEmailChangeRequest.id,
        },
        data: {
          expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
          updatedAt: new Date(Date.now()),
        },
      });

      token = existingEmailChangeRequest.token;
    } else {
      const newEmailChangeRequest = await prisma.emailChangeRequest.create({
        data: {
          newEmail,
          expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      token = newEmailChangeRequest.token;
    }

    await sendNewEmailVerificationMail(newEmail, token);
  } catch {
    // Revert back changes
    try {
      if (token != null) {
        if (token === existingEmailChangeRequest?.token) {
          await prisma.emailChangeRequest.update({
            where: {
              id: existingEmailChangeRequest.id,
            },
            data: {
              expiresAt: existingEmailChangeRequest.expiresAt,
              updatedAt: existingEmailChangeRequest.updatedAt,
            },
          });
        } else {
          await prisma.emailChangeRequest.delete({
            where: {
              token,
            },
          });
        }
      }
    } catch {
      return {
        error: "Something went wrong! Please try again.",
      };
    }

    return {
      error: "Something went wrong! Please try again.",
    };
  }

  revalidatePath("/settings");

  return { success: "Verification link resent successfully." };
}
