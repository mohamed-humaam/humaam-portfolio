import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Calendar, Globe, Smartphone, Plug, Bot, RefreshCw, Cloud, Calculator } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-stack development services including custom ERPs, web apps, mobile apps, API development, and more.",
};

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

async function getServices() {
  return db.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            End-to-end development services to bring your ideas to life. From concept to deployment, I&apos;ve got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon || "Globe"] || Globe;
            
            return (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {service.featured && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {service.shortDesc}
                    </p>
                    {service.pricingNote && (
                      <p className="text-xs text-primary font-medium mb-4">
                        {service.pricingNote}
                      </p>
                    )}
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Don&apos;t see what you need? Let&apos;s discuss your custom requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Get in touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
