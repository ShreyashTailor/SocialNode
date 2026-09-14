import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { findUserByEmail } from "@/models/user";

export const USERNAME_RE = /^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/;

export function validateUsername(value) {
  const username = typeof value === "string" ? value.trim().toLowerCase() : "";
  return USERNAME_RE.test(username) ? username : null;
}

export function validateHttpUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateColor(value) {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || value.length > 100) return null;
  return /^(#[0-9a-fA-F]{3,8}|rgba?\([0-9., %]+\)|hsla?\([0-9., %]+\))$/.test(value.trim())
    ? value.trim()
    : null;
}

export function validateGradient(value) {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || value.length > 1000) return null;
  return /^(linear|radial|conic)-gradient\([a-zA-Z0-9#%.,\s+\-()]+\)$/.test(value.trim())
    ? value.trim()
    : null;
}

export function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function readJson(request, maxBytes = 64 * 1024) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes) throw new Error("Request body is too large.");
  const body = await request.json();
  return body && typeof body === "object" && !Array.isArray(body) ? body : {};
}

export const getCurrentUserContext = cache(async () => {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase();
  const dbUser = email ? await findUserByEmail(email) : null;
  return { clerkUser, email, dbUser };
});

export const getCurrentDbUser = cache(async () => {
  const { dbUser } = await getCurrentUserContext();
  return dbUser;
});


export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
    return url.host === host && url.protocol === `${proto}:`;
  } catch {
    return false;
  }
}

export function safeErrorMessage(error) {
  if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") return "That value is already in use.";
  if (error?.message?.includes("UNIQUE constraint failed")) return "That value is already in use.";
  return "Something went wrong. Please try again.";
}
