import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FolderKanban, 
  FileText, 
  Briefcase, 
  Code2, 
  MessageSquare,
  ArrowRight,
  Eye
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";

async function getDashboardData() {
  const [
    projectCount,
    postCount,
    serviceCount,
    skillCount,
    contactCount,
    recentContacts,
    recentPosts,
  ] = await Promise.all([
    db.project.count(),
    db.post.count(),
    db.service.count(),
    db.skill.count(),
    db.contact.count({ where: { status: "new" } }),
    db.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    projectCount,
    postCount,
    serviceCount,
    skillCount,
    contactCount,
    recentContacts,
    recentPosts,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { name: "Projects", value: data.projectCount, icon: FolderKanban, href: "/admin/projects" },
    { name: "Blog Posts", value: data.postCount, icon: FileText, href: "/admin/posts" },
    { name: "Services", value: data.serviceCount, icon: Briefcase, href: "/admin/services" },
    { name: "Skills", value: data.skillCount, icon: Code2, href: "/admin/skills" },
    { name: "New Contacts", value: data.contactCount, icon: MessageSquare, href: "/admin/contacts" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your portfolio.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{stat.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/contacts">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentContacts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No contacts yet.</p>
            ) : (
              <div className="space-y-4">
                {data.recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === "new" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {contact.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateShort(contact.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/posts">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {data.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === "published" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/projects/new">New Project</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/posts/new">New Blog Post</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/services/new">New Service</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
