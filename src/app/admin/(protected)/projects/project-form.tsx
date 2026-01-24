"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { createProject, updateProject } from "@/actions/projects";
import { slugify } from "@/lib/utils";
import type { Project } from "@prisma/client";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const [stackInput, setStackInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      summary: project?.summary || "",
      description: project?.description || "",
      stack: project?.stack || [],
      images: project?.images || [],
      liveUrl: project?.liveUrl || "",
      repoUrl: project?.repoUrl || "",
      featured: project?.featured || false,
      sortOrder: project?.sortOrder || 0,
      status: (project?.status as "draft" | "published") || "published",
    },
  });

  const watchedTitle = watch("title");
  const watchedStack = watch("stack");

  function generateSlug() {
    if (watchedTitle) {
      setValue("slug", slugify(watchedTitle));
    }
  }

  function addStackItem() {
    if (stackInput.trim() && !watchedStack.includes(stackInput.trim())) {
      setValue("stack", [...watchedStack, stackInput.trim()]);
      setStackInput("");
    }
  }

  function removeStackItem(item: string) {
    setValue(
      "stack",
      watchedStack.filter((s) => s !== item)
    );
  }

  async function onSubmit(data: ProjectInput) {
    try {
      const result = isEditing
        ? await updateProject(project.id, data)
        : await createProject(data);

      if (result.success) {
        toast({
          title: isEditing ? "Updated" : "Created",
          description: `Project ${isEditing ? "updated" : "created"} successfully.`,
        });
        router.push("/admin/projects");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Project"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="my-awesome-project"
                    {...register("slug")}
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  placeholder="A brief description of the project..."
                  rows={2}
                  {...register("summary")}
                />
                {errors.summary && (
                  <p className="text-sm text-destructive">{errors.summary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description * (Markdown supported)</Label>
                <Textarea
                  id="description"
                  placeholder="Full project description with markdown..."
                  rows={12}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology (e.g., React, Laravel)"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addStackItem();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addStackItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {watchedStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedStack.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeStackItem(item)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                value={watch("images")}
                onChange={(urls) => setValue("images", urls)}
                label="Screenshots & Images"
                max={6}
              />
              <p className="text-xs text-muted-foreground mt-2">
                First image will be used as the cover. Drag to reorder.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  placeholder="https://example.com"
                  {...register("liveUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input
                  id="repoUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...register("repoUrl")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={project?.status || "published"}
                  onValueChange={(value) =>
                    setValue("status", value as "draft" | "published")
                  }
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

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  defaultChecked={project?.featured || false}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
