import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Curriculum", href: "#curriculum" },
  { name: "Pricing", href: "#pricing" },
  { name: "Support", href: "#support" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
            <Link href="#get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
