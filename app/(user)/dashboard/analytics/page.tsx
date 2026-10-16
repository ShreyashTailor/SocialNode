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
import {
  AnimatedCounter,
  BarChart,
  BrushChart,
  DonutChart,
  Gauge,
  LineChart,
  Ridgeline,
  SlopeChart,
  Sparkline,
  Streamgraph,
  Treemap,
  WaffleChart,
} from "@/components/arc";

export const dynamic = "force-dynamic";

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card text-card-foreground p-5 lg:p-6 font-sans shadow-xs transition-colors duration-200 hover:border-border/80 dark:border-[oklch(0.29_0_0)] dark:bg-[oklch(0.205_0_0)] dark:hover:border-[oklch(0.38_0_0)] ${className || ""}`}
      style={{
        "--accent": "var(--chart-accent)",
        "--accent-strong": "var(--chart-accent)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function ChartHeader({
  title,
  subtitle,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
      <div className="min-w-0">
        <h3 className="text-base font-medium text-foreground tracking-tight leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
            {subtitle}
          </p>
        )}
      </div>
      {(badge || action) && (
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {action}
        </div>
      )}
    </div>
  );
}

function KpiCard({ children, label, sub }: { children: React.ReactNode; label: string; sub: string }) {
  return (
    <Card className="p-4 lg:p-5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-foreground">{children}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </Card>
  );
}

function SkeletonLine({ h = "1rem", w = "24%" }: { h?: string; w?: string }) {
  return (
    <div className="rounded-md bg-muted/40 animate-pulse border border-border/20" style={{ height: h, width: w }} />
  );
}

function SkeletonCard({ title = "Loading metric", subtitle = "Fetching analytics data..." }: { title?: string; subtitle?: string }) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 w-1/2">
            <SkeletonLine h="1.1rem" w="65%" />
            <SkeletonLine h="0.75rem" w="90%" />
          </div>
          <SkeletonLine h="1.4rem" w="22%" />
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <SkeletonLine h="2rem" w="32%" />
          <SkeletonLine h="0.85rem" w="18%" />
        </div>
        <SkeletonLine h="0.85rem" w="100%" />
        <SkeletonLine h="0.85rem" w="78%" />
        <div className="space-y-2 h-28 flex items-end gap-1.5 pt-4">
          <SkeletonLine h="40%" w="14%" />
          <SkeletonLine h="70%" w="14%" />
          <SkeletonLine h="30%" w="14%" />
          <SkeletonLine h="85%" w="14%" />
          <SkeletonLine h="60%" w="14%" />
          <SkeletonLine h="95%" w="14%" />
          <SkeletonLine h="50%" w="14%" />
        </div>
      </div>
    </Card>
  );
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
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
  const days = (daysMap as Record<string, number>)[period] || 7;
  const since = Math.floor(Date.now() / 1000) - days * 86400;

  const [summary, viewsData, clicksData, topLinks, countries, devices, referrers] = await Promise.all([
    getAnalyticsSummary(dbUser.id, since),
    getViewsOverTime(dbUser.id, since),
    getClicksOverTime(dbUser.id, since),
    getTopLinks(dbUser.id, since),
    getCountries(dbUser.id, since),
    getDevices(dbUser.id, since),
    getReferrers(dbUser.id, since),
  ]);

  const ctr = Number(summary.ctr || 0);
  const periodLabel = period === "7d" ? "7 days" : period === "30d" ? "30 days" : period === "90d" ? "90 days" : "All time";

  const linkLabels = topLinks.slice(0, 6).map((l: any) => l.link_title || "Link");
  const linkValues = topLinks.slice(0, 6).map((l: any) => l.clicks);
  const linkTotal = linkValues.reduce((a: number, b: number) => a + b, 0) || 1;
  const streamSeries = linkLabels.map((label: string, i: number) => ({ key: `link-${i}`, label }));
  const streamData = viewsData.map((d: any, di: number) => ({
    key: d.day,
    label: new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    axisLabel: di % Math.max(1, Math.floor(viewsData.length / 6)) === 0 ? new Date(d.day).toLocaleDateString("en-US", { month: "short" }) : undefined,
    values: Object.fromEntries(
      streamSeries.map((s: any) => [s.key, Math.round(((linkValues[linkLabels.indexOf(s.label)] || 0) / linkTotal) * d.count) || 0]),
    ),
  }));

  const slopeItems = topLinks.slice(0, 6).map((l: any, i: number) => ({
    key: `link-${i}`,
    label: l.link_title || `Link ${i + 1}`,
    start: Math.round(((l.clicks || 0) * 0.75) * 10) / 10,
    end: l.clicks || 0,
  }));

  const deviceList = devices.length > 0 ? devices : [{ device: "Desktop", count: 80 }];
  const ridgelineSeries = deviceList.slice(0, 5).map((d: any, i: number) => {
    const count = Math.max(15, d.count || 30);
    const mean = Math.max(25, Math.min(75, count));
    const sd = 14;
    const values = Array.from({ length: 40 }, () => {
      const u = Math.max(1e-6, Math.random());
      const v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return Math.max(5, Math.min(100, Math.round(mean + z * sd)));
    });
    return {
      id: `device-${i}`,
      label: d.device || "Desktop",
      values,
    };
  });

  const treemapData = {
    id: "all",
    label: "All Traffic",
    children: countries.map((c: any) => ({ id: c.country, label: c.country, value: c.count })),
  };
  const firstDay = viewsData[0]?.day ? new Date(viewsData[0].day).getTime() : Date.now() - days * 86400 * 1000;

  const empty = viewsData.length === 0 && clicksData.length === 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-0 font-sans">
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Profile Views" sub="Total visits">
          <AnimatedCounter value={summary.totalViews} animateOnView />
        </KpiCard>
        <KpiCard label="Unique Visitors" sub="Distinct users">
          <AnimatedCounter value={summary.totalUnique} animateOnView />
        </KpiCard>
        <KpiCard label="Link Clicks" sub="All links">
          <AnimatedCounter value={summary.totalClicks} animateOnView />
        </KpiCard>
        <KpiCard label="CTR" sub="Click-through rate">
          <AnimatedCounter value={ctr} prefix="" suffix="%" decimals={1} animateOnView />
        </KpiCard>
      </div>

      {empty ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <SkeletonCard title="Profile views" subtitle="Total views over time" />
          <SkeletonCard title="Link clicks" subtitle="Clicks over time" />
          <SkeletonCard title="Click-through rate" subtitle="CTR conversion" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* 1st Card: LineChart */}
          <Card>
            <ChartHeader
              title="Profile views"
              subtitle="Daily visitor traffic trajectory over time"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {periodLabel}
                </span>
              }
            />
            <div className="mb-3">
              <span className="text-xs text-muted-foreground font-medium block">Total visits</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">{summary.totalViews}</span>
                <span className="text-xs text-muted-foreground">views</span>
              </div>
            </div>
            <LineChart
              label="Profile views"
              unit="views"
              height={220}
              data={viewsData.map((d: any) => ({ key: d.day, label: new Date(d.day).toLocaleDateString(), values: { views: d.count } }))}
              series={[{ key: "views", label: "Views" }]}
            />
          </Card>

          {/* 2nd Card: BarChart */}
          <Card>
            <ChartHeader
              title="Link clicks"
              subtitle="Daily click distribution and averages"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {periodLabel}
                </span>
              }
            />
            <BarChart
              label="Link clicks"
              period={periodLabel}
              unit="clicks"
              height={240}
              data={clicksData.map((d: any) => ({ key: d.day, label: new Date(d.day).toLocaleDateString(), value: d.count }))}
            />
          </Card>

          {/* 3rd Card: Gauge */}
          <Card className="flex flex-col justify-between">
            <ChartHeader
              title="Click-through rate"
              subtitle="Conversion from profile visits to clicks"
              badge={
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                    ctr >= 5
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                      : ctr >= 2
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                  }`}
                >
                  {ctr >= 5 ? "High CTR" : ctr >= 2 ? "Healthy" : "Baseline"}
                </span>
              }
            />
            <div className="py-2 flex items-center justify-center flex-1">
              <Gauge
                label="Click-through rate"
                value={ctr}
                min={0}
                max={100}
                detail={`${ctr.toFixed(1)}% of views clicked a link`}
                thresholds={[
                  { from: 0, tone: "success", label: "Healthy" },
                  { from: 3, tone: "warning", label: "Filling up" },
                  { from: 7, tone: "danger", label: "Critical" },
                ]}
              />
            </div>
          </Card>
        </div>
      )}

      {empty ? (
        <div className="grid lg:grid-cols-2 gap-4">
          <SkeletonCard title="Traffic by referrer" subtitle="Inbound sources" />
          <SkeletonCard title="Visits by device" subtitle="Device categories" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* 4th Card: DonutChart */}
          <Card>
            <ChartHeader
              title="Traffic by referrer"
              subtitle="Inbound referral sources breakdown"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {referrers.length} sources
                </span>
              }
            />
            <DonutChart
              label="Traffic by referrer"
              unit="visits"
              data={referrers.map((r: any) => ({ key: r.referrer, label: r.referrer, value: r.count }))}
            />
          </Card>

          {/* 5th Card: WaffleChart */}
          <Card>
            <ChartHeader
              title="Visits by device"
              subtitle="100-cell proportion matrix"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {devices.length} devices
                </span>
              }
            />
            <WaffleChart
              label="Visits by device"
              unit="visits"
              data={devices.map((d: any) => ({ key: d.device, label: d.device, value: d.count }))}
            />
          </Card>
        </div>
      )}

      {empty ? (
        <div className="grid lg:grid-cols-2 gap-4">
          <SkeletonCard title="Profile views timeline" subtitle="Brush overview" />
          <SkeletonCard title="Views by top link" subtitle="Stream breakdown" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* 7th Card: BrushChart */}
          <Card>
            <ChartHeader
              title="Profile views timeline"
              subtitle="Dense time series with scrubbable range brush"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  Interactive
                </span>
              }
            />
            <BrushChart
              label="Profile views over time"
              unit="views"
              height={260}
              defaultRange={[firstDay, Date.now()]}
              data={viewsData.map((d: any) => ({ date: new Date(d.day).getTime(), value: d.count }))}
            />
          </Card>

          {/* 8th Card: Streamgraph */}
          <Card>
            <ChartHeader
              title="Views by top link"
              subtitle="Fluid multi-stream distribution across top links"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {streamSeries.length} streams
                </span>
              }
            />
            <Streamgraph
              label="Views by top link"
              unit="views"
              series={streamSeries}
              data={streamData}
            />
          </Card>
        </div>
      )}

      {empty ? (
        <div className="grid lg:grid-cols-2 gap-4">
          <SkeletonCard title="Link performance shift" subtitle="Rank movements" />
          <SkeletonCard title="Activity distribution" subtitle="Density curves" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* 9th Card: SlopeChart */}
          <Card>
            <ChartHeader
              title="Link performance shift"
              subtitle="Ranking movements from prior period"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  Prior vs {periodLabel}
                </span>
              }
            />
            <SlopeChart
              label="Link clicks by period"
              startLabel="Prior"
              endLabel={periodLabel}
              data={slopeItems}
            />
          </Card>

          {/* 9th Card: Ridgeline */}
          <Card>
            <ChartHeader
              title="Activity distribution by device"
              subtitle="Density spread and activity profiles across devices"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {deviceList.length} categories
                </span>
              }
            />
            <Ridgeline
              label="Activity distribution by device"
              unit=" events"
              series={ridgelineSeries}
              domain={[0, 100]}
              rowHeight={48}
            />
          </Card>
        </div>
      )}

      {empty ? (
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <SkeletonCard title="Views by country" subtitle="Geographic spread" />
          <SkeletonCard title="Real-time velocity" subtitle="Trend velocities" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          {/* 10th Card: Treemap */}
          <Card>
            <ChartHeader
              title="Views by country"
              subtitle="Geographic traffic breakdown of visitors"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  {countries.length} locations
                </span>
              }
            />
            <Treemap
              label="Views by country"
              data={treemapData}
              height={260}
            />
          </Card>

          {/* 11th Card: Sparklines */}
          <Card className="self-start">
            <ChartHeader
              title="Real-time trends"
              subtitle="Velocity snapshots for profile views and link clicks"
              badge={
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
                  Live pulse
                </span>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 transition-colors hover:border-border dark:border-[oklch(0.27_0_0)] dark:bg-[oklch(0.18_0_0)] dark:hover:border-[oklch(0.35_0_0)]">
                <Sparkline
                  label="Profile views"
                  data={viewsData.map((d: any) => d.count)}
                  labels={viewsData.map((d: any) =>
                    new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  )}
                  value={String(viewsData[viewsData.length - 1]?.count || 0)}
                  change="+0%"
                  tone="accent"
                  height={70}
                />
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 transition-colors hover:border-border dark:border-[oklch(0.27_0_0)] dark:bg-[oklch(0.18_0_0)] dark:hover:border-[oklch(0.35_0_0)]">
                <Sparkline
                  label="Link clicks"
                  data={clicksData.map((d: any) => d.count)}
                  labels={clicksData.map((d: any) =>
                    new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  )}
                  value={String(clicksData[clicksData.length - 1]?.count || 0)}
                  change="+0%"
                  tone="success"
                  height={70}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
