"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "gold" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-5 py-2 text-[10px] tracking-[0.2em]",
    md: "px-8 py-3.5 text-xs tracking-[0.25em]",
    lg: "px-12 py-4.5 text-sm tracking-[0.3em]",
  };

  const getBaseClasses = () => {
    switch (variant) {
      case "primary":
        // Solid black background, brass outline, slides gold layer on hover
        return "bg-black text-[#C5A880] border border-[#C5A880]/30 hover:border-[#C5A880] shadow-[0_0_15px_rgba(0,0,0,0.5)]";
      case "gold":
        // Solid golden bronze fill
        return "bg-[#C5A880] text-black border border-[#C5A880] hover:bg-transparent hover:text-[#C5A880]";
      case "outline":
        // Dark transparent, white border, slides gold layer on hover
        return "bg-transparent text-white border border-white/20 hover:border-white";
      case "minimal":
        // Underground link with bottom underline slide
        return "bg-transparent text-white/70 hover:text-white px-0 py-1 border-none";
    }
  };

  const isSlideVariant = variant === "primary" || variant === "outline";

  return (
    <button
      className={`group relative inline-flex items-center justify-center font-sans uppercase font-medium overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed z-10 ${sizeClasses[size]} ${getBaseClasses()} ${className}`}
      {...props}
    >
      {/* Sliding background slide-over for primary and outline variants */}
      {isSlideVariant && (
        <span className="absolute inset-0 bg-[#C5A880] transition-transform duration-500 scale-x-0 origin-left -z-10 group-hover:scale-x-100" />
      )}

      {/* Underline drawer for minimal variant */}
      {variant === "minimal" && (
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A880] transition-transform duration-300 scale-x-0 origin-left group-hover:scale-x-100" />
      )}

      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-xs">Loading...</span>
        </div>
      ) : (
        <span
          className={`relative z-10 flex items-center gap-2 transition-colors duration-500 ${
            isSlideVariant ? "group-hover:text-black" : ""
          }`}
        >
          {children}
        </span>
      )}
    </button>
  );
};
