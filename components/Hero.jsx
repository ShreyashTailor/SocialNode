import { ArrowRight, BarChart3, GitBranch, Link2, Palette, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

const features = [
  { icon: Link2, label: "Custom Profile URL" },
  { icon: BarChart3, label: "Advanced Analytics" },
  { icon: GitBranch, label: "GitHub Integration" },
  { icon: Palette, label: "Themes & Customization" },
];

export default async function Hero() {
  const user = await currentUser();
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(229_100%_62%/0.15),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-medium mb-8">
          <Zap className="h-3 w-3 text-primary" />
          Your digital identity, all in one link
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-3xl mx-auto leading-tight">
          One link for your{" "}
          <span className="text-primary">entire digital presence</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Share your social links, portfolio, and GitHub projects in one
          beautiful, customizable profile. Know exactly who&apos;s visiting
          with real analytics.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href={!user ? "/sign-up" : "/dashboard"} className="gap-2">
              {!user ? "Create your profile" : "Go to Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">See features</Link>
          </Button>
        </div>

        {/* Feature pills */}
        <div
          id="features"
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </div>

        {/* Preview image */}
        <div className="mt-20 rounded-xl border shadow-2xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-muted h-8 flex items-center gap-1.5 px-4 border-b">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="ml-4 flex-1 bg-background rounded text-xs text-muted-foreground px-3 py-0.5 max-w-48 text-center">
              socialnode.blear.in/yourname
            </div>
          </div>
          <img
            className="w-full"
            src="/assets/homepage.png"
            alt="SocialNode preview"
          />
        </div>
      </div>
    </section>
  );
}
