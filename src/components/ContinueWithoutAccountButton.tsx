import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { User2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContinueWithoutAccountButton(
  props: React.ComponentProps<typeof Button>,
) {
  return (
    <Button
      type="button"
      variant="outline"
      asChild
      {...props}
      className={cn("mt-3 w-full", props.className)}
    >
      <Link href="/">
        <User2Icon /> Continue without account
      </Link>
    </Button>
  );
}
