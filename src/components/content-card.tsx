import Link from "next/link";

import { formatDate } from "@/lib/date";
import { TagChip } from "@/components/tag-chip";

type ContentCardProps = {
  title: string;
  summary?: string;
  date: string;
  tags?: string[];
  category: string;
  href: string;
  isLocked?: boolean;
};

export function ContentCard({ title, summary, date, tags, category, href, isLocked = false }: ContentCardProps): JSX.Element {
  return (
    <article className={`content-card ${isLocked ? "content-locked" : ""}`}>
      <div className="content-card-top">
        <div className="content-meta">
          <span>{formatDate(date)}</span>
          <span className="dot">•</span>
          <span>{category}</span>
          {/* Lock icon removed, using gray text style instead */}
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
      {tags && tags.length > 0 && (
        <div className="tag-row">
          {tags.map((tag) => (
            <TagChip key={tag} label={`#${tag}`} />
          ))}
        </div>
      )}
    </article>
  );
}
