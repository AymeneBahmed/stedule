import { prisma } from "@/lib/prisma";
import test, { expect } from "@playwright/test";

test("authentication", async ({ page }) => {
  // PART 1: SIGN UP
  await page.goto("/signup");

  const currentTime = Date.now();
  const fakeName = `User ${currentTime}`;
  const fakeEmail = `user${currentTime}@gmail.com`;
  const fakePassword = "I love pizza but I don't know why";

  await page.getByRole("textbox", { name: "Full Name" }).fill(fakeName);
  await page.getByRole("textbox", { name: "Email" }).fill(fakeEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(fakePassword);
  await page.getByRole("button", { name: "Create account" }).click();
  // Set timeout to 5 mins (300000ms) as verification sends a verification email which can be slow on bad internet speed (like mine)
  await expect(page).toHaveURL("/verify-email/otp", { timeout: 300_000 });

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

  const nameElement = page.getByText(fakeName);
  const signupButton = page.getByRole("link", { name: "Sign up" });
  const loginButton = page.getByRole("link", { name: "Log in" });

  await expect(nameElement).toBeVisible();
  await expect(signupButton).toBeHidden();
  await expect(loginButton).toBeHidden();

  // PART 2: LOGOUT
  await nameElement.click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  await expect(nameElement).toBeHidden();
  await expect(signupButton).toBeVisible();
  await expect(loginButton).toBeVisible();

  // PART 3: LOGIN
  await loginButton.click();
  await expect(page).toHaveURL("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(fakeEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(fakePassword);
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page).toHaveURL("/", { timeout: 100_000 });
  await expect(nameElement).toBeVisible();
  await expect(signupButton).toBeHidden();
  await expect(loginButton).toBeHidden();
});
