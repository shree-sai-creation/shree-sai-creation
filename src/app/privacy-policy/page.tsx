"use client";

import React from "react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <ScrollReveal variant="slideUp" className="text-center mb-12">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#C5A880] font-medium block mb-2">
            Legal guidelines
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-widest text-white">
            Privacy Policy
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A880]/30 mx-auto mt-4" />
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal variant="fade" className="space-y-8 uppercase tracking-widest text-[9px] text-white/50 leading-relaxed font-light">
          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              01. Information Collection
            </h3>
            <p>
              We collect information you provide directly to us when purchasing our fixtures, consulting with our concierge service, or enrolling in our design journals. This includes your name, email, shipping address, telephone coordinate, and scale blueprint sketches.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              02. Use of Information
            </h3>
            <p>
              Your coordinates are used strictly to process transactions, manage priority crating logistics, dispatch tracking codes, and send updates regarding custom dimension approvals. We do not distribute or resell database credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              03. Data Security
            </h3>
            <p>
              We implement industry-standard 256-bit Secure Sockets Layer (SSL) encryption protocols for checkout streams. Bank wire transfers are routed direct to our BNP Paribas accounts, bypassing raw merchant servers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xs text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
              04. Cookies & Analytics
            </h3>
            <p>
              We utilize cookies solely to preserve cart selections, wishlist favorites, promo code application coefficients, and general site performance parameters.
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
