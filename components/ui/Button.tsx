import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "gray" | "homepage" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  style = {},
  variant = "primary",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-[#203643] hover:bg-[#1a2d35] text-white",
    secondary: "bg-[#FF6F61] text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-black",
    homepage: "bg-yellow-500 hover:bg-yellow-600 text-black",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={clsx(
        "flex gap-1.5 items-center justify-center px-4 py-2 text-sm rounded-lg transition-colors duration-300 font-semibold shadow-sm",
        "flex-1 lg:flex-none",
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={style}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="h-5 w-5 text-white animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
