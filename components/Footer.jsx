import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SocialNode. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
