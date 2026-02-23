import React from "react";
import InputField from "./InputField";

import type { AddressFields } from "./useCheckoutForm";

interface AddressSectionProps {
  shippingAddress: AddressFields;
  billingAddress: AddressFields;
  sameAsShipping: boolean;
  setSameAsShipping: (val: boolean) => void;
  updateShipping: (field: keyof AddressFields, value: string) => void;
  updateBilling: (field: keyof AddressFields, value: string) => void;
  fieldErrors: Record<string, string>;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  shippingAddress,
  billingAddress,
  sameAsShipping,
  setSameAsShipping,
  updateShipping,
  updateBilling,
  fieldErrors,
}) => (
  <>
    {/* Shipping Address */}
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">1</span>
        Shipping Address
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <InputField label="First Name" value={shippingAddress.firstName} onChange={(v) => updateShipping("firstName", v)} error={fieldErrors["shipping_firstName"]} required />
        <InputField label="Last Name" value={shippingAddress.lastName} onChange={(v) => updateShipping("lastName", v)} error={fieldErrors["shipping_lastName"]} required />
        <InputField label="Street Address" value={shippingAddress.streetName} onChange={(v) => updateShipping("streetName", v)} error={fieldErrors["shipping_streetName"]} className="sm:col-span-2" required />
        <InputField label="Apt / Suite / Unit (optional)" value={shippingAddress.additionalStreetInfo} onChange={(v) => updateShipping("additionalStreetInfo", v)} className="sm:col-span-2" />
        <InputField label="City" value={shippingAddress.city} onChange={(v) => updateShipping("city", v)} error={fieldErrors["shipping_city"]} required />
        <InputField label="State / Region" value={shippingAddress.region} onChange={(v) => updateShipping("region", v)} />
        <InputField label="Postal Code" value={shippingAddress.postalCode} onChange={(v) => updateShipping("postalCode", v)} error={fieldErrors["shipping_postalCode"]} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Country <span className="text-red-500">*</span></label>
          <select value={shippingAddress.country} onChange={(e) => updateShipping("country", e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
          </select>
          {fieldErrors["shipping_country"] && <p className="mt-1 text-xs text-red-500">{fieldErrors["shipping_country"]}</p>}
        </div>
        <InputField label="Email" type="email" value={shippingAddress.email} onChange={(v) => updateShipping("email", v)} error={fieldErrors["shipping_email"]} required />
        <InputField label="Phone (optional)" type="tel" value={shippingAddress.phone} onChange={(v) => updateShipping("phone", v)} />
      </div>
    </section>
    {/* Billing Address */}
    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">2</span>
        Billing Address
      </h2>
      <label className="mt-4 flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600" />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Billing address is the same as shipping address</span>
      </label>
      {!sameAsShipping && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InputField label="First Name" value={billingAddress.firstName} onChange={(v) => updateBilling("firstName", v)} error={fieldErrors["billing_firstName"]} required />
          <InputField label="Last Name" value={billingAddress.lastName} onChange={(v) => updateBilling("lastName", v)} error={fieldErrors["billing_lastName"]} required />
          <InputField label="Street Address" value={billingAddress.streetName} onChange={(v) => updateBilling("streetName", v)} error={fieldErrors["billing_streetName"]} className="sm:col-span-2" required />
          <InputField label="Apt / Suite / Unit (optional)" value={billingAddress.additionalStreetInfo} onChange={(v) => updateBilling("additionalStreetInfo", v)} className="sm:col-span-2" />
          <InputField label="City" value={billingAddress.city} onChange={(v) => updateBilling("city", v)} error={fieldErrors["billing_city"]} required />
          <InputField label="State / Region" value={billingAddress.region} onChange={(v) => updateBilling("region", v)} />
          <InputField label="Postal Code" value={billingAddress.postalCode} onChange={(v) => updateBilling("postalCode", v)} error={fieldErrors["billing_postalCode"]} required />
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Country <span className="text-red-500">*</span></label>
            <select value={billingAddress.country} onChange={(e) => updateBilling("country", e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </select>
            {fieldErrors["billing_country"] && <p className="mt-1 text-xs text-red-500">{fieldErrors["billing_country"]}</p>}
          </div>
        </div>
      )}
    </section>
  </>
);

export default AddressSection;
