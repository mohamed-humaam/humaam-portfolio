import { Metadata } from "next";
import { db } from "@/lib/db";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my background, skills, and approach to software development.",
};

async function getAboutData() {
  const [settings, skills] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "main" } }),
    db.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return { settings, skills };
}

export default async function AboutPage() {
  const { settings, skills } = await getAboutData();

  return <AboutContent settings={settings} skills={skills} />;
}
