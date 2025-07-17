"use server";

import { auth, getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  deleteAccountSchema,
  profileInformationSchema,
  updatePasswordSchema,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

  const { fullName, email } = validated.data;

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: fullName,
        email,
      },
    });
  } catch {
    return {
      error: "Something went wrong! Please try again",
    };
  }

  revalidatePath("/settings");

  return {
    success: "Updated profile information successfully!",
  };
}

export async function updatePassword(
  _prevState: unknown,
  values: z.infer<typeof updatePasswordSchema>,
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
      await auth.api.setPassword({
        body: { newPassword },
      });
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

export async function deleteAccount(
  _prevState: unknown,
  values: z.infer<typeof deleteAccountSchema>,
) {
  await getSession({ redirectOnNull: true });

  const validated = deleteAccountSchema.safeParse(values);

  if (validated.error) {
    return {
      error: "Invalid fields!",
    };
  }

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        password: validated.data.password,
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
    success: "Account deleted successfully.",
  };
}
