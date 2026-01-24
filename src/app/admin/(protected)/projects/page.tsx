import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { DeleteButton } from "./delete-button";

async function getProjects() {
  return db.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button asChild>
              <Link href="/admin/projects/new">Create your first project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Status</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Stack</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.title}</span>
                      {project.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.summary}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant={project.status === "published" ? "success" : "warning"}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                      {project.stack.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{project.stack.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDateShort(project.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton id={project.id} name={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
