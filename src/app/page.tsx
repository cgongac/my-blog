import { siteConfig } from "@/config/site";
import { getAllArticles, getAllDiaryEntries } from "@/lib/content";
import { EditorialFeed, type FeedItem } from "@/components/editorial-feed"; // Import new component

export default async function HomePage(): Promise<JSX.Element> {
  const [articles, diary] = await Promise.all([
    getAllArticles(),
    getAllDiaryEntries(),
  ]);

  const feed: FeedItem[] = [
    ...articles
      .filter((e) => e.visibility === "public")
      .map((e) => ({
        title: e.title,
        date: e.date,
        href: `/articles?slug=${e.slug}`,
        sectionLabel: "Article",
        key: `a-${e.slug}`,
      })),
    ...diary
      .filter((e) => e.visibility === "public")
      .map((e) => ({
        title: e.title,
        date: e.date,
        href: `/diary/${e.slug}`,
        sectionLabel: "Diary",
        key: `d-${e.slug}`,
      })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="editorial-layout">
      <aside className="editorial-intro">
        <h1 className="editorial-name">{siteConfig.siteName}</h1>
        <p className="editorial-desc">
          一个关于写作、思考与日常观察的个人空间。记录阶段性的复盘反思，沉淀结构化的方法与观点，捕捉转瞬即逝的灵感碎片。
        </p>
        <p className="editorial-subdesc">
          Here, you will find reflections on writing, habit-building, and the quiet observations of everyday life.
        </p>
      </aside>

      {/* Use the client component for the feed */}
      <EditorialFeed items={feed} />
    </div>
  );
}
