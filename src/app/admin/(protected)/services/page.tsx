import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react";
import { DeleteServiceButton } from "./delete-button";

async function getServices() {
  return db.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Services</h2>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            New Service
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No services yet</p>
            <Button asChild>
              <Link href="/admin/services/new">Add your first service</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Featured</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Pricing</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <span className="font-medium">{service.title}</span>
                    <p className="text-sm text-muted-foreground line-clamp-1">{service.shortDesc}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {service.featured && <Badge variant="secondary">Featured</Badge>}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                    {service.pricingNote || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/services/${service.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/services/${service.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteServiceButton id={service.id} name={service.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
