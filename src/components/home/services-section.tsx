"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Calendar, Globe, Smartphone, Plug, Bot, RefreshCw, Cloud, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@prisma/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Calendar,
  Globe,
  Smartphone,
  Plug,
  Bot,
  RefreshCw,
  Cloud,
  Calculator,
};

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const featuredServices = services.filter((s) => s.featured).slice(0, 6);
  const displayServices = featuredServices.length >= 3 ? featuredServices : services.slice(0, 6);

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            What I <span className="gradient-text">Offer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end development services to bring your ideas to life. From concept to deployment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon || "Globe"] || Globe;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/services/${service.slug}`}>
                  <Card className="h-full group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.shortDesc}
                      </p>
                      <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn more
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
