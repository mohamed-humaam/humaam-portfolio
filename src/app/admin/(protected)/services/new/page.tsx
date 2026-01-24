import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <h2 className="text-2xl font-display font-bold">New Service</h2>
        <p className="text-muted-foreground">Add a new service offering</p>
      </div>
      <ServiceForm />
    </div>
  );
}
