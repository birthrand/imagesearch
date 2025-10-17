import Link from "next/link";
import { ArrowRight, BookOpenCheck, Gauge, ShieldCheck, Sparkles, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const features = [
  {
    name: "Cohort-based learning",
    description:
      "Organize learners into cohorts that progress together with shared milestones and automated nudges.",
    icon: Users2,
  },
  {
    name: "Adaptive curriculum",
    description:
      "Build modular pathways that respond to learner performance and personalize the journey in real time.",
    icon: Gauge,
  },
  {
    name: "Authoring studio",
    description:
      "Compose lessons, quizzes, and interactive content with rich media blocks and reusable templates.",
    icon: Sparkles,
  },
  {
    name: "Assessment analytics",
    description:
      "Track learner progress with granular analytics, skill mastery insights, and automated grading.",
    icon: BookOpenCheck,
  },
  {
    name: "Secure delivery",
    description:
      "Enterprise-grade security controls, SSO integrations, and multi-tenant workspace isolation.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-16">
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-gradient-to-b from-surface via-background to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8">
          <div className="max-w-2xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              Build your learning ecosystem faster
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Deliver transformative learning experiences at scale.
              </h1>
              <p className="text-lg text-muted-foreground">
                {siteConfig.name} provides the foundation for instructors and enablement teams to
                design, launch, and measure immersive learning programs across every stage of the
                learner journey.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#get-started" className="inline-flex items-center gap-2">
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={siteConfig.links.docs}>Read the docs</Link>
              </Button>
            </div>
            <div
              className="grid gap-6 rounded-2xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm sm:grid-cols-2"
              id="get-started"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Seamless onboarding
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Connect your identity provider, sync rosters, and import content in minutes with
                  guided checklists.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Integrated tooling
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Rich APIs, webhooks, and SDKs empower teams to automate enrollments and trigger
                  downstream workflows.
                </p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/40 bg-surface p-6 shadow-xl shadow-primary/10">
            <div
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/30 to-transparent"
              aria-hidden
            />
            <div className="relative space-y-4">
              <h2 className="text-lg font-semibold">Insight snapshot</h2>
              <div className="grid gap-4 text-sm">
                <div className="rounded-xl border border-border/30 bg-background/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Active learners
                  </p>
                  <p className="mt-2 text-3xl font-semibold">2,480</p>
                  <p className="text-xs text-muted-foreground">+18% vs. last cohort</p>
                </div>
                <div className="rounded-xl border border-border/30 bg-background/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Completion rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold">92%</p>
                  <p className="text-xs text-muted-foreground">Adaptive pathways enabled</p>
                </div>
                <div className="rounded-xl border border-border/30 bg-background/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Average satisfaction
                  </p>
                  <p className="mt-2 text-3xl font-semibold">4.8/5</p>
                  <p className="text-xs text-muted-foreground">Based on cohort surveys</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Purpose-built for modern teams
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {siteConfig.name} unifies content, cohort management, and analytics so your team can
            iterate faster and focus on delivering outcomes that matter.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
            >
              <feature.icon className="h-10 w-10 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="curriculum"
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-border/60 bg-gradient-to-br from-background to-surface px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8"
      >
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Curriculum design without compromise
          </h2>
          <p className="text-base text-muted-foreground">
            Create multi-week programs, drop-in workshops, and certification paths with reusable
            content blocks. Configure prerequisites, drip schedules, and real-time feedback loops
            from a single workspace.
          </p>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
              Real-time collaboration with commenting, drafts, and version snapshots.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
              Deep integrations with video, whiteboard, and assessment providers.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
              Export pathways to SCORM, xAPI, or share via secure learner portals.
            </li>
          </ul>
        </div>
        <div className="grid w-full gap-4 rounded-3xl border border-border/40 bg-background/70 p-6">
          <div className="rounded-2xl border border-border/40 bg-surface/90 p-5">
            <h3 className="text-base font-semibold">Automation recipes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Trigger reminders when learners fall behind, unlock new modules on mastery, or send
              outcomes to your CRM.
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-surface/90 p-5">
            <h3 className="text-base font-semibold">Performance insights</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Export dashboards or sync analytics into the tools your leadership already trusts.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-background px-6 py-10 shadow-sm sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">Simple, predictable pricing</h2>
              <p className="text-sm text-muted-foreground">
                Flexible plans tailored for emerging academies to enterprise-scale enablement teams.
              </p>
            </div>
            <Button variant="primary" size="lg" asChild>
              <Link href="#support">Talk to sales</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-surface/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Growth
              </p>
              <p className="mt-4 text-3xl font-semibold">$249/mo</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Launch your first cohorts with core authoring, analytics, and community features.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/70 bg-primary text-primary-foreground p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide">Enterprise</p>
              <p className="mt-4 text-3xl font-semibold">Let&apos;s collaborate</p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Advanced compliance, dedicated success manager, and custom integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="support"
        className="mx-auto w-full max-w-5xl rounded-3xl border border-border/60 bg-surface/90 px-6 py-12 text-center shadow-sm sm:px-12"
      >
        <h2 className="text-3xl font-semibold tracking-tight">
          We&apos;re here to help your rollout succeed
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Access implementation playbooks, live office hours, and a dedicated success team ready to
          guide every launch.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="mailto:hello@example.com">Contact support</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={siteConfig.links.docs}>Browse resources</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
