import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ContinueWithoutAccountButton(
  props: React.ComponentProps<typeof Button>,
) {
  return (
    <Button
      type="button"
      variant="link"
      asChild
      {...props}
      className={cn("text-muted-foreground mt-3 w-full", props.className)}
    >
      <Link href="/">Continue without account</Link>
    </Button>
  );
}
