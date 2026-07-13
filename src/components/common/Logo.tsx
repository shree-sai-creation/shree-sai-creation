"use client";

import React from "react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textColor?: string; // Custom text color overrides
  goldColor?: string; // Custom gold color overrides
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  iconSize = 34,
  textColor,
  goldColor
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Shree Sai Creation Logo"
        style={{ height: iconSize * 1.2 }}
        className="w-auto object-contain transition-transform duration-300 hover:scale-105 mr-3"
      />
      <div className="flex flex-col items-center justify-center text-center">
        {/* Brand Name SHREE SAI */}
        <span
          className="font-serif text-[15px] tracking-[0.25em] uppercase font-semibold leading-none transition-colors duration-300"
          style={{ color: textColor || "rgb(var(--foreground))" }}
        >
          Shree Sai
        </span>

        {/* Brand Subtitle CREATION */}
        <span
          className="text-[7.5px] tracking-[0.45em] uppercase font-light leading-none mt-1.5 transition-colors duration-300"
          style={{ color: goldColor || "rgb(var(--gold))" }}
        >
          Creation
        </span>
      </div>
    </div>
  );
};
