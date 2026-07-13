"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = "slideUp",
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  className = "",
}) => {
  const getVariants = () => {
    switch (variant) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case "slideDown":
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        };
      case "slideLeft":
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        };
      case "slideRight":
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }} // Elegant cubic-bezier easing
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}> = ({ children, delayChildren = 0, staggerChildren = 0.1, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  variant?: "slideUp" | "fade" | "scale";
  className?: string;
}> = ({ children, variant = "slideUp", className = "" }) => {
  const itemVariants: Variants = {
    hidden:
      variant === "slideUp"
        ? { opacity: 0, y: 25 }
        : variant === "scale"
        ? { opacity: 0, scale: 0.95 }
        : { opacity: 0 },
    visible:
      variant === "slideUp"
        ? { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
        : variant === "scale"
        ? { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
        : { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};
