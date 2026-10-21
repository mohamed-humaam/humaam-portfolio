"use client";

import type { CSSProperties } from "react";
import { Braces, Code2 } from "lucide-react";
import type { Skill } from "@prisma/client";
import { Reveal } from "@/components/ui/reveal";
import { techIcon } from "@/lib/tech-icons";

interface TechStackProps {
  skills: Skill[];
}

const categoryOrder = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools"];

/** Brand colours too dark to read on the dark theme fall back to the text colour. */
function isTooDark(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

function TechChip({ skill }: { skill: Skill }) {
  const icon = techIcon(skill.name);
  const brand = icon && !isTooDark(icon.hex) ? `#${icon.hex}` : "hsl(var(--foreground))";
  const Fallback = /api/i.test(skill.name) ? Braces : Code2;

  return (
    <div
      style={{ "--brand": brand } as CSSProperties}
      className="group/chip flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/60 px-5 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-[color:var(--brand)] hover:bg-card"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground transition-colors duration-300 group-hover/chip:text-[color:var(--brand)]">
        {icon ? (
          <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d={icon.path} />
          </svg>
        ) : (
          <Fallback className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <span className="whitespace-nowrap text-sm font-medium">{skill.name}</span>
    </div>
  );
}

/** An endless row: the list is rendered twice and slid by half its width. */
function MarqueeRow({ skills, reverse, duration }: { skills: Skill[]; reverse?: boolean; duration: string }) {
  return (
    <div className="fade-x group flex overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          style={{ "--marquee-duration": duration } as CSSProperties}
          className={`flex shrink-0 animate-marquee gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
            reverse ? "[animation-direction:reverse]" : ""
          }`}
        >
          {skills.map((skill) => (
            <TechChip key={`${copy}-${skill.id}`} skill={skill} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TechStack({ skills }: TechStackProps) {
  const ordered = [...skills].sort(
    (a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
      a.sortOrder - b.sortOrder
  );
  // Alternate skills between the rows so each row mixes categories.
  const rows = [ordered.filter((_, i) => i % 2 === 0), ordered.filter((_, i) => i % 2 === 1)];
  const categories = categoryOrder.filter((cat) => skills.some((s) => s.category === cat));

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Technologies I use to bring your ideas to life.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="space-y-4">
        <MarqueeRow skills={rows[0]} duration="55s" />
        <MarqueeRow skills={rows[1]} duration="65s" reverse />
      </Reveal>

      <Reveal delay={0.3} className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{skills.length}</span> technologies across{" "}
          {categories.join(" · ")}
        </p>
      </Reveal>
    </section>
  );
}
