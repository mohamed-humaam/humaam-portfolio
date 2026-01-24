"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function getServices() {
  return db.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getService(id: string) {
  return db.service.findUnique({ where: { id } });
}

export async function createService(data: ServiceInput) {
  const validated = serviceSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, ...rest } = validated.data;
  const finalSlug = slug || slugify(rest.title);

  const existing = await db.service.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return { success: false, error: "A service with this slug already exists" };
  }

  const service = await db.service.create({
    data: {
      ...rest,
      slug: finalSlug,
      icon: rest.icon || null,
      pricingNote: rest.pricingNote || null,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true, data: service };
}

export async function updateService(id: string, data: ServiceInput) {
  const validated = serviceSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, ...rest } = validated.data;
  const existing = await db.service.findFirst({
    where: { slug, id: { not: id } },
  });
  if (existing) {
    return { success: false, error: "A service with this slug already exists" };
  }

  const service = await db.service.update({
    where: { id },
    data: {
      ...rest,
      slug,
      icon: rest.icon || null,
      pricingNote: rest.pricingNote || null,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  return { success: true, data: service };
}

export async function deleteService(id: string) {
  await db.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}
