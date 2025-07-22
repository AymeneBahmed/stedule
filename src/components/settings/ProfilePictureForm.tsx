"use client";

import { profilePictureSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CameraIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function ProfilePictureForm() {
  const form = useForm<z.infer<typeof profilePictureSchema>>({
    resolver: zodResolver(profilePictureSchema),
  });
  const session = authClient.useSession();
  const userName = session.data?.user.name;
  const userImage = session.data?.user.image;
  const fileInput = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof profilePictureSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-4">
                <FormControl className="hidden">
                  <Input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </FormControl>

                <Avatar className="size-17">
                  <AvatarImage
                    className="object-cover"
                    src={userImage ?? undefined}
                    alt="Profile Picture"
                  />
                  <AvatarFallback>
                    {userName
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <FormLabel className="flex-col items-start justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    className={cn(
                      fieldState.error &&
                        "ring-destructive text-destructive ring",
                    )}
                    onClick={() => fileInput.current?.click()}
                  >
                    <CameraIcon />
                    Change picture
                  </Button>

                  <div className="text-muted-foreground text-xs">
                    JPG, JPEG, PNG, SVG, WEBP or GIF
                  </div>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button>Save changes</Button>
      </form>
    </Form>
  );
}
