"use client";

import React from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function GoogleLoginButton(props: React.ComponentProps<typeof Button>) {
  async function loginWithGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  return (
    <Button className="w-full" onClick={loginWithGoogle} {...props}>
      <img src="google-icon.svg" alt="" className="size-5" />
      <span>Continue with Google</span>
    </Button>
  );
}
