import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
        <h2 className="text-2xl font-display font-bold">New Blog Post</h2>
        <p className="text-muted-foreground">Create a new blog post</p>
      </div>
      <PostForm />
    </div>
  );
}
