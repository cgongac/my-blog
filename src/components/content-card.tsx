import Link from "next/link";

import { formatDate } from "@/lib/date";

type ContentCardProps = {
  title: string;
  summary?: string;
  date: string;
  href: string;
  isLocked?: boolean;
};

export function ContentCard({ title, summary, date, href, isLocked = false }: ContentCardProps): JSX.Element {
  return (
    <article className={`content-card ${isLocked ? "content-locked" : ""}`}>
      <div className="content-card-top">
        <div className="content-meta">
          <span>{formatDate(date)}</span>
        </div>
        <h2 className="content-title">
          <Link href={href}>{title}</Link>
        </h2>
      </div>
      {summary && (
        <p className={isLocked ? "content-summary content-summary-locked" : "content-summary"}>
          {isLocked ? "该条目已设为私密，解锁后可查看完整内容。" : summary}
        </p>
      )}

    </article>
  );
}
