import React from "react";
import Image from "next/image";
import { utils, componentVariants } from "@/lib/design-system";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "error";
  fallbackIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const statusSizeClasses = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
  xl: "h-5 w-5",
};

export const AvatarEnhanced: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  status,
  fallbackIcon,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarClasses = utils.cn(
    "relative flex items-center justify-center rounded-xl overflow-hidden shadow-lg transition-transform duration-200",
    sizeClasses[size],
    onClick && "cursor-pointer hover:scale-110",
    className,
  );

  const statusClasses = utils.cn(
    "absolute -bottom-1 -right-1 rounded-full border-2 border-gray-900",
    statusSizeClasses[size],
    status && componentVariants.status[status],
  );

  return (
    <div className={avatarClasses} onClick={onClick}>
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
          {fallbackIcon || (
            <svg
              className={utils.cn(
                "text-white",
                size === "sm" ? "h-4 w-4" : "h-5 w-5",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
      )}

      {status && (
        <div
          className={statusClasses}
          aria-label={`Status: ${status}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default AvatarEnhanced;
