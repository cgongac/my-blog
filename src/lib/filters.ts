export function buildFilterHref(
  pathname: string,
  current: { category?: string; tag?: string },
  key: "category" | "tag",
  value?: string
): string {
  const params = new URLSearchParams();

  const nextCategory = key === "category" ? value : current.category;
  const nextTag = key === "tag" ? value : current.tag;

  if (nextCategory) {
    params.set("category", nextCategory);
  }

  if (nextTag) {
    params.set("tag", nextTag);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
