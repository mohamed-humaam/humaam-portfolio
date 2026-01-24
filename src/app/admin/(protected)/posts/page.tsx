import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { DeletePostButton } from "./delete-button";

async function getPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Button asChild>
              <Link href="/admin/posts/new">Write your first post</Link>
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
                <th className="text-left p-4 font-medium hidden lg:table-cell">Tags</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <span className="font-medium">{post.title}</span>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant={post.status === "published" ? "success" : "warning"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDateShort(post.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/posts/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeletePostButton id={post.id} name={post.title} />
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
