export const dynamic = "force-dynamic";

import { ContentCard } from "@/components/content-card";
import { EmptyState } from "@/components/empty-state";
import { hasPrivateAccess } from "@/lib/auth";
import { getAllDiaryEntries } from "@/lib/content";

export default async function DiaryPage(): Promise<JSX.Element> {
  const entries = await getAllDiaryEntries();
  const unlocked = hasPrivateAccess();
  const visibleEntries = entries.filter((e) => e.visibility === "public" || unlocked);

  return (
    <section>
      <h1 className="page-title">My Diary</h1>

      {visibleEntries.length === 0 ? (
        <EmptyState title="没有匹配内容" description="稍后再来看看。" />
      ) : (
        <div className="content-list">
          {visibleEntries.map((entry) => {
            const href = `/diary/${entry.slug}`;

            return (
              <ContentCard
                key={entry.slug}
                title={entry.title}
                date={entry.date}
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
