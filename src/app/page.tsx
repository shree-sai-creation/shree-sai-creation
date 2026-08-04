"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Hammer, 
  Sparkles, 
  Truck, 
  Headphones, 
  Award, 
  Heart, 
  Eye, 
  Scale, 
  ArrowLeft, 
  ArrowRight as ArrowRightIcon 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, Product } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { getStoredProducts, mapBackendProductToFrontend } from "@/utils/db";

// ── Hero slides ──────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: "/landing-page/desktop1.webp",
    eyebrow: "Illuminate Your World",
    headline: "TIMELESS ELEGANCE EXTRAORDINARY LIGHTING",
    sub: "Discover our premium collection of handcrafted chandeliers that blend luxury, innovation and timeless beauty.",
    cta1: { label: "EXPLORE COLLECTION", href: "/shop" },
    cta2: { label: "VIEW PROJECTS", href: "/shop" },
  },
  {
    image: "/landing-page/desktop2.webp",
    eyebrow: "Sculpted Radiance",
    headline: "MAJESTIC GLASS ARTISTRY FOR GRAND SPACES",
    sub: "Precision-cut optical glass prisms designed to refract and capture the perfect golden hour glow.",
    cta1: { label: "EXPLORE COLLECTION", href: "/shop" },
    cta2: { label: "VIEW PROJECTS", href: "/shop" },
  },
  {
    image: "/landing-page/desktop3.webp",
    eyebrow: "Bespoke Masterpieces",
    headline: "HAND FORGED METALS DISTINCT SIGNATURE DETAILS",
    sub: "Each chandelier is individually sculpted by hand to reflect the unique character of your high-end residence.",
    cta1: { label: "EXPLORE COLLECTION", href: "/shop" },
    cta2: { label: "VIEW PROJECTS", href: "/shop" },
  }
];

// ── Categories ──────────────────────────────────────────────
const CATEGORIES = [
  { 
    name: "CHANDELIER", 
    count: 24, 
    img: "/Categories/Chandiler.PNG",
    slug: "Chandelier"
  },
  { 
    name: "INDOOR WALL LAMPS", 
    count: 20, 
    img: "/Categories/Indoor wall lamp.PNG",
    slug: "Indoor wall lamps"
  },
  { 
    name: "LINEAR LIGHTS", 
    count: 14, 
    img: "/Categories/linear-lights.webp",
    slug: "Linear lights"
  },
  { 
    name: "CEILING LIGHTS", 
    count: 16, 
    img: "/Categories/ceiling-lights.PNG",
    slug: "Ceiling lights"
  },
  { 
    name: "INTERNAL PENDANT LIGHTS", 
    count: 18, 
    img: "/Categories/internal-pendant-lights.PNG",
    slug: "Internal pendant lights"
  },
  { 
    name: "OUTDOOR WALL LAMPS", 
    count: 12, 
    img: "/Categories/Outdoor lamp.PNG",
    slug: "Outdoor wall lamps"
  }
];

