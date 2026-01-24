import { db } from "@/lib/db";
import { SettingsForm } from "./settings-form";

async function getSettings() {
  return db.siteSettings.findUnique({ where: { id: "main" } });
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Manage your portfolio settings and contact information</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
