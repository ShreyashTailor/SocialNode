import { updateGithubFeatured } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage } from "@/lib/security";

export async function POST(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    if (!Array.isArray(body.featured) || body.featured.length > 30 || body.featured.some((v) => typeof v !== "string" || v.length > 200)) {
      return Response.json({ error: "Invalid featured repositories." }, { status: 400 });
    }
    await updateGithubFeatured(user.id, [...new Set(body.featured)]);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("GitHub featured save error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