export default function HomePage() {
  const { theme } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoryCarouselRef = useRef<HTMLDivElement>(null);

  // Auto-advance hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/products?limit=1000", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.products) {
          setProducts(data.products.map(mapBackendProductToFrontend));
        } else {
          setProducts(getStoredProducts());
        }
      } catch (err) {
        console.error("Failed to load products for home page:", err);
        setProducts(getStoredProducts());
      }
    };
    fetchProducts();
  }, []);

  // Filter out the chandeliers for the Best Sellers carousel
  const bestSellers = useMemo(() => {
    return products.filter(p => p.category.toLowerCase() === "chandelier").slice(0, 8);
  }, [products]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const scrollLeftCategory = () => {
    if (categoryCarouselRef.current) {
      categoryCarouselRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRightCategory = () => {
    if (categoryCarouselRef.current) {
      categoryCarouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === "dark" ? "bg-[#060606] text-white" : "bg-[#FAF8F5] text-black"
    }`}>
      
      {/* ════════════════════════════════════════════════════════
          1. HERO SECTION WITH FLOATING RIGHT PANEL
      ════════════════════════════════════════════════════════ */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Slide backgrounds */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: idx === currentSlide ? 1 : 0, zIndex: idx === currentSlide ? 10 : 0 }}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6500ms] ${
                idx === currentSlide ? "scale-[1.03]" : "scale-100"
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Dark overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl text-white">
            {/* Cursive script subtitle */}
            <p className="font-serif !text-[#C9A96E] text-2xl sm:text-3xl italic tracking-wide mb-4 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {HERO_SLIDES[currentSlide].eyebrow}
            </p>
            
            {/* Main heading */}
            <h1 className="font-serif !text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[0.05em] mb-6 max-w-xl drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
              {HERO_SLIDES[currentSlide].headline}
            </h1>
            
            {/* Thin dividing line */}
            <div className="w-16 h-[1.5px] bg-[#C9A96E] mb-6 shadow-sm shadow-black" />

            {/* Description */}
            <p className="text-[11px] sm:text-[12px] !text-white leading-[2] tracking-[0.15em] uppercase font-medium max-w-md mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              {HERO_SLIDES[currentSlide].sub}
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href={HERO_SLIDES[currentSlide].cta1.href}
                className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#E8D5A3] !text-black font-semibold text-[10px] tracking-[0.25em] px-8 py-4 transition-all duration-300 rounded-none shadow-xl shadow-black/50 text-center"
              >
                {HERO_SLIDES[currentSlide].cta1.label}
              </Link>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex items-center gap-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-500 h-[2px] ${
                  i === currentSlide ? "w-8 bg-[#C9A96E]" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>


      </section>

      {/* ════════════════════════════════════════════════════════
          2. TOP TRUST BAR
      ════════════════════════════════════════════════════════ */}
      <section className={`border-y transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d0d0d] border-white/5" : "bg-[#FAF8F5] border-black/5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5 md:divide-black/5">
            {[
              { icon: <Star size={20} className="text-[#C9A96E]" />, title: "TIMELESS DESIGN", sub: "Architectural Beauty" },
              { icon: <Award size={20} className="text-[#C9A96E]" />, title: "PREMIUM QUALITY", sub: "Finest Materials" },
              { icon: <ShieldCheck size={20} className="text-[#C9A96E]" />, title: "SECURE PAYMENT", sub: "100% Secure" },
              { icon: <Headphones size={20} className="text-[#C9A96E]" />, title: "CUSTOMER SUPPORT", sub: "24/7 Support" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-4 py-2 first:pl-0 last:pr-0 justify-center md:justify-start">
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <p className="text-[9.5px] tracking-[0.2em] uppercase font-bold">{item.title}</p>
                  <p className={`text-[8.5px] tracking-wide mt-0.5 ${
                    theme === "dark" ? "text-white/40" : "text-black/45"
                  }`}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. SHOP BY CATEGORY SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="relative flex flex-col items-center mb-12 sm:mb-16">
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-[#C9A96E] font-semibold">Our Collections</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide">Shop By Category</h2>
          </div>
          
          {/* Arrows */}
          <div className="flex items-center gap-3 mt-8 md:absolute md:right-0 md:bottom-2 md:mt-0">
            <button
              onClick={scrollLeftCategory}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                theme === "dark"
                  ? "border-white/10 hover:border-white/30 text-white/55 hover:text-white hover:bg-white/5"
                  : "border-black/10 hover:border-black/30 text-black/55 hover:text-black hover:bg-black/5"
              }`}
              aria-label="Previous Categories"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={scrollRightCategory}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                theme === "dark"
                  ? "border-white/10 hover:border-white/30 text-white/55 hover:text-white hover:bg-white/5"
                  : "border-black/10 hover:border-black/30 text-black/55 hover:text-black hover:bg-black/5"
              }`}
              aria-label="Next Categories"
            >
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>

        {/* Category Carousel Container */}
        <div 
          ref={categoryCarouselRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${cat.slug}`}
              className={`group flex flex-col overflow-hidden transition-all duration-500 w-[75vw] sm:w-[280px] lg:w-[300px] shrink-0 snap-start rounded-2xl border ${
                theme === "dark" 
                  ? "bg-[#0a0a0a] border-white/5 hover:border-[#C9A96E]/40" 
                  : "bg-white border-black/5 hover:border-[#C9A96E]/40 hover:shadow-xl hover:shadow-black/5"
              }`}
            >
              {/* Category Image (Top) */}
              <div className="p-3 sm:p-4 pb-0 w-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/5">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Text & Details (Bottom) */}
              <div className="p-4 sm:p-5 flex flex-col grow justify-between">
                <div>
                  <h3 className={`font-serif text-xl sm:text-2xl font-semibold tracking-wide transition-colors duration-300 group-hover:text-[#C9A96E] ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}>
                    {cat.name}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#C9A96E] my-3 transform origin-left transition-transform duration-500 group-hover:scale-x-150" />
                  <p className={`text-[10px] tracking-[0.2em] uppercase ${
                    theme === "dark" ? "text-white/50" : "text-black/50"
                  }`}>
                    {cat.count} Products
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-[9px] tracking-widest uppercase font-medium transition-colors duration-300 group-hover:text-[#C9A96E] ${
                    theme === "dark" ? "text-white/40" : "text-black/40"
                  }`}>
                    Explore Collection
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:border-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-white ${
                    theme === "dark" ? "border-white/10 text-white/50" : "border-black/10 text-black/50"
                  }`}>
                    <ArrowRight size={13} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>



    </div>
  );
}
