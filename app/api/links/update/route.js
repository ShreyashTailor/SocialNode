import { updateCustomLink } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage, validateHttpUrl } from "@/lib/security";

const ICONS = new Set(["link", "github", "youtube", "instagram", "twitter", "facebook", "linkedin", "discord", "telegram", "website", "blog", "spotify", "twitch", "email", "phone"]);

export async function PATCH(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id <= 0) return Response.json({ error: "Valid link ID required." }, { status: 400 });

    const updates = {};
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 100) return Response.json({ error: "Invalid title." }, { status: 400 });
      updates.title = body.title.trim();
    }
    if (body.url !== undefined) {
      const url = validateHttpUrl(body.url);
      if (!url) return Response.json({ error: "Only valid HTTP/HTTPS URLs are allowed." }, { status: 400 });
      updates.url = url;
    }
    if (body.description !== undefined) updates.description = typeof body.description === "string" ? body.description.trim().slice(0, 300) || null : null;
    if (body.icon !== undefined) updates.icon = ICONS.has(body.icon) ? body.icon : "link";
    if (body.enabled !== undefined) updates.enabled = body.enabled ? 1 : 0;
    if (body.scheduled !== undefined) updates.scheduled = body.scheduled ? 1 : 0;
    if (body.start_at !== undefined) updates.start_at = Number.isInteger(body.start_at) ? body.start_at : null;
    if (body.end_at !== undefined) updates.end_at = Number.isInteger(body.end_at) ? body.end_at : null;
    if (updates.start_at && updates.end_at && updates.start_at > updates.end_at) return Response.json({ error: "Start time must be before end time." }, { status: 400 });
    if (!Object.keys(updates).length) return Response.json({ error: "No changes supplied." }, { status: 400 });

    await updateCustomLink(id, user.id, updates);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Update link error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
