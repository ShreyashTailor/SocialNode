import {
  Baloo_2,
  Bebas_Neue,
  Caveat,
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  Lora,
  Nunito,
  Outfit,
  Playfair_Display,
  Poppins,
  Space_Grotesk,
} from "next/font/google";
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

// Faces selectable from Appearance -> Custom Overrides. They are only used by
// public profile themes, so preloading is off: the browser downloads a face
// only when a page actually renders it.
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", preload: false });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins-loaded", preload: false });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito-loaded", preload: false });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit-loaded", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk-loaded", preload: false });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas-loaded", preload: false });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat-loaded", preload: false });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora-loaded", preload: false });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-serif-loaded", preload: false });

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
      <html
        lang="en"
        className={[
          geist.variable,
          geistMono.variable,
          baloo.variable,
          playfair.variable,
          poppins.variable,
          nunito.variable,
          outfit.variable,
          spaceGrotesk.variable,
          bebasNeue.variable,
          caveat.variable,
          lora.variable,
          dmSerif.variable,
        ].join(" ")}
        suppressHydrationWarning
      >
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
