export type Visibility = "public" | "private";

export interface BaseMeta {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category: string;
  summary: string;
  visibility: Visibility;
  draft?: boolean;
  images?: string[]; // Add support for images gallery
}

export interface Article extends BaseMeta {
  type: "article";
  body: string;
}

export interface DiaryEntry extends BaseMeta {
  type: "diary";
  body: string;
}

export interface FragmentEntry extends BaseMeta {
  type: "fragment";
  body: string;
}
