import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { hasPrivateAccess } from "@/lib/auth";
import { getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { renderMarkdown } from "@/lib/markdown";

function buildArticleHref(slug: string): string {
  return `/articles?slug=${slug}`;
}

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: { slug?: string | string[] };
}): Promise<JSX.Element> {
  const selectedSlug = typeof searchParams.slug === "string" ? searchParams.slug : undefined;

  const articles = await getAllArticles();
  const unlocked = hasPrivateAccess();
  const visibleArticles = articles.filter((a) => a.visibility === "public" || unlocked);
  const activeEntry = visibleArticles.find((entry) => entry.slug === selectedSlug) ?? visibleArticles[0];
  const activeHtml = activeEntry ? await renderMarkdown(activeEntry.body) : "";

  return (
    <section>
      <h1 className="page-title">My Newsletter</h1>

      {visibleArticles.length === 0 || !activeEntry ? (
        <EmptyState title="没有匹配内容" description="稍后再来看看。" />
      ) : (
        <div className="article-timeline-layout">
          <aside className="article-timeline" aria-label="文章时间线">
            <ol className="article-timeline-list">
              {visibleArticles.map((entry) => {
                const isActive = entry.slug === activeEntry.slug;
                const isPrivate = entry.visibility === "private";
                const href = buildArticleHref(entry.slug);
                const itemClass = `article-timeline-item${isActive ? " article-timeline-item-active" : ""}${
                  isPrivate ? " article-timeline-item-locked" : ""
                }`;

                return (
                  <li key={entry.slug}>
                    <Link className={itemClass} href={href}>
                      <span className="article-timeline-title">{entry.title}</span>
                      <span className="article-timeline-meta">{formatDate(entry.date)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>

          <article className="article-reader">
            <header className="article-reader-head">
              <h2 className="article-reader-title">{activeEntry.title}</h2>
              <p className="article-reader-meta">
                {formatDate(activeEntry.date)}
              </p>
            </header>

            <section className="markdown-body article-reader-body" dangerouslySetInnerHTML={{ __html: activeHtml }} />
          </article>
        </div>
      )}
    </section>
  );
}
