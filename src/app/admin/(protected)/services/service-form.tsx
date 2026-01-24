"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { createService, updateService } from "@/actions/services";
import { slugify } from "@/lib/utils";
import type { Service } from "@prisma/client";

interface ServiceFormProps {
  service?: Service;
}

const iconOptions = ["Building2", "Calendar", "Globe", "Smartphone", "Plug", "Bot", "RefreshCw", "Cloud", "Calculator"];

export function ServiceForm({ service }: ServiceFormProps) {
  const [deliverableInput, setDeliverableInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || "",
      slug: service?.slug || "",
      shortDesc: service?.shortDesc || "",
      longDesc: service?.longDesc || "",
      icon: service?.icon || "Globe",
      deliverables: service?.deliverables || [],
      pricingNote: service?.pricingNote || "",
      featured: service?.featured || false,
      sortOrder: service?.sortOrder || 0,
    },
  });

  const watchedTitle = watch("title");
  const watchedDeliverables = watch("deliverables");

  function generateSlug() {
    if (watchedTitle) {
      setValue("slug", slugify(watchedTitle));
    }
  }

  function addDeliverable() {
    if (deliverableInput.trim()) {
      setValue("deliverables", [...watchedDeliverables, deliverableInput.trim()]);
      setDeliverableInput("");
    }
  }

  function removeDeliverable(item: string) {
    setValue("deliverables", watchedDeliverables.filter((d) => d !== item));
  }

  async function onSubmit(data: ServiceInput) {
    try {
      const result = isEditing
        ? await updateService(service.id, data)
        : await createService(data);

      if (result.success) {
        toast({ title: isEditing ? "Updated" : "Created", description: "Service saved successfully." });
        router.push("/admin/services");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Service Name" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input id="slug" placeholder="service-name" {...register("slug")} />
                  <Button type="button" variant="outline" onClick={generateSlug}>Generate</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Textarea id="shortDesc" placeholder="Brief description..." rows={2} {...register("shortDesc")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDesc">Long Description * (Markdown)</Label>
                <Textarea id="longDesc" placeholder="Detailed description..." rows={10} {...register("longDesc")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add deliverable"
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addDeliverable}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {watchedDeliverables.length > 0 && (
                <ul className="space-y-2">
                  {watchedDeliverables.map((item, index) => (
                    <li key={index} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                      <span className="text-sm">{item}</span>
                      <button type="button" onClick={() => removeDeliverable(item)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3"
                  defaultValue={service?.icon || "Globe"}
                  onChange={(e) => setValue("icon", e.target.value)}
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingNote">Pricing Note</Label>
                <Input id="pricingNote" placeholder="Starting from $X" {...register("pricingNote")} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  defaultChecked={service?.featured || false}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : isEditing ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
