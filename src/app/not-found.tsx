"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-[#0a0a0a] min-h-[70vh] text-white font-sans flex items-center justify-center py-20">
      <div className="max-w-xl w-full mx-auto px-4 text-center space-y-6 uppercase tracking-widest text-[10px] text-white/40">
        <span className="font-serif text-5xl md:text-7xl font-light text-[#C5A880] block animate-pulse">
          404
        </span>
        
        <div className="space-y-2">
          <h1 className="font-serif text-lg uppercase text-white tracking-widest">
            Fixture Not Found
          </h1>
          <p className="max-w-xs mx-auto leading-relaxed font-light">
            The path or design layout you are searching for does not exist in Shree Sai Creation&apos;s digital showroom.
          </p>
        </div>

        <div className="w-12 h-[1px] bg-[#C5A880]/30 mx-auto" />

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Button variant="gold">
            <Link href="/shop">Browse Showroom</Link>
          </Button>
          <Button variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
