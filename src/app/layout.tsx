import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";

import { siteConfig } from "@/config/site";
import { SideNav } from "@/components/side-nav";
import { hasPrivateAccess } from "@/lib/auth";

import "@/app/globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const themeInitScript = `
(() => {
  const stored = localStorage.getItem('blog-theme');
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored;
    return;
  }
  document.documentElement.dataset.theme = 'dark';
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`
  },
  description: siteConfig.siteSubtitle
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const isUnlocked = hasPrivateAccess();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${serif.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SideNav isUnlocked={isUnlocked} />
        <main className="layout-shell page-shell">{children}</main>
      </body>
    </html>
  );
}
