import { prisma } from "@/lib/prisma";
import test, { expect } from "@playwright/test";

test("credentials signup", async ({ page }) => {
  await page.goto("/signup");

  const currentTime = Date.now();
  const fakeName = `User ${currentTime}`;
  const fakeEmail = `user${currentTime}@gmail.com`;
  const fakePassword = "I love pizza but I don't know why";

  await page.getByRole("textbox", { name: "Full Name" }).fill(fakeName);
  await page.getByRole("textbox", { name: "Email" }).fill(fakeEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(fakePassword);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL("/verify-email/otp");

  const codeInput = page.getByRole("textbox", { name: "Code:" });

  await expect(codeInput).toBeVisible();

  // Kind of cheating but we're not making money with this app so...
  const verificationCode = (
    await prisma.verification.findFirst({
      where: { identifier: `email-verification-otp-${fakeEmail}` },
      orderBy: { createdAt: "desc" },
    })
  )?.value;

  expect(verificationCode).toBeDefined();

  // The code is of form xxxxxx:0 so we need to remove ":0"
  await codeInput.fill(verificationCode!.slice(0, 6));
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(fakeName)).toBeVisible();

  await page.pause();
});
