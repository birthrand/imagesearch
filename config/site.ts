import { appUrl } from "@/lib/env";

export const siteConfig = {
  name: "Lumos LMS",
  description:
    "A modern learning management system built with Next.js to deliver engaging educational experiences.",
  url: appUrl,
  links: {
    github: "https://github.com/cto-new",
    docs: "https://cto.new",
  },
};

export type SiteConfig = typeof siteConfig;
