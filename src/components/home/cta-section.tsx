"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  calendlyUrl?: string | null;
}

export function CTASection({ calendlyUrl }: CTASectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 noise opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Build Something{" "}
            <span className="gradient-text">Amazing?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your project and see how I can help bring your vision to life.
            From initial concept to final deployment, I&apos;m here to help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            {calendlyUrl && (
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a Call
                </a>
              </Button>
            )}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Average response time: <span className="text-foreground font-medium">under 24 hours</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
