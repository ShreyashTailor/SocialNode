import { currentUser } from "@clerk/nextjs/server";
import { findUser, getCustomLinks } from "@/models/user";
import LinksManager from "./_components/LinksManager";

export const metadata = { title: "Links" };

export default async function LinksPage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const dbUser = email ? await findUser("email", email) : null;

  if (!dbUser) {
    return (
      <div className="max-w-2xl mx-auto pt-8 text-center">
        <p className="text-muted-foreground">Please complete your profile first.</p>
      </div>
    );
  }

  const links = await getCustomLinks(dbUser.id);

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Links</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add custom links to your public profile. Drag to reorder.
        </p>
      </div>
      <LinksManager initialLinks={links} userId={dbUser.id} />
    </div>
  );
}
