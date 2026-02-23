"use server";

import { redirect } from "next/navigation";
import apiRoot from "@/lib/commercetools";

export type SignUpState = {
  success?: boolean;
  error?: string;
} | null;

export async function signUpCustomer(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: "All fields are required." };
  }

  try {
    await apiRoot
      .customers()
      .post({
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      })
      .execute();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return { success: false, error: message };
  }

  redirect("/home");
}
