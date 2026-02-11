import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { collectCategories, collectTags, filterEntries, getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { renderMarkdown } from "@/lib/markdown";

function pickSingle(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function buildArticleHref({
  slug,
  category,
  tag
}: {
  slug: string;
  category?: string;
  tag?: string;
}): string {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  params.set("slug", slug);
  return `/articles?${params.toString()}`;
}

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: { category?: string | string[]; tag?: string | string[]; slug?: string | string[] };
}): Promise<JSX.Element> {
  const selectedCategory = pickSingle(searchParams.category);
  const selectedTag = pickSingle(searchParams.tag);
  const selectedSlug = pickSingle(searchParams.slug);

  const articles = await getAllArticles();
  const filtered = filterEntries(articles, { category: selectedCategory, tag: selectedTag });
  const categories = collectCategories(articles);
  const tags = collectTags(articles);
  const activeEntry = filtered.find((entry) => entry.slug === selectedSlug) ?? filtered[0];
  const activeHtml = activeEntry ? await renderMarkdown(activeEntry.body) : "";

  return (
    <section>
      <h1 className="page-title">我的文章</h1>
      <p className="page-subtitle">长文内容，支持按分类和标签筛选。</p>

      <FilterBar
        pathname="/articles"
        categories={categories}
        tags={tags}
        currentCategory={selectedCategory}
        currentTag={selectedTag}
        showTags={false}
      />

      {filtered.length === 0 || !activeEntry ? (
        <EmptyState title="没有匹配内容" description="试试清空筛选条件，或者稍后再来看看。" />
      ) : (
        <div className="article-timeline-layout">
          <aside className="article-timeline" aria-label="文章时间线">
            <ol className="article-timeline-list">
              {filtered.map((entry) => {
                const isActive = entry.slug === activeEntry.slug;
                const isPrivate = entry.visibility === "private";
                const href = buildArticleHref({ slug: entry.slug, category: selectedCategory, tag: selectedTag });
                const itemClass = `article-timeline-item${isActive ? " article-timeline-item-active" : ""}${
                  isPrivate ? " article-timeline-item-locked" : ""
                }`;

                return (
                  <li key={entry.slug}>
                    <Link className={itemClass} href={href}>
                      <span className="article-timeline-title">{entry.title}</span>
                      <span className="article-timeline-meta">{formatDate(entry.date)} · {entry.category}</span>
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
                {formatDate(activeEntry.date)} · {activeEntry.category}
              </p>
            </header>

            <section className="markdown-body article-reader-body" dangerouslySetInnerHTML={{ __html: activeHtml }} />
          </article>
        </div>
      )}
    </section>
  );
}
