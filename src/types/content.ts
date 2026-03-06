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
  issueNumber: number;
}

export interface DiaryEntry extends BaseMeta {
  type: "diary";
  body: string;
}


