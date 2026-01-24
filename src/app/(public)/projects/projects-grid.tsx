"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@prisma/client";

interface ProjectsGridProps {
  projects: Project[];
  allTags: string[];
}

export function ProjectsGrid({ projects, allTags }: ProjectsGridProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      search === "" ||
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.summary.toLowerCase().includes(search.toLowerCase()) ||
      project.stack.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );

    const matchesTag =
      selectedTag === null || project.stack.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          {allTags.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group h-full overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-4xl font-display font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setSelectedTag(tech)}
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.stack.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.stack.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Source Code"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearch("");
              setSelectedTag(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </>
  );
}
