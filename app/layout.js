import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: {
    default: "SocialNode | Your Digital Identity",
    template: "%s | SocialNode",
  },
  description:
    "One link to bring all your social profiles, projects, and portfolio into one beautiful, shareable page.",
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "SocialNode | Your Digital Identity",
    description:
      "One link to bring all your social profiles, projects, and portfolio into one beautiful, shareable page.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <body className="font-sans antialiased">
          <NextTopLoader
            color="hsl(229 100% 62%)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            zIndex={1600}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
