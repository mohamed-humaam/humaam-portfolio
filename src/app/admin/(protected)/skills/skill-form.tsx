"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { skillSchema, type SkillInput } from "@/lib/validations";
import { createSkill, updateSkill } from "@/actions/skills";
import type { Skill } from "@prisma/client";

interface SkillFormProps {
  skill?: Skill;
}

const categories = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools"];

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!skill;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || "",
      category: skill?.category || "Frontend",
      level: skill?.level || 80,
      icon: skill?.icon || "",
      sortOrder: skill?.sortOrder || 0,
    },
  });

  async function onSubmit(data: SkillInput) {
    try {
      const result = isEditing
        ? await updateSkill(skill.id, data)
        : await createSkill(data);

      if (result.success) {
        toast({ title: isEditing ? "Updated" : "Created", description: "Skill saved successfully." });
        router.push("/admin/skills");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Skill Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" placeholder="React" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              className="w-full h-10 rounded-lg border border-input bg-background px-3"
              defaultValue={skill?.category || "Frontend"}
              onChange={(e) => setValue("category", e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Proficiency Level (0-100)</Label>
            <Input id="level" type="number" min="0" max="100" {...register("level", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : isEditing ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
