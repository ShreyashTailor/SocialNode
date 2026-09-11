import { findUser, recordEvent } from "@/models/user";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

async function generateVisitorId() {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown";
  const ua = headersList.get("user-agent") || "unknown";
  // Simple hash for visitor identification (not cryptographic, just deduplication)
  const str = `${ip}-${ua}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `v_${Math.abs(hash).toString(36)}`;
}

function parseUserAgent(ua) {
  ua = ua || "";
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) device = "Tablet";
  else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) device = "Mobile";

  let browser = "Other";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  let os = "Other";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return { device, browser, os };
}

export async function POST(req) {
  try {
    const { username, type, linkId, linkTitle } = await req.json();
    if (!username || !type) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const dbUser = await findUser("username", username);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const visitorId = await generateVisitorId();
    const headersList = await headers();
    const ua = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || null;
    const { device, browser, os } = parseUserAgent(ua);

    // For country, would need GeoIP service — leaving as null for now
    const country = null;

    await recordEvent({
      user_id: dbUser.id,
      type,
      link_id: linkId ?? null,
      link_title: linkTitle ?? null,
      visitor_id: visitorId,
      country,
      device,
      browser,
      os,
      referrer: referer,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
