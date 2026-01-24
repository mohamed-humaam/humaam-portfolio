import { db } from "@/lib/db";
import { Hero } from "@/components/home/hero";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ServicesSection } from "@/components/home/services-section";
import { TechStack } from "@/components/home/tech-stack";
import { BlogPreview } from "@/components/home/blog-preview";
import { CTASection } from "@/components/home/cta-section";

async function getHomeData() {
  const [settings, projects, services, skills, posts] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "main" } }),
    db.project.findMany({
      where: { featured: true, status: "published" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    db.service.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    db.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
    db.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return { settings, projects, services, skills, posts };
}

export default async function HomePage() {
  const { settings, projects, services, skills, posts } = await getHomeData();

  return (
    <>
      <Hero settings={settings} />
      <FeaturedProjects projects={projects} />
      <ServicesSection services={services} />
      <TechStack skills={skills} />
      <BlogPreview posts={posts} />
      <CTASection calendlyUrl={settings?.calendly} />
    </>
  );
}
