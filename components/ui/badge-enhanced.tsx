import React from "react";
import { utils } from "@/lib/design-system";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses = {
  primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
  secondary: "bg-gray-700 text-gray-200",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export const BadgeEnhanced: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
}) => {
  const badgeClasses = utils.cn(
    "inline-flex items-center gap-1.5 rounded-lg font-semibold shadow-md transition-all duration-200",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  return (
    <span className={badgeClasses}>
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default BadgeEnhanced;
