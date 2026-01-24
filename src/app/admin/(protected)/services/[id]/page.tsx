import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ServiceForm } from "../service-form";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

async function getService(id: string) {
  return db.service.findUnique({ where: { id } });
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <h2 className="text-2xl font-display font-bold">Edit Service</h2>
        <p className="text-muted-foreground">Update service details</p>
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
