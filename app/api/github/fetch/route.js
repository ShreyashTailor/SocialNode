import { currentUser } from "@clerk/nextjs/server";
import { findUser, upsertGithubCache } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await findUser("email", email);
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    // Fetch profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "User-Agent": "SocialNode" },
    });
    if (!profileRes.ok) {
      if (profileRes.status === 404) return NextResponse.json({ error: "User not found on GitHub" }, { status: 404 });
      throw new Error("GitHub API error");
    }
    const profile = await profileRes.json();

    // Fetch repos (top 30 by stars)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers: { "User-Agent": "SocialNode" },
    });
    if (!reposRes.ok) throw new Error("Failed to fetch repos");
    let repos = await reposRes.json();
    repos = repos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 30)
      .map((r) => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
      }));

    // Cache in DB
    await upsertGithubCache(
      dbUser.id,
      username,
      JSON.stringify({
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
      }),
      JSON.stringify(repos),
      "[]"
    );

    return NextResponse.json({ profile, repos });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
