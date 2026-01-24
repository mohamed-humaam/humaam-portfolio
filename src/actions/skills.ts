"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { skillSchema, type SkillInput } from "@/lib/validations";

export async function getSkills() {
  return db.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getSkill(id: string) {
  return db.skill.findUnique({ where: { id } });
}

export async function createSkill(data: SkillInput) {
  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const skill = await db.skill.create({
    data: {
      ...validated.data,
      icon: validated.data.icon || null,
    },
  });

  revalidatePath("/admin/skills");
  revalidatePath("/about");
  return { success: true, data: skill };
}

export async function updateSkill(id: string, data: SkillInput) {
  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const skill = await db.skill.update({
    where: { id },
    data: {
      ...validated.data,
      icon: validated.data.icon || null,
    },
  });

  revalidatePath("/admin/skills");
  revalidatePath("/about");
  return { success: true, data: skill };
}

export async function deleteSkill(id: string) {
  await db.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/about");
  return { success: true };
}
