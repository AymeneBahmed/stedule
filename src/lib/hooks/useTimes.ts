import useSWR from "swr";
import { fetcher } from "../utils";
import { Time } from "@prisma/client";

export function useTimes() {
  const options = useSWR<Time | { error: string }>("/api/times", fetcher);

  return options;
}
