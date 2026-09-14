import {
  getAnalyticsSummary,
  getViewsOverTime,
  getClicksOverTime,
  getTopLinks,
  getCountries,
  getDevices,
  getReferrers,
} from "@/models/user";
import { getCurrentUserContext } from "@/lib/security";
import { Eye, MousePointerClick, Users, TrendingUp } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function Table({ title, rows, columns }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="rounded-xl border bg-background p-5">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b last:border-b-0">
            <span className="font-medium truncate">{row[columns[0]]}</span>
            <span className="text-muted-foreground shrink-0">{row[columns[1]]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }) {
  const { dbUser } = await getCurrentUserContext();

  if (!dbUser) {
    return (
      <div className="max-w-2xl mx-auto pt-8 text-center">
        <p className="text-muted-foreground">Please complete your profile first.</p>
      </div>
    );
  }

  const params = await searchParams;
  const period = params?.period || "7d";
  const daysMap = { "7d": 7, "30d": 30, "90d": 90, all: 36500 };
  const days = daysMap[period] || 7;
  const since = Math.floor(Date.now() / 1000) - days * 86400;

  const [summary, viewsData, clicksData, topLinks, countries, devices, referrers] = await Promise.all([
    getAnalyticsSummary(dbUser.id, since),
    getViewsOverTime(dbUser.id, since, days),
    getClicksOverTime(dbUser.id, since),
    getTopLinks(dbUser.id, since),
    getCountries(dbUser.id, since),
    getDevices(dbUser.id, since),
    getReferrers(dbUser.id, since),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track how visitors interact with your profile.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          {["7d", "30d", "90d", "all"].map((p) => (
            <a
              key={p}
              href={`?period=${p}`}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
              }`}
            >
              {p === "7d" && "7 days"}
              {p === "30d" && "30 days"}
              {p === "90d" && "90 days"}
              {p === "all" && "All time"}
            </a>
          ))}
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Profile Views" value={summary.totalViews} sub="Total visits" />
        <StatCard icon={Users} label="Unique Visitors" value={summary.totalUnique} sub="Distinct users" />
        <StatCard icon={MousePointerClick} label="Link Clicks" value={summary.totalClicks} sub="All links" />
        <StatCard icon={TrendingUp} label="CTR" value={`${summary.ctr}%`} sub="Click-through rate" />
      </div>

      {/* Simple bar charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-background p-5">
          <h3 className="text-sm font-semibold mb-4">Profile Views Over Time</h3>
          <div className="flex items-end gap-1 h-32">
            {viewsData.length === 0 && <p className="text-xs text-muted-foreground">No data yet.</p>}
            {viewsData.map((d, i) => {
              const max = Math.max(...viewsData.map((x) => x.count), 1);
              const height = (d.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div
                    className="bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground text-center mt-1 truncate">
                    {new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {d.count} views
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <h3 className="text-sm font-semibold mb-4">Link Clicks Over Time</h3>
          <div className="flex items-end gap-1 h-32">
            {clicksData.length === 0 && <p className="text-xs text-muted-foreground">No data yet.</p>}
            {clicksData.map((d, i) => {
              const max = Math.max(...clicksData.map((x) => x.count), 1);
              const height = (d.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div
                    className="bg-green-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground text-center mt-1 truncate">
                    {new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {d.count} clicks
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Table title="Top Links" rows={topLinks} columns={["link_title", "clicks"]} />
        <Table title="Devices" rows={devices} columns={["device", "count"]} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Table title="Top Referrers" rows={referrers} columns={["referrer", "count"]} />
        <Table title="Countries" rows={countries} columns={["country", "count"]} />
      </div>
    </div>
  );
}
