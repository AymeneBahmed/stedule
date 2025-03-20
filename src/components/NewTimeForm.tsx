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
import { startTransition, useActionState, useEffect, useState } from "react";
import { addNewTime } from "@/actions/new-time-form-actions";
import FormError from "./FormError";
import { useShouldOpenNewTimeFormStore } from "@/lib/stores/shouldOpenNewTimeFormStore";

export default function NewTimeForm() {
  const form = useForm<z.infer<typeof newTimeSchema>>({
    resolver: zodResolver(newTimeSchema),
    defaultValues: {
      time: "",
    },
  });
  const [state, addNewTimeAction, isPending] = useActionState(addNewTime, null);
  const [submitted, setSubmitted] = useState(false);
  const { closeNewTimeForm } = useShouldOpenNewTimeFormStore();

  function onSubmit(values: z.infer<typeof newTimeSchema>) {
    startTransition(() => {
      setSubmitted(true);
      addNewTimeAction(values);
    });
  }

  useEffect(() => {
    if (submitted && state?.error == null) {
      closeNewTimeForm();
    }
  }, [closeNewTimeForm, state?.error, submitted]);

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

        {state?.error && <FormError message={state.error} />}

        <Button className="mt-10 w-full" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
