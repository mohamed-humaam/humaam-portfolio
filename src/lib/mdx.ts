import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

export async function compileMDX(source: string) {
  const code = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
  });

  const { default: Content } = await run(String(code), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return Content;
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string; slug: string }[] = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    
    headings.push({ level, text, slug });
  }
  
  return headings;
}

export function stripMarkdown(content: string): string {
  return content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/>\s+/g, "")
    .replace(/[-*+]\s+/g, "")
    .replace(/\d+\.\s+/g, "")
    .trim();
}
