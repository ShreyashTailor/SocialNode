import { currentUser } from "@clerk/nextjs/server";
import { findUser, getAppearance } from "@/models/user";
import AppearanceForm from "./_components/AppearanceForm";

export const metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const dbUser = email ? await findUser("email", email) : null;
  const appearance = dbUser ? await getAppearance(dbUser.id) : null;

  if (!dbUser) {
    return (
      <div className="max-w-2xl mx-auto pt-8 text-center">
        <p className="text-muted-foreground">Please complete your profile first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Appearance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose a theme or customize every detail of your public profile.
        </p>
      </div>
      <AppearanceForm initialData={appearance ? JSON.parse(JSON.stringify(appearance)) : null} username={dbUser.username} />
    </div>
  );
}
