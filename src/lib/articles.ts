import articlesData from "../../data/articles.json";

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  tags: string[];
  regionTags: string[];
  readingTime: number;
  excerpt: string;
  body: string;
}

const articles: Article[] = articlesData as Article[];

export function getArticles(): Article[] {
  return articles;
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((a) => a.tags.includes(tag));
}

export function getArticlesByRegion(region: string): Article[] {
  return articles.filter((a) => a.regionTags.includes(region));
}
