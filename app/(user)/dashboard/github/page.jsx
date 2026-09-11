import { currentUser } from "@clerk/nextjs/server";
import { findUser, getGithubCache } from "@/models/user";
import GitHubForm from "./_components/GitHubForm";

export const metadata = { title: "GitHub Integration" };

export default async function GitHubPage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const dbUser = email ? await findUser("email", email) : null;
  const githubCache = dbUser ? await getGithubCache(dbUser.id) : null;

  if (!dbUser) {
    return (
      <div className="max-w-2xl mx-auto pt-8 text-center">
        <p className="text-muted-foreground">Please complete your profile first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold">GitHub Integration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Show your GitHub repositories on your public profile.
        </p>
      </div>
      <GitHubForm userId={dbUser.id} initialCache={githubCache ? JSON.parse(JSON.stringify(githubCache)) : null} />
    </div>
  );
}
