import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Props {
  locale: string;
  navItems: { href: string; label: string }[];
  pathname: string;
}

export default function MobileNav({ locale, navItems, pathname }: Props) {
  const [open, setOpen] = useState(false);

  const homeHref = locale === "ja" ? "/" : "/en/";
  const menuLabel = locale === "ja" ? "メニュー" : "Menu";

  const allItems = [
    { href: homeHref, label: "Home" },
    ...navItems,
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="size-5" />
          <span className="sr-only">{menuLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{menuLabel}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 px-4">
          {allItems.map((item) => {
            const isHome = item.href === "/" || item.href === "/en/";
            const isActive = isHome
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-base transition-colors hover:text-foreground",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
