import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return db.project.findUnique({
    where: { slug },
  });
}

async function getRelatedProjects(currentSlug: string, stack: string[]) {
  return db.project.findMany({
    where: {
      slug: { not: currentSlug },
      status: "published",
      stack: { hasSome: stack },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.images[0] ? [project.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await db.project.findMany({
    where: { status: "published" },
    select: { slug: true },
  });

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const relatedProjects = await getRelatedProjects(slug, project.stack);
  const descriptionParts = project.description.split("\n\n").filter(Boolean);

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Projects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.featured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(project.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mb-6">
            {project.summary}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild variant="outline">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Source Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Main Image */}
        {project.images[0] && (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-12">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {descriptionParts.map((part, index) => {
                // Headers
                if (part.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {part.replace("## ", "")}
                    </h2>
                  );
                }
                // Code blocks
                if (part.startsWith("```")) {
                  const lines = part.split("\n");
                  const lang = lines[0].replace("```", "");
                  const code = lines.slice(1, -1).join("\n");
                  return (
                    <pre key={index} className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm">{code}</code>
                    </pre>
                  );
                }
                // Lists
                if (part.includes("\n- ")) {
                  const items = part.split("\n").filter((line) => line.startsWith("- "));
                  return (
                    <ul key={index} className="space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item.replace("- ", "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Bold headers inline
                if (part.startsWith("**") && part.includes(":**")) {
                  const headerMatch = part.match(/^\*\*(.+?):\*\*\s*(.*)/);
                  if (headerMatch) {
                    return (
                      <p key={index}>
                        <strong>{headerMatch[1]}:</strong> {headerMatch[2]}
                      </p>
                    );
                  }
                }
                // Regular paragraph
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {part}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {project.images.length > 1 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.images.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={image}
                          alt={`${project.title} screenshot ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Like what you see?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let&apos;s discuss how I can help build something similar for you.
                </p>
                <Button asChild className="w-full">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <h2 className="text-2xl font-display font-bold mb-8">Related Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link key={related.id} href={`/projects/${related.slug}`}>
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-video bg-muted overflow-hidden rounded-t-xl">
                      {related.images[0] ? (
                        <Image
                          src={related.images[0]}
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
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
