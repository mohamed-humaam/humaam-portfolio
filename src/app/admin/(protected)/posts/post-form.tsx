"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Plus, Eye, Edit3 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/admin/image-upload";
import { postSchema, type PostInput } from "@/lib/validations";
import { createPost, updatePost } from "@/actions/posts";
import { slugify } from "@/lib/utils";
import type { Post } from "@prisma/client";

// Simple Markdown preview renderer
function MarkdownPreview({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    let html = text;

    // Images - render them properly
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<div class="my-4"><img src="$2" alt="$1" class="rounded-lg max-w-full h-auto" /><p class="text-sm text-muted-foreground mt-1 text-center">$1</p></div>'
    );

    // Code blocks
    html = html.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm">$2</code></pre>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
    );

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>'
    );

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');

    // Paragraphs
    html = html.replace(/^(?!<[a-z]|```|\s*$)(.+)$/gm, '<p class="my-3 text-muted-foreground">$1</p>');

    return html;
  };

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 border rounded-lg bg-card"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '*Start writing to see preview...*') }}
    />
  );
}

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      coverImage: post?.coverImage || "",
      tags: post?.tags || [],
      status: (post?.status as "draft" | "published") || "draft",
    },
  });

  const watchedTitle = watch("title");
  const watchedTags = watch("tags");

  function generateSlug() {
    if (watchedTitle) {
      setValue("slug", slugify(watchedTitle));
    }
  }

  function addTag() {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setValue("tags", watchedTags.filter((t) => t !== tag));
  }

  async function onSubmit(data: PostInput) {
    try {
      const result = isEditing
        ? await updatePost(post.id, data)
        : await createPost(data);

      if (result.success) {
        toast({
          title: isEditing ? "Updated" : "Created",
          description: `Post ${isEditing ? "updated" : "created"} successfully.`,
        });
        router.push("/admin/posts");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="My Blog Post Title" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input id="slug" placeholder="my-blog-post-title" {...register("slug")} />
                  <Button type="button" variant="outline" onClick={generateSlug}>Generate</Button>
                </div>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea id="excerpt" placeholder="A brief summary..." rows={2} {...register("excerpt")} />
                {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Content * (Markdown supported)</Label>
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-2">
                    <TabsTrigger value="write" className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-0">
                    <Textarea 
                      id="content" 
                      placeholder="Write your post content in Markdown...

## Heading

Some paragraph text here.

![Image alt text](https://i.imgur.com/example.jpg)

- List item 1
- List item 2

**Bold text** and *italic text*

`inline code`" 
                      rows={20} 
                      {...register("content")} 
                      className="font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="mt-0">
                    <MarkdownPreview content={watch("content")} />
                  </TabsContent>
                </Tabs>
                {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (e.g., React, Tutorial)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={post?.status || "draft"}
                  onValueChange={(value) => setValue("status", value as "draft" | "published")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={watch("coverImage") || ""}
                  onChange={(url) => setValue("coverImage", url)}
                  label="Cover Image"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : isEditing ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
