import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ProjectForm } from "../project-form";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  return db.project.findUnique({ where: { id } });
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <h2 className="text-2xl font-display font-bold">Edit Project</h2>
        <p className="text-muted-foreground">Update project details</p>
      </div>

      <ProjectForm project={project} />
    </div>
  );
}
