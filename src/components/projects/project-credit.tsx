import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

type CreditFields = Pick<Project, "company" | "companyUrl" | "companyRelation">;

export function creditLabel(relation: string | null) {
  return relation === "client" ? "Built for" : "A product of";
}

/**
 * "A product of Backslash Lab" / "Built for Elfin Cosmetics", linking to the
 * company's site. The link is a normal (followed) link so it counts as a backlink.
 */
export function ProjectCredit({
  project,
  className,
}: {
  project: CreditFields;
  className?: string;
}) {
  if (!project.company) return null;

  const name = project.companyUrl ? (
    <a
      href={project.companyUrl}
      target="_blank"
      rel="noopener"
      className="relative z-10 font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
    >
      {project.company}
    </a>
  ) : (
    <span className="font-medium text-foreground">{project.company}</span>
  );

  return (
    <p className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        {creditLabel(project.companyRelation)} {name}
      </span>
    </p>
  );
}
