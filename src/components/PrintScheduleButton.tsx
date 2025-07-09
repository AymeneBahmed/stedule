"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import dynamic from "next/dynamic";

function PrintScheduleButton({
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
    <Button size="icon" onClick={reactToPrintFn} {...props}>
      <DownloadIcon />
    </Button>
  );
}

export default dynamic(() => Promise.resolve(PrintScheduleButton), {
  ssr: false,
});
