"use client";

import React, { useEffect, useState } from "react";

export const ShowroomSpotlight: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-70"
      style={{
        background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(197, 168, 128, 0.045), transparent 80%)`,
      }}
    />
  );
};
