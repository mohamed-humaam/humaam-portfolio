"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validations";

export async function login(
  data: LoginInput
): Promise<{ success: boolean; error?: string }> {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid credentials" };
  }

  const { email, password } = validated.data;

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  await createSession(user.id, user.email, user.role);
  return { success: true };
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
