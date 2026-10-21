"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Ease-out-expo: fast start, long soft landing. Shared by the home page motion. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
