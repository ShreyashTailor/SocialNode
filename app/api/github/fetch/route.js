import { upsertGithubCache } from "@/models/user";
import { getCurrentDbUser, assertSameOrigin, readJson, safeErrorMessage } from "@/lib/security";

const GITHUB_USERNAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

async function githubFetch(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "SocialNode/1.0" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return { response, data: null };
  return { response, data: await response.json() };
}

export async function POST(req) {
  try {
    if (!assertSameOrigin(req)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
    const user = await getCurrentDbUser();
    if (!user) return Response.json({ error: "Unauthorized or profile not found." }, { status: 401 });
    const body = await readJson(req);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    if (!GITHUB_USERNAME_RE.test(username)) return Response.json({ error: "Invalid GitHub username." }, { status: 400 });

    const profileResult = await githubFetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (profileResult.response.status === 404) return Response.json({ error: "User not found on GitHub." }, { status: 404 });
    if (!profileResult.response.ok) return Response.json({ error: "GitHub API is unavailable." }, { status: 502 });

    const reposResult = await githubFetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=owner`);
    if (!reposResult.response.ok) return Response.json({ error: "Failed to fetch GitHub repositories." }, { status: 502 });

    const profile = profileResult.data;
    const repos = Array.isArray(reposResult.data) ? reposResult.data
      .filter((r) => !r.fork)
      .sort((a, b) => Number(b.stargazers_count || 0) - Number(a.stargazers_count || 0))
      .slice(0, 30)
      .map((r) => ({ name: r.name, description: r.description, html_url: r.html_url, stargazers_count: r.stargazers_count, forks_count: r.forks_count, language: r.language })) : [];

    const safeProfile = {
      login: profile.login, name: profile.name, avatar_url: profile.avatar_url, bio: profile.bio,
      public_repos: profile.public_repos, followers: profile.followers, following: profile.following,
    };
    await upsertGithubCache(user.id, username, JSON.stringify(safeProfile), JSON.stringify(repos), "[]");
    return Response.json({ profile: safeProfile, repos });
  } catch (err) {
    console.error("GitHub fetch error:", err);
    return Response.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}
