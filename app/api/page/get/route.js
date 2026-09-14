import { getPublicUserByUsername } from "@/models/user";
import { validateUsername } from "@/lib/security";

export async function POST(req) {
  try {
    const body = await req.json();
    const username = validateUsername(body?.username);
    if (!username) return Response.json({ error: "Invalid username." }, { status: 400 });
    const data = await getPublicUserByUsername(username);
    return Response.json({ data }, { status: 200, headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Public profile API error:", error);
    return Response.json({ error: "Unable to load profile." }, { status: 500 });
  }
}
