import type { MetadataRoute } from "next";

import { getAllArticles, getAllDiaryEntries } from "@/lib/content";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const [articles, diaryEntries] = await Promise.all([getAllArticles(), getAllDiaryEntries()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/articles", "/diary", "/fragments", "/unlock"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7
  }));

  const articleRoutes = articles
    .filter((entry) => entry.visibility === "public")
    .map((entry) => ({
      url: `${baseUrl}/articles/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }));

  const diaryRoutes = diaryEntries
    .filter((entry) => entry.visibility === "public")
    .map((entry) => ({
      url: `${baseUrl}/diary/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }));

  return [...staticRoutes, ...articleRoutes, ...diaryRoutes];
}
