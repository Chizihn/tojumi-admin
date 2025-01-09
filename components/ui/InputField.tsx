import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  type,
  label,
  placeholder,
  className,
  children,
  ...props
}: {
  type?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleToggle = () => setShowPassword((prev) => !prev);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-md lg:text-lg font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-100 hover:bg-slate-200 transition-colors `}
          {...props}
          required
          autoComplete="true"
        >
          {children}
        </input>
        {type === "password" && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
