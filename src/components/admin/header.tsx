"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import type { SessionPayload } from "@/lib/auth";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Projects", href: "/admin/projects" },
  { name: "Posts", href: "/admin/posts" },
  { name: "Services", href: "/admin/services" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Contacts", href: "/admin/contacts" },
  { name: "Media", href: "/admin/media" },
  { name: "Settings", href: "/admin/settings" },
];

interface AdminHeaderProps {
  user: SessionPayload;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  const currentPage = navigation.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold lg:hidden">
          {currentPage?.name || "Admin"}
        </h1>

        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold">{currentPage?.name || "Admin"}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.email}
          </span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              ← Back to Site
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
