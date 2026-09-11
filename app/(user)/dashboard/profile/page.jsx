import { currentUser } from "@clerk/nextjs/server";
import { findUser } from "@/models/user";
import ProfileForm from "./_components/ProfileForm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  const dbUser = email ? await findUser("email", email) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your public profile information.
          </p>
        </div>
        {dbUser?.username && (
          <Link
            href={`/${dbUser.username}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </Link>
        )}
      </div>

      {/* Avatar from Clerk */}
      <div className="rounded-xl border bg-background p-5">
        <p className="text-sm font-medium mb-3">Profile Picture</p>
        <div className="flex items-center gap-4">
          <img
            src={clerkUser?.imageUrl}
            alt={clerkUser?.firstName || "Avatar"}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <p className="text-sm text-muted-foreground">
              Your avatar is synced from your account.
            </p>
            <Link
              href="/user-profile"
              className="text-sm text-primary hover:underline"
            >
              Change avatar →
            </Link>
          </div>
        </div>
      </div>

      <ProfileForm
        initialData={dbUser ? JSON.parse(JSON.stringify(dbUser)) : null}
        clerkImage={clerkUser?.imageUrl}
        clerkEmail={email}
      />
    </div>
  );
}
