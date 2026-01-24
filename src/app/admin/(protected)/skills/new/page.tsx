import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SkillForm } from "../skill-form";

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/skills" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Skills
        </Link>
        <h2 className="text-2xl font-display font-bold">New Skill</h2>
        <p className="text-muted-foreground">Add a new technical skill</p>
      </div>
      <SkillForm />
    </div>
  );
}
