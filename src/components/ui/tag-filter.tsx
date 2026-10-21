"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TagFilterProps {
  /** Tags in display order — most used first. */
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
  /** How many tags show on wider screens before "+N more". */
  visibleCount?: number;
}

/**
 * One row of tag filters. Phones get a single sideways-scrolling row; wider
 * screens show the most used tags with a toggle for the rest, so a long tag
 * list never pushes the content below the fold.
 */
export function TagFilter({ tags, selected, onSelect, visibleCount = 10 }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const hidden = tags.length - visibleCount;
  let shown = expanded || hidden <= 0 ? tags : tags.slice(0, visibleCount);
  // Keep the active tag visible even when it lives in the collapsed tail.
  if (selected && !shown.includes(selected)) shown = [...shown, selected];

  const tagButton = (tag: string) => (
    <Button
      key={tag}
      variant={selected === tag ? "default" : "outline"}
      size="sm"
      className="shrink-0"
      onClick={() => onSelect(selected === tag ? null : tag)}
    >
      {tag}
    </Button>
  );

  const allButton = (
    <Button
      variant={selected === null ? "default" : "outline"}
      size="sm"
      className="shrink-0"
      onClick={() => onSelect(null)}
    >
      All
    </Button>
  );

  return (
    <>
      {/* Phones: one swipeable row */}
      <div className="-mx-4 sm:hidden">
        <div className="no-scrollbar fade-x flex gap-2 overflow-x-auto px-4 pb-1">
          {allButton}
          {tags.map(tagButton)}
        </div>
      </div>

      {/* Tablet and up: most used tags, the rest behind a toggle */}
      <div className="hidden flex-wrap gap-2 sm:flex">
        {allButton}
        {shown.map(tagButton)}
        {hidden > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `+${hidden} more`}
          </Button>
        )}
      </div>
    </>
  );
}

