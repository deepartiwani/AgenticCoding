"use client";

import AddressSection from "./AddressSection";
import PaymentMethodSection from "./PaymentMethodSection";
import OrderSummarySection from "./OrderSummarySection";
import { useCheckoutForm } from "./useCheckoutForm";
import type { CheckoutCartData } from "./page";

export default function CheckoutForm({ cart }: { cart: CheckoutCartData }) {
  const {
    shippingAddress,
    billingAddress,
    sameAsShipping,
    setSameAsShipping,
    paymentMethod,
    setPaymentMethod,
    error,
    fieldErrors,
    isPending,
    updateShipping,
    updateBilling,
    handlePlaceOrder,
  } = useCheckoutForm(cart);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      {/* Left column - Forms */}
      <div className="lg:col-span-7 xl:col-span-8">
        <AddressSection
          shippingAddress={shippingAddress}
          billingAddress={billingAddress}
          sameAsShipping={sameAsShipping}
          setSameAsShipping={setSameAsShipping}
          updateShipping={updateShipping}
          updateBilling={updateBilling}
          fieldErrors={fieldErrors}
        />
        <PaymentMethodSection
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>
      {/* Right column - Order Summary + Place Order */}
      <div className="mt-8 lg:col-span-5 xl:col-span-4 lg:mt-0">
        <OrderSummarySection
          cart={cart}
          error={error}
          isPending={isPending}
          handlePlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}


