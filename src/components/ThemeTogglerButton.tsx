"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeTogglerButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing theme icon
  useEffect(() => {
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
    <Button size="icon" onClick={toggleDarkMode} {...props}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
