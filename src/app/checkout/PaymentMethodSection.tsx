import React from "react";

const PAYMENT_METHODS = [
  { id: "credit-card", label: "Credit / Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ paymentMethod, setPaymentMethod }) => (
  <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">3</span>
      Payment Method
    </h2>
    <div className="mt-5 space-y-3">
      {PAYMENT_METHODS.map((pm) => (
        <label
          key={pm.id}
          className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
            paymentMethod === pm.id
              ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/20 dark:border-violet-400 dark:bg-violet-500/10"
              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={pm.id}
            checked={paymentMethod === pm.id}
            onChange={() => setPaymentMethod(pm.id)}
            className="h-4 w-4 border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600"
          />
          <span className="text-xl">{pm.icon}</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{pm.label}</span>
        </label>
      ))}
    </div>
    {paymentMethod === "credit-card" && (
      <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          This is a demo store — no real payment will be processed. Your order will be placed with a &ldquo;Pending&rdquo; payment state.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Expiry</label>
            <input type="text" placeholder="MM / YY" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">CVC</label>
            <input type="text" placeholder="123" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50" />
          </div>
        </div>
      </div>
    )}
  </section>
);

export default PaymentMethodSection;
