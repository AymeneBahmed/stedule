"use server";

import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { profileInformationSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
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
