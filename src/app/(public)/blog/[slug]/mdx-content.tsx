"use client";

import { useMemo } from "react";

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  const renderedContent = useMemo(() => {
    let html = content;

    // Images - MUST be processed FIRST before links
    html = html.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<figure class="my-6"><img src="$2" alt="$1" class="rounded-lg w-full max-w-full h-auto" loading="lazy" /><figcaption class="text-sm text-muted-foreground text-center mt-2">$1</figcaption></figure>'
    );

    // Code blocks
    html = html.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (_, lang, code) =>
            `<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm font-mono">${escapeHtml(
                code.trim()
            )}</code></pre>`
    );

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Unordered lists
    html = html.replace(
        /^- (.+)$/gm,
        '<li class="flex items-start gap-2 my-1"><span class="text-primary mt-1.5">•</span><span>$1</span></li>'
    );
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>');

    // Paragraphs
    html = html.replace(
        /^(?!<[a-z]|```|\s*$)(.+)$/gm,
        '<p class="my-4 text-muted-foreground leading-relaxed">$1</p>'
    );

    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*>\s*<\/p>/g, "");

    return html;
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}