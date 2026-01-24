import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteSkillButton } from "./delete-button";

async function getSkills() {
  return db.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export default async function SkillsPage() {
  const skills = await getSkills();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Skills</h2>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Button asChild>
          <Link href="/admin/skills/new">
            <Plus className="mr-2 h-4 w-4" />
            New Skill
          </Link>
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <Button asChild>
              <Link href="/admin/skills/new">Add your first skill</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                        <Button asChild variant="ghost" size="icon" className="h-6 w-6">
                          <Link href={`/admin/skills/${skill.id}`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                        <DeleteSkillButton id={skill.id} name={skill.name} />
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
