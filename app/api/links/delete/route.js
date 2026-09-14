import { deleteCustomLink } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage } from "@/lib/security";

export async function DELETE(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id <= 0) return Response.json({ error: "Valid link ID required." }, { status: 400 });
    await deleteCustomLink(id, user.id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Delete link error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
