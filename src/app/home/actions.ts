"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_email");
  redirect("/login");
}
