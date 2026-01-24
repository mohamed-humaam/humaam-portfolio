"use server";

import { db } from "@/lib/db";
import { contactSchema, type ContactInput } from "@/lib/validations";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 submissions per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

export async function submitContact(
  data: ContactInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validated = contactSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid form data" };
    }

    const { name, email, subject, message, honeypot } = validated.data;

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      // Silently accept but don't save (bot trap)
      return { success: true };
    }

    // Basic rate limiting using email as identifier
    if (isRateLimited(email)) {
      return {
        success: false,
        error: "Too many submissions. Please try again later.",
      };
    }

    // Save to database
    await db.contact.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        status: "new",
      },
    });

    // Optional: Send email notification
    // await sendEmailNotification({ name, email, subject, message });

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
