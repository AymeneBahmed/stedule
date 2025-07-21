"use client";

import { sendNewEmailVerificationLink } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export function RequestNewVerificationLinkButton({
  newEmail,
  children,
}: {
  newEmail: string;
  children: React.ReactNode;
}) {
  const [state, sendNewEmailVerificationLinkAction, isPending] = useActionState(
    sendNewEmailVerificationLink,
    null,
  );

  function handleClick() {
    startTransition(() => {
      sendNewEmailVerificationLinkAction(newEmail);
    });
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);

      return;
    }

    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Button
      variant="link"
      className="ml-0 px-0 pt-0 text-[1rem] underline hover:text-white"
      disabled={isPending}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
