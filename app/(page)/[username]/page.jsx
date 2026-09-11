import { findUser, getCustomLinks, getAppearance, getGithubCache } from "@/models/user";
import { notFound } from "next/navigation";
import PublicProfile from "../_components/PublicProfile";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await findUser("username", username);
  if (!user) return { title: "Profile Not Found" };

  return {
    title: `${user.name} | SocialNode`,
    description: user.bio || `Check out ${user.name}'s links and projects on SocialNode.`,
    openGraph: {
      title: `${user.name} | SocialNode`,
      description: user.bio || `Check out ${user.name}'s links and projects on SocialNode.`,
      images: user.image ? [{ url: user.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name} | SocialNode`,
      description: user.bio || `Check out ${user.name}'s links and projects.`,
      images: user.image ? [user.image] : [],
    },
  };
}

export default async function UsernamePage({ params }) {
  const { username } = await params;
  const user = await findUser("username", username);
  if (!user) notFound();

  const now = Math.floor(Date.now() / 1000);
  const allLinks = await getCustomLinks(user.id);
  
  // Filter: enabled + schedule enforcement
  const activeLinks = allLinks.filter((link) => {
    if (!link.enabled) return false;
    if (!link.scheduled) return true;
    if (link.start_at && now < link.start_at) return false;
    if (link.end_at && now > link.end_at) return false;
    return true;
  });

  const appearance = await getAppearance(user.id);
  const githubCache = await getGithubCache(user.id);

  // Serialize database objects to plain objects for Client Components
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainLinks = JSON.parse(JSON.stringify(activeLinks));
  const plainAppearance = JSON.parse(JSON.stringify(appearance));
  const plainGithubCache = JSON.parse(JSON.stringify(githubCache));

  return (
    <PublicProfile
      user={plainUser}
      customLinks={plainLinks}
      appearance={plainAppearance}
      githubCache={plainGithubCache}
    />
  );
}
