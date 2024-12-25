"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

function ThemeTogglerButton({ ...props }: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();

  function toggleDarkMode() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button size="icon" onClick={toggleDarkMode} {...props}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}

export default dynamic(() => Promise.resolve(ThemeTogglerButton), {
  ssr: false,
});
