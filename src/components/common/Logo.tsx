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
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {/* Crown SVG */}
      <svg
        width={iconSize}
        height={iconSize * 0.8}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors duration-300"
        style={{ color: goldColor || "var(--logo-gold, rgb(var(--gold)))" }}
      >
        {/* Crown peaks */}
        <path
          d="M15 52L25 22L45 42L50 18L55 42L75 22L85 52Z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crown base */}
        <path
          d="M15 52H85L80 62H20Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M15 52H85L80 62H20Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Peaks Jewels */}
        <circle cx="25" cy="22" r="3.5" fill="currentColor" />
        <circle cx="50" cy="18" r="3.5" fill="currentColor" />
        <circle cx="75" cy="22" r="3.5" fill="currentColor" />
        {/* Base corner jewels */}
        <circle cx="15" cy="52" r="2" fill="currentColor" />
        <circle cx="85" cy="52" r="2" fill="currentColor" />
        
        {/* Center decorative diamond */}
        <path
          d="M50 36L54 41L50 46L46 41Z"
          fill="currentColor"
        />
        {/* Side decorative dots */}
        <circle cx="35" cy="44" r="2.5" fill="currentColor" />
        <circle cx="65" cy="44" r="2.5" fill="currentColor" />
      </svg>

      {/* Brand Name SHREE SAI */}
      <span
        className="font-serif text-[15px] tracking-[0.25em] uppercase font-semibold leading-none mt-1 transition-colors duration-300"
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
  );
};
