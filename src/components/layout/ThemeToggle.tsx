import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  label: string;
}

export default function ThemeToggle({ label }: Props) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  // Icons follow the html.dark class via CSS, so SSR output is already correct
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={label}>
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </Button>
  );
}
