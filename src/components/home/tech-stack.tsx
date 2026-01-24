"use client";

import { motion } from "framer-motion";
import type { Skill } from "@prisma/client";

interface TechStackProps {
  skills: Skill[];
}

const categoryOrder = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools"];

export function TechStack({ skills }: TechStackProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const sortedCategories = categoryOrder.filter((cat) => groupedSkills[cat]);

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies I use to bring your ideas to life.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sortedCategories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {groupedSkills[category]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <div className="relative px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                        {/* Skill level indicator */}
                        <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-full bg-primary/50"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
