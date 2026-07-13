"use client";

import React from "react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

export default function TermsPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <ScrollReveal variant="slideUp" className="text-center mb-12">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#C5A880] font-medium block mb-2">
            Usage guidelines
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-widest text-white">
            Terms & Conditions
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A880]/30 mx-auto mt-4" />
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal variant="fade" className="space-y-8 uppercase tracking-widest text-[9px] text-white/50 leading-relaxed font-light">
          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              01. Crafting Timelines & Lead Times
            </h3>
            <p>
              As all fixtures are handcrafted individually, Shree Sai Creation quotes standard lead times of 6 to 10 weeks. These are estimations. Large-scale structural modifications or custom drops require design approvals that may extend completion timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              02. Shipping & Crate Deliveries
            </h3>
            <p>
              Deliveries are handled by white-glove logistics agents. Crated boxes must be inspected upon delivery. Any damage incurred during transit must be reported with photographic documentation to concierge@shreesaicreation.com within 48 hours of arrival for claims processing.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              03. Installation Requirements
            </h3>
            <p>
              Shree Sai Creation fixtures require professional structural and electrical installation. Shree Sai Creation is not liable for structural ceiling failures, wiring hazards, or glass breakage resulting from installation by non-certified personnel. Blueprints must be reviewed by certified electricians prior to mounting.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              04. Returns & Custom Blueprints
            </h3>
            <p>
              Customized fixtures, modified downrods, and custom wire drops are final sale and non-refundable. Standard, unmodified catalog models may be returned in their original, unopened crating boxes within 14 days, subject to a 20% restocking fee.
            </p>
          </section>

          <div className="text-center pt-8 text-[8px] text-white/30 border-t border-white/5">
            LAST MODIFIED: JULY 13, 2026 &middot; SHREE SAI CREATION LEGAL OFFICE, PARIS
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
