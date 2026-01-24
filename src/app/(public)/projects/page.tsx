import { Metadata } from "next";
import { db } from "@/lib/db";
import { ProjectsGrid } from "./projects-grid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web applications, mobile apps, enterprise systems, and more.",
};

async function getProjects() {
  return db.project.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

async function getAllTags() {
  const projects = await db.project.findMany({
    where: { status: "published" },
    select: { stack: true },
  });
  
  const tagCounts = new Map<string, number>();
  projects.forEach((p) => {
    p.stack.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

export default async function ProjectsPage() {
  const [projects, allTags] = await Promise.all([
    getProjects(),
    getAllTags(),
  ]);

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of work spanning enterprise systems, web applications, mobile apps, and more.
          </p>
        </div>

        <ProjectsGrid projects={projects} allTags={allTags} />
      </div>
    </div>
  );
}
