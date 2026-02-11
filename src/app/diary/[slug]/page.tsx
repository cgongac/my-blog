export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";

import { buildUnlockUrl, hasPrivateAccess } from "@/lib/auth";
import { formatDate } from "@/lib/date";
import { getDiaryBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export default async function DiaryDetailPage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  const entry = await getDiaryBySlug(params.slug);

  if (!entry) {
    notFound();
  }

  if (entry.visibility === "private" && !hasPrivateAccess()) {
    redirect(buildUnlockUrl(`/diary/${entry.slug}`));
  }

  const html = await renderMarkdown(entry.body);

  return (
    <article className="detail-shell">
      <h1 className="page-title">{entry.title}</h1>
      <p className="page-subtitle">
        {formatDate(entry.date)} · {entry.category}
      </p>
      <section className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
