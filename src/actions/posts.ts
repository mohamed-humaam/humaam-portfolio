"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { postSchema, type PostInput } from "@/lib/validations";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function getPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPost(id: string) {
  return db.post.findUnique({ where: { id } });
}

export async function createPost(data: PostInput) {
  const validated = postSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, publishedAt, ...rest } = validated.data;
  const finalSlug = slug || slugify(rest.title);

  const existing = await db.post.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return { success: false, error: "A post with this slug already exists" };
  }

  const post = await db.post.create({
    data: {
      ...rest,
      slug: finalSlug,
      readingTime: calculateReadingTime(rest.content),
      coverImage: rest.coverImage || null,
      publishedAt: rest.status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { success: true, data: post };
}

export async function updatePost(id: string, data: PostInput) {
  const validated = postSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid data" };
  }

  const { slug, publishedAt, ...rest } = validated.data;
  const existing = await db.post.findFirst({
    where: { slug, id: { not: id } },
  });
  if (existing) {
    return { success: false, error: "A post with this slug already exists" };
  }

  const currentPost = await db.post.findUnique({ where: { id } });

  const post = await db.post.update({
    where: { id },
    data: {
      ...rest,
      slug,
      readingTime: calculateReadingTime(rest.content),
      coverImage: rest.coverImage || null,
      publishedAt:
        rest.status === "published" && !currentPost?.publishedAt
          ? new Date()
          : currentPost?.publishedAt,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true, data: post };
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { success: true };
}
