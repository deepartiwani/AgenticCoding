import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  className?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  className = "",
  required = false,
}) => (
  <div className={className}>
    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
        error
          ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300"
          : "border-zinc-300 bg-white text-zinc-900 focus:border-violet-500 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default InputField;
