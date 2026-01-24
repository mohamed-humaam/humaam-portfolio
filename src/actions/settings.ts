"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";

export async function getSettings() {
  return db.siteSettings.findUnique({ where: { id: "main" } });
}

export async function updateSettings(data: SiteSettingsInput) {
  const validated = siteSettingsSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const settings = await db.siteSettings.upsert({
    where: { id: "main" },
    update: {
      ...validated.data,
      phone: validated.data.phone || null,
      location: validated.data.location || null,
      bio: validated.data.bio || null,
      aboutContent: validated.data.aboutContent || null,
      github: validated.data.github || null,
      linkedin: validated.data.linkedin || null,
      twitter: validated.data.twitter || null,
      instagram: validated.data.instagram || null,
      whatsapp: validated.data.whatsapp || null,
      telegram: validated.data.telegram || null,
      calendly: validated.data.calendly || null,
      seoTitle: validated.data.seoTitle || null,
      seoDesc: validated.data.seoDesc || null,
      ogImage: validated.data.ogImage || null,
    },
    create: {
      id: "main",
      ...validated.data,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { success: true, data: settings };
}
