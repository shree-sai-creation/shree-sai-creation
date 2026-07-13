"use client";

import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Hammer, Sparkles, Eye, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-hidden">
      
      {/* 1. Immersive Hero Banner */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 bg-fixed"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-black/30 to-[#0a0a0a]" />

        <div className="relative max-w-3xl mx-auto px-4 space-y-5 z-10">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-medium block">
            House of Shree Sai Creation
          </span>
          <h1 className="font-serif text-4xl md:text-6xl tracking-widest text-white leading-tight">
            Crafting Extraordinary Light
          </h1>
          <p className="text-xs text-white/50 tracking-widest leading-relaxed max-w-xl mx-auto">
            Where traditional artisanship meets architectural ambition — handcrafted in India.
          </p>
          <div className="w-16 h-[1px] bg-[#C9A96E]/40 mx-auto mt-4" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-28">
        
        {/* 2. Brand Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal variant="slideRight" className="space-y-6">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium block">
              Origin Story
            </span>
            <h2 className="font-serif text-3xl tracking-wide text-white leading-snug">
              A Response to Space and Form
            </h2>
            <p className="text-sm text-white/55 tracking-wide leading-[2] font-light">
              Founded in Mumbai, Shree Sai Creation was born out of a desire to create lighting that transcends simple functionality to become architectural sculpture. We believe that light is the single most powerful element in interior design — having the ability to define volume, mood, and texture.
            </p>
            <p className="text-sm text-white/55 tracking-wide leading-[2] font-light">
              Over the years, we have collaborated with master craftsmen across India and sourced premium global materials to develop a library of proprietary textures, crystal formulas, and custom metal finishes that cannot be replicated.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="slideLeft" className="aspect-[4/3] bg-[#111] overflow-hidden border border-white/5 relative">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800"
              alt="Artisanal glass detailing"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </ScrollReveal>
        </section>

        {/* 3. Craftsmanship Detail Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal variant="slideRight" className="md:order-2 space-y-6">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium block">
              The Materials
            </span>
            <h2 className="font-serif text-3xl tracking-wide text-white leading-snug">
              Premium Crystals &amp; Artisan Metals
            </h2>
            <p className="text-sm text-white/55 tracking-wide leading-[2] font-light">
              We source our minerals and crystals from the finest global suppliers. Our crystal drops are high-precision K9 optical grade glass, custom cut and polished to maximise refractive clarity — splitting warm LED light paths into breathtaking ambient rainbows.
            </p>
            <p className="text-sm text-white/55 tracking-wide leading-[2] font-light">
              Each brass component is hand-finished by skilled artisans in our Mumbai workshop, ensuring that every fixture carries the same level of care, precision, and permanence you would expect from a world-class atelier.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="slideLeft" className="md:order-1 aspect-[4/3] bg-[#111] overflow-hidden border border-white/5 relative">
            <img
              src="https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800"
              alt="Crystal craftsmanship"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </ScrollReveal>
        </section>

        {/* 4. Core Pillars */}
        <section className="border-t border-white/5 pt-20">
          <ScrollReveal variant="slideUp" className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] block font-medium">
              Shree Sai Creation Ethos
            </span>
            <h2 className="font-serif text-3xl tracking-widest text-white mt-3">
              Our Creative Pillars
            </h2>
            <div className="w-16 h-[1px] bg-[#C9A96E]/30 mx-auto mt-5" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award size={22} className="text-[#C9A96E]" />,
                title: "Aesthetic Vision",
                desc: "We build design forms that feel heavy, permanent, and architectural — remaining stunning visual highlights in a space even when the lamps are switched off.",
              },
              {
                icon: <Hammer size={22} className="text-[#C9A96E]" />,
                title: "Artisanal Production",
                desc: "Rejecting mass production. Every canopy is forged in limited runs, keeping detail checks high, tolerances tight, and finishing operations artisanally led by skilled craftsmen.",
              },
              {
                icon: <Eye size={22} className="text-[#C9A96E]" />,
                title: "Lighting Warmth",
                desc: "We calibrate our integrated LED arrays strictly to 2700K–3000K warm neutral spectrums with 90+ CRI colour rendering to capture that perfect golden hour ambience.",
              },
            ].map((pillar, i) => (
              <ScrollReveal key={pillar.title} variant="slideUp" delay={i * 0.1} className="space-y-5 p-8 bg-[#0d0d0d] border border-white/5 hover:border-[#C9A96E]/20 transition-colors duration-500">
                {pillar.icon}
                <h3 className="font-serif text-lg text-white tracking-wide">{pillar.title}</h3>
                <p className="text-sm text-white/45 tracking-wide leading-[1.9] font-light">{pillar.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 5. Process Timeline */}
        <section className="border-t border-white/5 pt-20">
          <ScrollReveal variant="slideUp" className="text-center mb-16">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] block font-medium">
              Atelier Pipeline
            </span>
            <h2 className="font-serif text-3xl tracking-widest text-white mt-3">
              Our Process
            </h2>
            <div className="w-16 h-[1px] bg-[#C9A96E]/30 mx-auto mt-5" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Conceptual Sketching", desc: "Developing spatial sketches, analysing ceiling structures, and detailing cable routes for structural harmony." },
              { step: "02", title: "Material Sourcing", desc: "Sourcing premium crystal glass and raw brass ingots from certified global and domestic suppliers." },
              { step: "03", title: "Hand Finishing", desc: "Brushing brass rods and applying gold leaf coatings layer-by-layer for deep, enduring texture." },
              { step: "04", title: "Testing & Assembly", desc: "Calibrating drivers, checking dimming compatibility, and packaging each fixture into protective crates." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} variant="fade" delay={i * 0.1} className="p-7 bg-[#0d0d0d] border border-white/5 hover:border-[#C9A96E]/20 transition-colors duration-500 space-y-4">
                <span className="text-2xl font-serif font-light text-[#C9A96E] block">{item.step}</span>
                <h4 className="font-serif text-sm text-white tracking-wide">{item.title}</h4>
                <p className="text-xs text-white/40 tracking-wide leading-[1.9] font-light">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section className="border-t border-white/5 pt-20">
          <ScrollReveal variant="slideUp" className="relative bg-[#0d0d0d] border border-white/5 p-14 md:p-20 text-center overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-[#C9A96E] rounded-full blur-[100px] opacity-5 pointer-events-none" />
            
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#C9A96E] block mb-4">
              Explore Our Collection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-sm text-white/50 tracking-wide leading-relaxed max-w-md mx-auto mb-10">
              Browse our curated collection of handcrafted chandeliers, pendants, sconces, and architectural lighting pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button variant="gold">
                <Link href="/shop" className="flex items-center gap-2">
                  Browse Showroom <ArrowRight size={14} />
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/contact" className="flex items-center gap-2">
                  Contact Design Team
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </div>
  );
}
