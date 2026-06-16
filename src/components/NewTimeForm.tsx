"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { newTimeSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useActionState, useState, useTransition } from "react";
import { addNewTime } from "@/actions/time-actions";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import { useIsGuestMode } from "@/hooks/use-is-guest-mode";
import { dexieDB } from "@/lib/db/dexieDB";
import { Time } from "@/lib/classes/Time";

export default function NewTimeForm() {
  const form = useForm<z.infer<typeof newTimeSchema>>({
    resolver: zodResolver(newTimeSchema),
    defaultValues: {
      time: "",
    },
  });
  const [actionState, addNewTimeAction, isActionPending] = useActionState(
    addNewTime,
    null,
  );
  const [isTransitionPending, startTransition] = useTransition();
  const isGuestMode = useIsGuestMode();
  const [guestModeSuccess, setGuestModeSucces] = useState<string>();
  const [guestModeError, setGuestModeError] = useState<string>();

  function onSubmit(values: z.infer<typeof newTimeSchema>) {
    startTransition(async () => {
      if (isGuestMode) {
        try {
          await dexieDB.times.add({ ...Time.fromString(values.time)! });

          setGuestModeSucces("Added time successfully");
        } catch {
          // TODO: handle all possible errors later
          setGuestModeError("Something went wrong! Please try again.");
        }
      } else {
        addNewTimeAction(values);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="hh:mm"
                  className="bg-secondary border-gray-400"
                  onInput={(e) => {
                    const value = e.currentTarget.value.replace(/[^0-9]/g, "");
                    let newValue = "";

                    // Automatically insert colon after 2 digits
                    if (value.length > 2) {
                      newValue =
                        value.substring(0, 2) + ":" + value.substring(2, 4);
                    } else {
                      newValue = value;
                    }

                    // Move cursor to correct position
                    e.currentTarget.value = newValue;
                    if (newValue.length === 2 && value.length > 2) {
                      e.currentTarget.setSelectionRange(3, 3);
                    } else if (newValue.length === 2) {
                      e.currentTarget.setSelectionRange(2, 2);
                    } else if (
                      newValue.length === 3 &&
                      !newValue.includes(":")
                    ) {
                      e.currentTarget.value =
                        newValue.substring(0, 2) + ":" + newValue.substring(2);
                      e.currentTarget.setSelectionRange(3, 3);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(actionState?.error || guestModeError) && (
          <FormError message={actionState?.error || guestModeError || ""} />
        )}
        {(actionState?.success || guestModeSuccess) && (
          <FormSuccess
            message={actionState?.success || guestModeSuccess || ""}
          />
        )}

        <Button
          className="mt-10 w-full"
          disabled={isActionPending || isTransitionPending}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
