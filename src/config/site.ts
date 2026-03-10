export const siteConfig = {
  siteName: "Giselle Notes",
  siteSubtitle: "记录我的文章与日记",
  timezone: "Asia/Shanghai",
  themeDefault: "light" as const,
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/"
    },
    {
      label: "Twitter",
      href: "https://x.com/cozyease_7811"
    }
  ]
};

export type SiteConfig = typeof siteConfig;
