export const dynamic = "force-dynamic";

import { ContentCard } from "@/components/content-card";
import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { hasPrivateAccess } from "@/lib/auth";
import { collectCategories, collectTags, filterEntries, getAllDiaryEntries } from "@/lib/content";

function pickSingle(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function DiaryPage({
  searchParams
}: {
  searchParams: { category?: string | string[]; tag?: string | string[] };
}): Promise<JSX.Element> {
  const selectedCategory = pickSingle(searchParams.category);
  const selectedTag = pickSingle(searchParams.tag);

  const entries = await getAllDiaryEntries();
  const unlocked = hasPrivateAccess();
  
  const visibleEntries = entries.filter((e) => e.visibility === "public" || unlocked);
  
  const filtered = filterEntries(visibleEntries, { category: selectedCategory, tag: selectedTag });
  const categories = collectCategories(visibleEntries);
  const tags = collectTags(visibleEntries);

  return (
    <section>
      <h1 className="page-title">我的日记</h1>
      <p className="page-subtitle">阶段性记录。私密条目需要先解锁。</p>

      <FilterBar
        pathname="/diary"
        categories={categories}
        tags={tags}
        currentCategory={selectedCategory}
        currentTag={selectedTag}
        showTags={false}
      />

      {filtered.length === 0 ? (
        <EmptyState title="没有匹配内容" description="当前筛选条件下暂无日记条目。" />
      ) : (
        <div className="content-list">
          {filtered.map((entry) => {
            const href = `/diary/${entry.slug}`;

            return (
              <ContentCard
                key={entry.slug}
                title={entry.title}
                date={entry.date}
                category={entry.category}
                href={href}
                isLocked={false}
                // summary and tags omitted for cleaner view
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
