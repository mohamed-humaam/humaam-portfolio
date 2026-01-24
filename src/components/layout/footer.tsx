import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { db } from "@/lib/db";

const navigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Custom ERP Systems", href: "/services/custom-erp-systems" },
    { name: "Web Applications", href: "/services/web-applications" },
    { name: "Mobile Apps", href: "/services/mobile-app-development" },
    { name: "API Development", href: "/services/api-development" },
  ],
};

async function getSettings() {
  try {
    return await db.siteSettings.findUnique({ where: { id: "main" } });
  } catch {
    return null;
  }
}

export async function Footer() {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">H</span>
                </div>
                <span className="font-display font-bold text-xl">
                  {settings?.name || "Humaam"}
                </span>
              </Link>
              <p className="text-muted-foreground max-w-md mb-6">
                {settings?.bio || "Full-stack developer building powerful digital solutions. From ERPs to mobile apps, I deliver clean, scalable code."}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {settings?.github && (
                  <a
                    href={settings.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {settings?.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {settings?.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {settings?.name || "Humaam"}. All rights reserved.
          </p>
          {settings?.location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {settings.location}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
