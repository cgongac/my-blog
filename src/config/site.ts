export const siteConfig = {
  siteName: "Giselle Notes",
  siteSubtitle: "记录我的文章、日记与日常碎片",
  timezone: "Asia/Shanghai",
  themeDefault: "light" as const,
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/"
    }
  ]
};

export type SiteConfig = typeof siteConfig;
