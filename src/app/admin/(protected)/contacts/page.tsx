import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";

async function getContacts() {
  return db.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Contact Submissions</h2>
        <p className="text-muted-foreground">View messages from your contact form</p>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No contact submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={contact.status === "new" ? "default" : "secondary"}>
                      {contact.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateShort(contact.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contact.subject && (
                  <p className="text-sm font-medium mb-2">Subject: {contact.subject}</p>
                )}
                <p className="text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
