import Link from "next/link";
import { Button } from "./ui/button";
import { currentUser } from "@clerk/nextjs/server";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import { ArrowRight } from "lucide-react";

export default async function Header() {
  const user = await currentUser();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl flex justify-between items-center py-4 px-6">
        <Logo />
        <div className="flex gap-2 items-center">
          <ModeToggle />
          <Button asChild size="sm">
            <Link href={!user ? "/sign-in" : "/dashboard"} className="gap-1.5">
              {!user ? "Get Started" : "Dashboard"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
