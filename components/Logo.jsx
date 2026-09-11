import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="select-none hover:opacity-80 transition-opacity flex items-center gap-3"
    >
      <img src="/assets/logo.png" alt="SocialNode" className="w-10 h-10 rounded-lg" />
      <span className="text-xl font-bold tracking-tight">SocialNode</span>
    </Link>
  );
}