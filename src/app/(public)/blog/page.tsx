import { Metadata } from "next";
import { db } from "@/lib/db";
import { BlogList } from "./blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on development, architecture, and building great software.",
};

async function getPosts() {
  return db.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

async function getAllTags() {
  const posts = await db.post.findMany({
    where: { status: "published" },
    select: { tags: true },
  });

  const tagCounts = new Map<string, number>();
  posts.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

export default async function BlogPage() {
  const [posts, allTags] = await Promise.all([getPosts(), getAllTags()]);

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            The <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on development, architecture, and building great software.
          </p>
        </div>

        <BlogList posts={posts} allTags={allTags} />
      </div>
    </div>
  );
}
