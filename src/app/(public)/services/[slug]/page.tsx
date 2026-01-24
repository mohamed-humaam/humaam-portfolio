import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Building2, Calendar, Globe, Smartphone, Plug, Bot, RefreshCw, Cloud, Calculator } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  return db.service.findUnique({
    where: { slug },
  });
}

async function getRelatedServices(currentSlug: string) {
  return db.service.findMany({
    where: { slug: { not: currentSlug } },
    take: 3,
    orderBy: { sortOrder: "asc" },
  });
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  
  if (!service) return { title: "Service Not Found" };
  
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

export async function generateStaticParams() {
  const services = await db.service.findMany({
    select: { slug: true },
  });
  
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, relatedServices] = await Promise.all([
    getService(slug),
    getRelatedServices(slug),
  ]);

  if (!service) notFound();

  const Icon = iconMap[service.icon || "Globe"] || Globe;
  const paragraphs = service.longDesc.split("\n\n").filter(Boolean);

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-8">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                  {service.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {service.shortDesc}
                </p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {paragraphs.map((para, index) => {
                if (para.startsWith("**") && para.includes("**")) {
                  const headerMatch = para.match(/^\*\*(.+?)\*\*/);
                  if (headerMatch) {
                    const header = headerMatch[1];
                    const rest = para.replace(/^\*\*.+?\*\*\n?/, "");
                    return (
                      <div key={index}>
                        <h3 className="text-xl font-bold mt-8 mb-4">{header}</h3>
                        {rest && <p className="text-muted-foreground">{rest}</p>}
                      </div>
                    );
                  }
                }
                if (para.includes("- ")) {
                  const items = para.split("\n").filter((line) => line.trim().startsWith("- "));
                  if (items.length > 0) {
                    return (
                      <ul key={index} className="space-y-2 my-4">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{item.replace(/^-\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {service.deliverables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What&apos;s Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {service.pricingNote && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-primary">
                    {service.pricingNote}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let&apos;s discuss your project requirements and create a custom solution.
                </p>
                <Button asChild className="w-full">
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedServices.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <h2 className="text-2xl font-display font-bold mb-8">Other Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((related) => {
                const RelatedIcon = iconMap[related.icon || "Globe"] || Globe;
                return (
                  <Link key={related.id} href={`/services/${related.slug}`}>
                    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="pt-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <RelatedIcon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {related.shortDesc}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
