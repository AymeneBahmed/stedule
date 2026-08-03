"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ThemeTogglerButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing theme icon
  useEffect(() => {
    // Disable synchronous state update error because the workaround using useSyncExternalStore is ugly
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function toggleDarkMode() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  if (!mounted) {
    // Return a button without icon during SSR/initial render
    return <Button size="icon" {...props} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" onClick={toggleDarkMode} {...props}>
          {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
      </TooltipTrigger>

      <TooltipContent>Change Theme</TooltipContent>
    </Tooltip>
  );
}
