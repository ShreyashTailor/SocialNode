import { currentUser } from "@clerk/nextjs/server";
import { findUser, getAnalyticsSummary, getCustomLinks } from "@/models/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  GitBranch,
  Link2,
  Palette,
  User,
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function QuickLink({ href, icon: Icon, label, description }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border bg-background p-4 hover:bg-muted/50 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
}

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const dbUser = email ? await findUser("email", email) : null;

  const since7d = Math.floor(Date.now() / 1000) - 7 * 86400;
  const [stats, links] = await Promise.all([
    dbUser ? getAnalyticsSummary(dbUser.id, since7d) : { totalViews: 0, totalUnique: 0, totalClicks: 0, ctr: "0.0" },
    dbUser ? getCustomLinks(dbUser.id) : [],
  ]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const isNewUser = !dbUser;
  const activeLinks = links.filter((l) => l.enabled).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-0">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}, {clerkUser?.firstName || "there"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isNewUser
            ? "Welcome to SocialNode. Let's set up your profile."
            : "Here's how your profile is performing."}
        </p>
      </div>

      {/* New user onboarding */}
      {isNewUser && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-semibold mb-1">Complete your profile</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Set your username and fill in your details to go live.
          </p>
          <Button asChild size="sm">
            <Link href="/dashboard/profile">
              Set up profile <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Stats — last 7 days */}
      {!isNewUser && (
        <>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Last 7 days
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={Eye} label="Profile Views" value={stats.totalViews} sub="Total visits" />
              <StatCard icon={Users} label="Unique Visitors" value={stats.totalUnique} sub="Distinct visitors" />
              <StatCard icon={MousePointerClick} label="Link Clicks" value={stats.totalClicks} sub="Across all links" />
              <StatCard icon={TrendingUp} label="CTR" value={`${stats.ctr}%`} sub="Clicks / views" />
            </div>
          </div>

          {/* Profile URL */}
          <div className="rounded-xl border bg-background p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Your profile URL</p>
              <p className="text-sm font-mono font-medium truncate">
                {typeof window !== "undefined" ? window.location.origin : "https://socialnode.blear.in"}/{dbUser?.username}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${dbUser?.username}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  View
                </Link>
              </Button>
            </div>
          </div>

          {/* Active links count */}
          {links.length > 0 && (
            <div className="rounded-xl border bg-background p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Custom Links</p>
                <p className="text-xs text-muted-foreground">{activeLinks} active · {links.length} total</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/links">Manage <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Quick navigation */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick access</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickLink href="/dashboard/profile" icon={User} label="Profile Settings" description="Name, bio, username, social links" />
          <QuickLink href="/dashboard/links" icon={Link2} label="Manage Links" description="Add and reorder custom links" />
          <QuickLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" description="Views, clicks, countries, devices" />
          <QuickLink href="/dashboard/github" icon={GitBranch} label="GitHub Integration" description="Show your repositories on your profile" />
          <QuickLink href="/dashboard/appearance" icon={Palette} label="Appearance" description="Themes, fonts, and customization" />
        </div>
      </div>
    </div>
  );
}
