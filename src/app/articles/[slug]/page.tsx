import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/date";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "文章不存在"
    };
  }

  return {
    title: article.title,
    description: article.summary
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const html = await renderMarkdown(article.body);

  return (
    <article className="detail-shell">
      <h1 className="page-title">{article.title}</h1>
      <p className="page-subtitle">
        {formatDate(article.date)} · {article.category}
      </p>
      <section className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
