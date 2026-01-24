import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, absoluteUrl } from "@/lib/utils";
import { MDXContent } from "./mdx-content";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  return db.post.findUnique({
    where: { slug, status: "published" },
  });
}

async function getRelatedPosts(currentSlug: string, tags: string[]) {
  return db.post.findMany({
    where: {
      slug: { not: currentSlug },
      status: "published",
      tags: { hasSome: tags },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { status: "published" },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.tags);
  const postUrl = absoluteUrl(`/blog/${post.slug}`);

  return (
    <article className="py-20 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Posts
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <MDXContent content={post.content} />
        </div>

        {/* Share */}
        <div className="flex items-center gap-4 py-8 border-t border-b border-border">
          <span className="text-sm font-medium flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share this article
          </span>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  postUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-video bg-muted overflow-hidden rounded-t-xl">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <span className="text-3xl font-display font-bold text-primary/30">
                            {related.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
