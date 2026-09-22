import { upsertAppearance } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage, validateColor, validateGradient, validateHttpUrl } from "@/lib/security";

// Keep in sync with THEMES in app/(user)/dashboard/appearance/_components/AppearanceForm.jsx.
const THEMES = new Set([
  "minimal", "dark", "neon", "quantum", "sunset", "ocean", "forest", "retro", "glass",
  "professional", "luxury", "apple", "developer", "cyberpunk", "creator", "monochrome", "card",
  "dark-linktree", "light-linkinbio", "yellow-flowlink", "pink-linktree", "dark-3d",
  "cream-linkinbio", "minimal-pill", "light-logoheader", "dark-lorem", "minim-links",
  "lime-fade", "crimson-fade", "sage-grid", "warm-beige", "violet-pop", "prism-swirl",
]);
const BUTTON_STYLES = new Set(["filled", "outlined", "glass", "neon", "solid", "terminal"]);
const BUTTON_SHAPES = new Set(["sharp", "rounded", "pill", "square"]);
const FONTS = new Set([
  "inter", "poppins", "outfit", "space-grotesk", "nunito", "rounded",
  "serif", "lora", "dm-serif", "bebas-neue", "caveat", "mono",
]);

export async function POST(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    const theme = THEMES.has(body.theme) ? body.theme : "minimal";
    const bg_color = validateColor(body.bg_color);
    const text_color = validateColor(body.text_color) || "#111111";
    const link_color = validateColor(body.link_color) || "#000000";
    const bg_gradient = validateGradient(body.bg_gradient);
    const bg_image = body.bg_image ? validateHttpUrl(body.bg_image) : null;
    if (body.bg_image && !bg_image) return Response.json({ error: "Background image must be an HTTP/HTTPS URL." }, { status: 400 });

    await upsertAppearance(user.id, {
      theme,
      bg_color,
      bg_gradient,
      bg_image,
      button_style: BUTTON_STYLES.has(body.button_style) ? body.button_style : "filled",
      button_shape: BUTTON_SHAPES.has(body.button_shape) ? body.button_shape : "rounded",
      font: FONTS.has(body.font) ? body.font : "inter",
      text_color,
      link_color,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Appearance save error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
