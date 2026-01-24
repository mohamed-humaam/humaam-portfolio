import { Metadata } from "next";
import { db } from "@/lib/db";
import { ContactForm } from "./contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, Calendar, Github, Linkedin, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for project inquiries, collaborations, or just to say hello.",
};

async function getSettings() {
  return db.siteSettings.findUnique({ where: { id: "main" } });
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how I can help bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            {settings?.email && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phone */}
            {settings?.phone && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {settings?.location && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">{settings.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Quick Connect</h3>
                <div className="space-y-3">
                  {settings?.whatsapp && (
                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  )}
                  {settings?.telegram && (
                    <a
                      href={settings.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Telegram
                    </a>
                  )}
                  {settings?.calendly && (
                    <a
                      href={settings.calendly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                      Schedule a Call
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Follow Me</h3>
                <div className="flex gap-3">
                  {settings?.github && (
                    <a
                      href={settings.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {settings?.linkedin && (
                    <a
                      href={settings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {settings?.twitter && (
                    <a
                      href={settings.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
