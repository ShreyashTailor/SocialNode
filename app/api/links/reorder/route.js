import { getCustomLinks, reorderCustomLinks } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage } from "@/lib/security";

export async function POST(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    if (!Array.isArray(body.orderedIds) || body.orderedIds.length > 100) return Response.json({ error: "Invalid orderedIds." }, { status: 400 });
    const ids = body.orderedIds.map(Number);
    if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0) || new Set(ids).size !== ids.length) return Response.json({ error: "Invalid link IDs." }, { status: 400 });
    const current = await getCustomLinks(user.id);
    const currentIds = new Set(current.map((l) => Number(l.id)));
    if (ids.length !== current.length || ids.some((id) => !currentIds.has(id))) return Response.json({ error: "The link list is out of date. Refresh and try again." }, { status: 409 });
    await reorderCustomLinks(user.id, ids);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Reorder links error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
