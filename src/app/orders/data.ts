import { getOrdersByCustomerEmail } from "@/lib/commercetools";

export async function fetchOrdersByEmail(customerEmail: string) {
  return getOrdersByCustomerEmail(customerEmail);
}
