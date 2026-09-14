import { cache } from "react";
import { getPublicUserByUsername, getCustomLinks, getAppearance, getGithubCache } from "@/models/user";
import { validateHttpUrl, validateUsername } from "@/lib/security";
import { notFound } from "next/navigation";
import PublicProfile from "../_components/PublicProfile";

export const revalidate = 30;

const SOCIAL_FIELDS = [
  "youtube", "instagram", "facebook", "twitter", "linkedin", "github", "snapchat", "threads",
  "reddit", "twitch", "soundcloud", "spotify", "discord", "telegram", "whatsapp", "stackoverflow",
  "leetcode", "codeforces", "hackerrank", "codechef", "geeksForGeeks",
];

const getProfile = cache(async (username) => {
  const user = await getPublicUserByUsername(username);
  if (!user) return null;

  const [allLinks, appearance, githubCache] = await Promise.all([
    getCustomLinks(user.id),
    getAppearance(user.id),
    getGithubCache(user.id),
  ]);

  const now = Math.floor(Date.now() / 1000);
  const activeLinks = allLinks.filter((link) => {
    if (!link.enabled) return false;
    if (!validateHttpUrl(link.url)) return false;
    if (!link.scheduled) return true;
    if (link.start_at && now < Number(link.start_at)) return false;
    if (link.end_at && now > Number(link.end_at)) return false;
    return true;
  }).map((link) => ({
    id: Number(link.id),
    title: String(link.title || "").slice(0, 100),
    description: link.description ? String(link.description).slice(0, 300) : null,
    url: validateHttpUrl(link.url),
    icon: link.icon,
  }));

  const safeUser = { ...user };
  for (const field of SOCIAL_FIELDS) {
    safeUser[field] = validateHttpUrl(safeUser[field]) || null;
  }
  safeUser.image = validateHttpUrl(safeUser.image) || null;

  let featuredRepos = [];
  try {
    const repos = githubCache?.repos_json ? JSON.parse(githubCache.repos_json) : [];
    const featured = githubCache?.featured ? JSON.parse(githubCache.featured) : [];
    if (Array.isArray(repos) && Array.isArray(featured)) {
      const featuredSet = new Set(featured.filter((x) => typeof x === "string"));
      featuredRepos = repos.filter((r) => r && featuredSet.has(r.name) && validateHttpUrl(r.html_url)).slice(0, 30);
    }
  } catch {
    featuredRepos = [];
  }

  return { user: safeUser, customLinks: activeLinks, appearance, featuredRepos };
});

export async function generateMetadata({ params }) {
  const { username: rawUsername } = await params;
  const username = validateUsername(rawUsername);
  if (!username) return { title: "Profile Not Found" };
  const profile = await getProfile(username);
  if (!profile) return { title: "Profile Not Found" };
  const { user } = profile;
  const description = user.bio || `Check out ${user.name}'s links and projects on SocialNode.`;
  return {
    title: `${user.name} | SocialNode`,
    description,
    openGraph: { title: `${user.name} | SocialNode`, description, images: user.image ? [{ url: user.image }] : [] },
    twitter: { card: "summary_large_image", title: `${user.name} | SocialNode`, description, images: user.image ? [user.image] : [] },
  };
}

export default async function UsernamePage({ params }) {
  const { username: rawUsername } = await params;
  const username = validateUsername(rawUsername);
  if (!username) notFound();
  const profile = await getProfile(username);
  if (!profile) notFound();
  return <PublicProfile {...profile} />;
}
