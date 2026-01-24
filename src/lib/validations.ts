import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Projects
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  summary: z.string().min(1, "Summary is required").max(500),
  description: z.string().min(1, "Description is required"),
  stack: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(["draft", "published"]).default("published"),
});

// Blog Posts
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().optional().nullable(),
});

// Services
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  shortDesc: z.string().min(1, "Short description is required").max(300),
  longDesc: z.string().min(1, "Long description is required"),
  icon: z.string().optional().or(z.literal("")),
  deliverables: z.array(z.string()).default([]),
  pricingNote: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// Skills
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  level: z.number().int().min(0).max(100).default(80),
  icon: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

// Testimonials
export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  company: z.string().optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// Site Settings
export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  aboutContent: z.string().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  calendly: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDesc: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  yearsExp: z.number().int().min(0).default(4),
  projectsCount: z.number().int().min(0).default(50),
  clientsCount: z.number().int().min(0).default(30),
});

// Contact Form
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0, "Bot detected").optional(), // Spam protection
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
