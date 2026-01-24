"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function getProjects() {
  return db.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProject(id: string) {
  return db.project.findUnique({ where: { id } });
}

export async function createProject(data: ProjectInput) {
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, ...rest } = validated.data;
  const finalSlug = slug || slugify(rest.title);

  // Check for existing slug
  const existing = await db.project.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return { success: false, error: "A project with this slug already exists" };
  }

  const project = await db.project.create({
    data: {
      ...rest,
      slug: finalSlug,
      liveUrl: rest.liveUrl || null,
      repoUrl: rest.repoUrl || null,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true, data: project };
}

export async function updateProject(id: string, data: ProjectInput) {
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, ...rest } = validated.data;

  // Check for existing slug (excluding current project)
  const existing = await db.project.findFirst({
    where: { slug, id: { not: id } },
  });
  if (existing) {
    return { success: false, error: "A project with this slug already exists" };
  }

  const project = await db.project.update({
    where: { id },
    data: {
      ...rest,
      slug,
      liveUrl: rest.liveUrl || null,
      repoUrl: rest.repoUrl || null,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  return { success: true, data: project };
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}
