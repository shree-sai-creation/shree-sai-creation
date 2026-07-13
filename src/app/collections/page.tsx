"use client";

import React from "react";
import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Compass } from "lucide-react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

const MATERIAL_MAP: Record<string, string> = {
  "the-alabaster-series": "Spanish Alabaster",
  "sculptural-brass": "Solid Brass",
  "celestial-hand-blown-glass": "Hand-Blown Glass",
  "modern-neoclassical-crystal": "Precision Cut Crystal"
};

export default function CollectionsPage() {
  const { theme } = useCart();

  return (
    <div className={`w-full min-h-screen py-16 transition-colors duration-500 overflow-x-hidden ${
      theme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-[#FAF8F5] text-black"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <ScrollReveal variant="slideUp" className="text-center mb-20 max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-[0.35em] uppercase text-[#C9A96E] font-semibold">Curated Aesthetics</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide">Design Series</h1>
          <p className={`text-xs uppercase tracking-widest leading-relaxed max-w-md mx-auto ${
            theme === "dark" ? "text-white/50" : "text-black/55"
          }`}>
            Explore our curated collections crafted from premium earth minerals, architectural brass forms, and mouth-blown crystals.
          </p>
          <div className="w-16 h-[1.5px] bg-[#C9A96E]/40 mx-auto mt-4" />
        </ScrollReveal>

        {/* Collections Alternating Grid */}
        <div className="space-y-24 md:space-y-36">
          {COLLECTIONS.map((col, idx) => {
            const isEven = idx % 2 === 0;
            const targetMaterial = MATERIAL_MAP[col.slug] || "All";
            
            return (
              <div 
                key={col.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                {/* Image Section */}
                <div className={`col-span-1 lg:col-span-7 overflow-hidden rounded-2xl border ${
                  theme === "dark" ? "border-white/5" : "border-black/5"
                } ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 group">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                </div>

                {/* Text Section */}
                <div className={`col-span-1 lg:col-span-5 space-y-6 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] font-bold block">
                    Collection {col.id.replace("col_", "0")}
                  </span>
                  
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide leading-tight">
                    {col.name}
                  </h2>
                  
                  <p className={`text-sm leading-relaxed tracking-wide font-light ${
                    theme === "dark" ? "text-white/60" : "text-black/65"
                  }`}>
                    {col.description}
                  </p>
                  
                  <div className={`flex items-center gap-4 text-xs tracking-wider uppercase font-semibold border-b pb-2 w-max ${
                    theme === "dark" ? "border-white/10 text-white/50" : "border-black/10 text-black/50"
                  }`}>
                    <Compass size={14} className="text-[#C9A96E]" />
                    {col.productCount} Exquisite Pieces
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/shop?material=${targetMaterial}`}
                      className="inline-flex items-center gap-3 bg-[#C9A96E] hover:bg-[#E8D5A3] text-black font-semibold text-[10px] tracking-[0.25em] px-8 py-4 transition-all duration-300 uppercase rounded-none shadow-lg shadow-black/5 group"
                    >
                      Explore Collection 
                      <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
