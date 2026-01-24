"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { updateSettings } from "@/actions/settings";
import type { SiteSettings } from "@prisma/client";

interface SettingsFormProps {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      name: settings?.name || "Humaam",
      tagline: settings?.tagline || "Full-Stack Developer",
      email: settings?.email || "",
      phone: settings?.phone || "",
      location: settings?.location || "",
      bio: settings?.bio || "",
      aboutContent: settings?.aboutContent || "",
      github: settings?.github || "",
      linkedin: settings?.linkedin || "",
      twitter: settings?.twitter || "",
      instagram: settings?.instagram || "",
      whatsapp: settings?.whatsapp || "",
      telegram: settings?.telegram || "",
      calendly: settings?.calendly || "",
      seoTitle: settings?.seoTitle || "",
      seoDesc: settings?.seoDesc || "",
      ogImage: settings?.ogImage || "",
      yearsExp: settings?.yearsExp || 4,
      projectsCount: settings?.projectsCount || 50,
      clientsCount: settings?.clientsCount || 30,
    },
  });

  async function onSubmit(data: SiteSettingsInput) {
    const result = await updateSettings(data);
    if (result.success) {
      toast({ title: "Saved", description: "Settings updated successfully." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input id="tagline" {...register("tagline")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio (for hero section)</Label>
                <Textarea id="bio" rows={3} {...register("bio")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutContent">About Page Content (Markdown)</Label>
                <Textarea id="aboutContent" rows={10} {...register("aboutContent")} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsExp">Years Experience</Label>
                  <Input id="yearsExp" type="number" {...register("yearsExp", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectsCount">Projects Count</Label>
                  <Input id="projectsCount" type="number" {...register("projectsCount", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientsCount">Clients Count</Label>
                  <Input id="clientsCount" type="number" {...register("clientsCount", { valueAsNumber: true })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" {...register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calendly">Calendly URL (for booking calls)</Label>
                <Input id="calendly" placeholder="https://calendly.com/yourname/30min" {...register("calendly")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" placeholder="https://github.com/username" {...register("github")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/username" {...register("linkedin")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input id="twitter" placeholder="https://twitter.com/username" {...register("twitter")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="https://instagram.com/username" {...register("instagram")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" placeholder="https://wa.me/1234567890" {...register("whatsapp")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input id="telegram" placeholder="https://t.me/username" {...register("telegram")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Default SEO Title</Label>
                <Input id="seoTitle" {...register("seoTitle")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDesc">Default Meta Description</Label>
                <Textarea id="seoDesc" rows={3} {...register("seoDesc")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Default OG Image URL</Label>
                <Input id="ogImage" placeholder="https://..." {...register("ogImage")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
