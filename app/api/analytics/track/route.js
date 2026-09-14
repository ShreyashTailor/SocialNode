import { findUserByUsername, recordEvent } from "@/models/user";
import { readJson, validateUsername } from "@/lib/security";
import { headers } from "next/headers";
import crypto from "node:crypto";

// Best-effort per-instance limiter. Use an edge/distributed limiter (e.g. Redis)
// if this endpoint becomes high traffic across many serverless instances.
const rateMap = new Map();
const WINDOW_MS = 60_000;
const MAX_EVENTS = 30;

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now - entry.start >= WINDOW_MS) {
    rateMap.set(key, { start: now, count: 1 });
    if (rateMap.size > 5000) rateMap.delete(rateMap.keys().next().value);
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_EVENTS;
}

function visitorHash(ip, ua) {
  return `v_${crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32)}`;
}

function parseUserAgent(ua = "") {
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) device = "Tablet";
  else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) device = "Mobile";
  let browser = "Other";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";
  let os = "Other";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iOS|iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  return { device, browser, os };
}

export async function POST(req) {
  try {
    const headersList = await headers();
    const ua = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";
    if (isRateLimited(visitorHash(ip, "rate-limit"))) return Response.json({ ok: false }, { status: 429 });

    const body = await readJson(req, 16 * 1024);
    const username = validateUsername(body.username);
    const type = body.type === "view" || body.type === "click" ? body.type : null;
    if (!username || !type) return Response.json({ error: "Invalid analytics event." }, { status: 400 });

    const dbUser = await findUserByUsername(username);
    if (!dbUser) return Response.json({ error: "User not found." }, { status: 404 });

    const linkId = body.linkId == null ? null : Number(body.linkId);
    if (linkId !== null && (!Number.isSafeInteger(linkId) || linkId <= 0)) return Response.json({ error: "Invalid link ID." }, { status: 400 });
    const linkTitle = typeof body.linkTitle === "string" ? body.linkTitle.slice(0, 200) : null;
    const { device, browser, os } = parseUserAgent(ua);
    const referrer = (headersList.get("referer") || "").slice(0, 2048) || null;

    await recordEvent({
      user_id: dbUser.id,
      type,
      link_id: linkId,
      link_title: linkTitle,
      visitor_id: visitorHash(ip, ua),
      device,
      browser,
      os,
      referrer,
    });

    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Analytics tracking error:", err);
    return Response.json({ error: "Unable to record analytics." }, { status: 500 });
  }
}
