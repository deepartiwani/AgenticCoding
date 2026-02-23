import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { placeOrderAction } from "./actions";
import type { CheckoutCartData } from "./page";

export interface AddressFields {
  firstName: string;
  lastName: string;
  streetName: string;
  additionalStreetInfo: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
}

export const emptyAddress: AddressFields = {
  firstName: "",
  lastName: "",
  streetName: "",
  additionalStreetInfo: "",
  city: "",
  region: "",
  postalCode: "",
  country: "US",
  email: "",
  phone: "",
};

export function useCheckoutForm(cart: CheckoutCartData) {
  const [shippingAddress, setShippingAddress] = useState<AddressFields>(emptyAddress);
  const [billingAddress, setBillingAddress] = useState<AddressFields>(emptyAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setItemCount } = useCart();

  const updateShipping = (field: keyof AddressFields, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[`shipping_${field}`]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[`shipping_${field}`];
        return next;
      });
    }
  };

  const updateBilling = (field: keyof AddressFields, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[`billing_${field}`]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[`billing_${field}`];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredShipping: (keyof AddressFields)[] = [
      "firstName",
      "lastName",
      "streetName",
      "city",
      "postalCode",
      "country",
      "email",
    ];
    for (const field of requiredShipping) {
      if (!shippingAddress[field].trim()) {
        errors[`shipping_${field}`] = "Required";
      }
    }
    if (
      shippingAddress.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)
    ) {
      errors["shipping_email"] = "Invalid email";
    }
    if (!sameAsShipping) {
      const requiredBilling: (keyof AddressFields)[] = [
        "firstName",
        "lastName",
        "streetName",
        "city",
        "postalCode",
        "country",
      ];
      for (const field of requiredBilling) {
        if (!billingAddress[field].trim()) {
          errors[`billing_${field}`] = "Required";
        }
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = () => {
    setError(null);
    if (!validate()) return;
    startTransition(async () => {
      const billing = sameAsShipping ? shippingAddress : billingAddress;
      const result = await placeOrderAction(
        {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          streetName: shippingAddress.streetName,
          additionalStreetInfo: shippingAddress.additionalStreetInfo || undefined,
          city: shippingAddress.city,
          region: shippingAddress.region || undefined,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          email: shippingAddress.email || undefined,
          phone: shippingAddress.phone || undefined,
        },
        {
          firstName: billing.firstName,
          lastName: billing.lastName,
          streetName: billing.streetName,
          additionalStreetInfo: billing.additionalStreetInfo || undefined,
          city: billing.city,
          region: billing.region || undefined,
          postalCode: billing.postalCode,
          country: billing.country,
          email: billing.email || shippingAddress.email || undefined,
          phone: billing.phone || shippingAddress.phone || undefined,
        },
        paymentMethod
      );
      if (result.success) {
        setItemCount(0);
        router.push(`/checkout/confirmation?orderId=${result.orderId}`);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  };

  return {
    shippingAddress,
    setShippingAddress,
    billingAddress,
    setBillingAddress,
    sameAsShipping,
    setSameAsShipping,
    paymentMethod,
    setPaymentMethod,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
    isPending,
    updateShipping,
    updateBilling,
    validate,
    handlePlaceOrder,
  };
}
