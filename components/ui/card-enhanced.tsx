import React from "react";
import { utils, componentVariants } from "@/lib/design-system";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "interactive";
  padding?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  role?: string;
  "aria-label"?: string;
}

const paddingClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const CardEnhanced: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  className,
  onClick,
  role,
  "aria-label": ariaLabel,
}) => {
  const cardClasses = utils.cn(
    "rounded-xl backdrop-blur-sm",
    componentVariants.card[variant],
    paddingClasses[padding],
    onClick && "cursor-pointer",
    className,
  );

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export default CardEnhanced;
