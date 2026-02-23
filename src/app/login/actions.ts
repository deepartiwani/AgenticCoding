"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import apiRoot from "@/lib/commercetools";

export type LoginState = {
  success?: boolean;
  error?: string;
} | null;

export async function loginCustomer(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid email or password.";
    return { success: false, error: message };
  }

  const cookieStore = await cookies();
  cookieStore.set("customer_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/home");
}
