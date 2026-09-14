import { createUser, findUserByUsername, updateUserById } from "@/models/user";
import { getCurrentUserContext, assertSameOrigin, readJson, safeErrorMessage, validateHttpUrl, validateUsername } from "@/lib/security";

const SOCIAL_FIELDS = [
  "youtube", "instagram", "facebook", "twitter", "linkedin", "snapchat", "github", "threads",
  "reddit", "stackoverflow", "leetcode", "codeforces", "hackerrank", "codechef", "geeksForGeeks",
  "twitch", "soundcloud", "spotify", "applemusic", "discord", "telegram", "whatsapp", "skype",
  "amazon", "shopify", "kofi", "buyMeACoffee", "patreon", "website", "blog",
];

function cleanSocial(value) {
  if (!value) return null;
  return validateHttpUrl(String(value).trim());
}

export async function POST(request) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const { clerkUser, email, dbUser } = await getCurrentUserContext();
    if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await readJson(request);
    const username = validateUsername(body.username);
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!username) return Response.json({ error: "Username must be 3–30 characters and use lowercase letters, numbers, - or _." }, { status: 400 });
    if (!name || name.length > 100) return Response.json({ error: "Name is required and must be 100 characters or fewer." }, { status: 400 });

    const existingByUsername = await findUserByUsername(username);
    if (existingByUsername && existingByUsername.email !== email) {
      return Response.json({ error: "Username is already in use." }, { status: 409 });
    }

    const userData = {
      name,
      username,
      bio: typeof body.bio === "string" ? body.bio.trim().slice(0, 500) || null : null,
      image: clerkUser?.imageUrl || null,
    };

    for (const field of SOCIAL_FIELDS) {
      const aliases = field === "instagram" ? ["instagram", "insta"] : field === "facebook" ? ["facebook", "face"] : [field];
      const raw = aliases.map((key) => body[key]).find(Boolean);
      userData[field] = cleanSocial(raw);
    }

    // Phone is intentionally not treated as a URL.
    if (typeof body.phone === "string") userData.phone = body.phone.trim().slice(0, 40) || null;
    // Keep the legacy field for compatibility, but never expose it publicly.
    if (typeof body.accessKey === "string") userData.accessKey = body.accessKey.slice(0, 256);

    if (dbUser) {
      await updateUserById(dbUser.id, userData);
    } else {
      await createUser({ ...userData, email });
    }

    return Response.json({ message: "success" });
  } catch (error) {
    console.error("Profile save error:", error);
    return Response.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}
