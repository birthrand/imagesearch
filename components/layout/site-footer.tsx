import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link className="transition-colors hover:text-foreground" href={siteConfig.links.github}>
            GitHub
          </Link>
          <Link className="transition-colors hover:text-foreground" href={siteConfig.links.docs}>
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}
