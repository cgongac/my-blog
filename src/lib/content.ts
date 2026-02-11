import path from "path";

import { promises as fs } from "fs";
import matter from "gray-matter";
import { z } from "zod";

import type { Article, BaseMeta, DiaryEntry, FragmentEntry } from "@/types/content";
import { isValidDate } from "@/lib/date";

const contentRoot = path.join(process.cwd(), "content");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().min(1),
  summary: z.string().min(1),
  visibility: z.enum(["public", "private"]),
  draft: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;
type ContentKind = "article" | "diary" | "fragment";
type ContentDirectory = "articles" | "diary" | "fragments";

function assertDate(date: string, filePath: string): void {
  if (!isValidDate(date)) {
    throw new Error(`Invalid date \"${date}\" in ${filePath}`);
  }
}

async function listMarkdownFiles(directory: ContentDirectory): Promise<string[]> {
  const target = path.join(contentRoot, directory);

  let files: string[] = [];
  try {
    files = await fs.readdir(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  return files
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => path.join(target, file));
}

function parseFrontmatter(filePath: string, data: unknown): Frontmatter {
  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${parsed.error.message}`);
  }

  assertDate(parsed.data.date, filePath);
  return parsed.data;
}

function sortByDateDesc<T extends BaseMeta>(entries: T[]): T[] {
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function readEntries(directory: ContentDirectory, kind: ContentKind): Promise<Array<Article | DiaryEntry | FragmentEntry>> {
  const files = await listMarkdownFiles(directory);
  const entries: Array<Article | DiaryEntry | FragmentEntry> = [];

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = matter(source);
    const meta = parseFrontmatter(filePath, parsed.data);

    if (meta.draft) {
      continue;
    }

    if (kind === "article") {
      entries.push({ ...meta, body: parsed.content, type: "article" });
      continue;
    }

    if (kind === "diary") {
      entries.push({ ...meta, body: parsed.content, type: "diary" });
      continue;
    }

    entries.push({ ...meta, body: parsed.content, type: "fragment" });
  }

  return sortByDateDesc(entries);
}

export async function getAllArticles(): Promise<Article[]> {
  return (await readEntries("articles", "article")) as Article[];
}

export async function getAllDiaryEntries(): Promise<DiaryEntry[]> {
  return (await readEntries("diary", "diary")) as DiaryEntry[];
}

export async function getAllFragments(): Promise<FragmentEntry[]> {
  return (await readEntries("fragments", "fragment")) as FragmentEntry[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const list = await getAllArticles();
  return list.find((item) => item.slug === slug) ?? null;
}

export async function getDiaryBySlug(slug: string): Promise<DiaryEntry | null> {
  const list = await getAllDiaryEntries();
  return list.find((item) => item.slug === slug) ?? null;
}

export function filterEntries<T extends BaseMeta>(entries: T[], options: { category?: string; tag?: string }): T[] {
  const { category, tag } = options;

  return entries.filter((entry) => {
    const matchCategory = category ? entry.category === category : true;
    const matchTag = tag ? entry.tags.includes(tag) : true;

    return matchCategory && matchTag;
  });
}

export function collectCategories<T extends BaseMeta>(entries: T[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.category))).sort();
}

export function collectTags<T extends BaseMeta>(entries: T[]): string[] {
  return Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort();
}

export function latestDate<T extends BaseMeta>(entries: T[]): string | null {
  if (entries.length === 0) {
    return null;
  }

  return sortByDateDesc(entries)[0].date;
}
