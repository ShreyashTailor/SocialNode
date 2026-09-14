import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getCurrentUserContext } from "@/lib/security";

export default async function DashboardHeader() {
  const { dbUser: profileUser } = await getCurrentUserContext();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          {profileUser?.username && (
            <Link
              href={`/${profileUser.username}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View profile
            </Link>
          )}
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
