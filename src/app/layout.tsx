import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Humaam | Full-Stack Developer & Systems Architect",
    template: "%s | Humaam",
  },
  description:
    "Expert full-stack developer specializing in ERPs, business systems, mobile apps, and automation. 4+ years of experience building scalable solutions.",
  keywords: [
    "full-stack developer",
    "web developer",
    "mobile app developer",
    "ERP systems",
    "Laravel developer",
    "React developer",
    "React Native",
    "software engineer",
  ],
  authors: [{ name: "Humaam" }],
  creator: "Humaam",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Humaam",
    title: "Humaam | Full-Stack Developer & Systems Architect",
    description:
      "Expert full-stack developer specializing in ERPs, business systems, mobile apps, and automation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humaam | Full-Stack Developer",
    description:
      "Expert full-stack developer specializing in ERPs, business systems, mobile apps, and automation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
