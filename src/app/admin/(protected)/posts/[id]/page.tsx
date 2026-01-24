import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { PostForm } from "../post-form";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  return db.post.findUnique({ where: { id } });
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
        <h2 className="text-2xl font-display font-bold">Edit Post</h2>
        <p className="text-muted-foreground">Update post details</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
