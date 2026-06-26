"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function PrintScheduleButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  const scheduleTableRef = useRef<HTMLTableElement | null>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: scheduleTableRef,
    documentTitle: "schedule",
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    scheduleTableRef.current = document.querySelector("#schedule-table");
  }, []);

  if (!isMounted) {
    return (
      <Button size="icon" {...props} disabled>
        <DownloadIcon />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" onClick={reactToPrintFn} {...props}>
          <DownloadIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>Print Schedule</TooltipContent>
    </Tooltip>
  );
}
