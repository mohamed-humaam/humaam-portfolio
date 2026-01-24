import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { SkillForm } from "../skill-form";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

async function getSkill(id: string) {
  return db.skill.findUnique({ where: { id } });
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const skill = await getSkill(id);
  if (!skill) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/skills" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </Link>
        <h2 className="text-2xl font-display font-bold">Edit Skill</h2>
        <p className="text-muted-foreground">Update skill details</p>
      </div>
      <SkillForm skill={skill} />
    </div>
  );
}
