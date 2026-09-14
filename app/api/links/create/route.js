import { createCustomLink, getCustomLinks } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage, validateHttpUrl } from "@/lib/security";

const ICONS = new Set(["link", "github", "youtube", "instagram", "twitter", "facebook", "linkedin", "discord", "telegram", "website", "blog", "spotify", "twitch", "email", "phone"]);

export async function POST(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const url = validateHttpUrl(body.url);
    if (!title || title.length > 100) return Response.json({ error: "Title is required and must be 100 characters or fewer." }, { status: 400 });
    if (!url) return Response.json({ error: "Only valid HTTP/HTTPS URLs are allowed." }, { status: 400 });

    const links = await getCustomLinks(user.id);
    if (links.length >= 100) return Response.json({ error: "You can have at most 100 custom links." }, { status: 400 });

    const description = typeof body.description === "string" ? body.description.trim().slice(0, 300) || null : null;
    const icon = ICONS.has(body.icon) ? body.icon : "link";
    const scheduled = body.scheduled ? 1 : 0;
    const start_at = Number.isInteger(body.start_at) ? body.start_at : null;
    const end_at = Number.isInteger(body.end_at) ? body.end_at : null;
    if (scheduled && start_at && end_at && start_at > end_at) return Response.json({ error: "Start time must be before end time." }, { status: 400 });

    const id = await createCustomLink({ user_id: user.id, title, url, description, icon, enabled: 1, sort_order: links.length, scheduled, start_at, end_at });
    return Response.json({ id }, { status: 201 });
  } catch (err) {
    console.error("Create link error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
