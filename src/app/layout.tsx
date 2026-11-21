import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import { site } from "@/content/site";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BackgroundField } from "@/components/BackgroundField";
import { Cursor } from "@/components/Cursor";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Only used for the Urdu lines in the Dr. Sara tile
const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#060708",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${urdu.variable}`}>
      <body>
        <BackgroundField />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Cursor />
      </body>
    </html>
  );
}
