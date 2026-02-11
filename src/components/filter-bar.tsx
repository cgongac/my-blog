import { buildFilterHref } from "@/lib/filters";
import { TagChip } from "@/components/tag-chip";

type FilterBarProps = {
  pathname: string;
  categories: string[];
  tags: string[];
  currentCategory?: string;
  currentTag?: string;
  showTags?: boolean;
};

export function FilterBar({ pathname, categories, tags, currentCategory, currentTag, showTags = true }: FilterBarProps): JSX.Element {
  return (
    <div className="filter-block">
      <div className="filter-line">
        <span className="filter-label">分类</span>
        <TagChip
          label="全部"
          href={buildFilterHref(pathname, { category: currentCategory, tag: currentTag }, "category", undefined)}
          active={!currentCategory}
        />
        {categories.map((category) => (
          <TagChip
            key={category}
            label={category}
            href={buildFilterHref(pathname, { category: currentCategory, tag: currentTag }, "category", category)}
            active={currentCategory === category}
          />
        ))}
      </div>

      {showTags && (
        <div className="filter-line">
          <span className="filter-label">标签</span>
          <TagChip
            label="全部"
            href={buildFilterHref(pathname, { category: currentCategory, tag: currentTag }, "tag", undefined)}
            active={!currentTag}
          />
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={`#${tag}`}
              href={buildFilterHref(pathname, { category: currentCategory, tag: currentTag }, "tag", tag)}
              active={currentTag === tag}
            />
          ))}
        </div>
      )}
    </div>
  );
}
