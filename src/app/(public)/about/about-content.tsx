"use client";

import { motion } from "framer-motion";
import { Briefcase, Code, Heart, Rocket, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SiteSettings, Skill } from "@prisma/client";

interface AboutContentProps {
  settings: SiteSettings | null;
  skills: Skill[];
}

const categoryOrder = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools"];

const values = [
  {
    icon: Code,
    title: "Clean Code",
    description: "I write code that's readable, maintainable, and well-documented. No shortcuts that create technical debt."
  },
  {
    icon: Heart,
    title: "User First",
    description: "Every technical decision is made with the end user in mind. Great UX is not optional."
  },
  {
    icon: Rocket,
    title: "Ship Fast",
    description: "I believe in iterative development. Get working software in front of users, then improve."
  },
  {
    icon: Briefcase,
    title: "Business Focus",
    description: "Technology serves the business, not the other way around. I solve real problems."
  }
];

export function AboutContent({ settings, skills }: AboutContentProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const sortedCategories = categoryOrder.filter((cat) => groupedSkills[cat]);

  // Parse about content into sections
  const aboutSections = settings?.aboutContent?.split("\n\n").filter(Boolean) || [];

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {settings?.tagline || "Full-Stack Developer & Systems Architect"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {aboutSections.map((section, index) => {
                // Check if it's a heading
                if (section.startsWith("**") && section.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-8 mb-4">
                      {section.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                // Check if it's a list item section
                if (section.includes("- ")) {
                  const items = section.split("\n").filter((item) => item.startsWith("- "));
                  return (
                    <ul key={index} className="space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item.replace("- ", "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {section}
                  </p>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-bold">{settings?.yearsExp || 4}+ Years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-bold">{settings?.projectsCount || 50}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Clients</span>
                  <span className="font-bold">{settings?.clientsCount || 30}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-bold">{settings?.location || "Remote"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{value.title}</h4>
                      <p className="text-xs text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-8 text-center">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.map((category, catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedSkills[category]
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
