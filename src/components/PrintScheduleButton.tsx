"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function PrintScheduleButtonComp({
  ...props
}: React.ComponentProps<typeof Button>) {
  const scheduleTableRef = useRef<HTMLTableElement>(
    document.querySelector("#schedule-table"),
  );
  const reactToPrintFn = useReactToPrint({
    contentRef: scheduleTableRef,
    documentTitle: "schedule",
  });

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

export const PrintScheduleButton = dynamic(
  () => Promise.resolve(PrintScheduleButtonComp),
  {
    ssr: false,
  },
);
