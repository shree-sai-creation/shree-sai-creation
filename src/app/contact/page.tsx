"use client";

import React, { useState } from "react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Residential",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.inquiryType,
          message: formData.message,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");
      
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", inquiryType: "Residential", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[rgb(var(--background))] min-h-screen text-[rgb(var(--foreground))] font-sans py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <ScrollReveal variant="slideUp" className="text-center mb-20 max-w-2xl mx-auto space-y-5">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-medium block">
            Shree Sai Creation Concierge
          </span>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[rgb(var(--foreground))]">
            Get in Touch
          </h1>
          <p className="text-sm text-[rgb(var(--text-secondary))] tracking-widest leading-relaxed font-light">
            Discuss your lighting project, ceiling dimensions, custom requirements, and delivery arrangements with our design team.
          </p>
          <div className="w-16 h-[1px] bg-[#C9A96E]/30 mx-auto mt-4" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Column 1: Contact Form */}
          <ScrollReveal variant="slideRight" className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] p-8 md:p-10 space-y-6 rounded-2xl">
            <h2 className="font-serif text-xl tracking-wider text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-5">
              Project Consultation Form
            </h2>

            {submitted ? (
              <div className="py-16 text-center space-y-5">
                <div className="inline-flex p-4 bg-white/5 border border-[#C9A96E] text-[#C9A96E] rounded-full">
                  <Check size={28} />
                </div>
                <h4 className="font-serif text-lg text-[rgb(var(--foreground))] tracking-widest">
                  Inquiry Received
                </h4>
                <p className="text-sm text-[rgb(var(--text-secondary))] max-w-xs mx-auto leading-relaxed">
                  Thank you. A Shree Sai Creation design consultant will reach out via your email within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div className="space-y-3">
                  <span className="block text-[9px] font-medium tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">Inquiry Type</span>
                  <div className="flex flex-wrap gap-2">
                    {["Residential", "Interior Designer", "Hospitality / Contract"].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, inquiryType: type })}
                        className={`px-4 py-2 border text-[9px] font-sans font-medium tracking-widest uppercase transition-all rounded-lg ${
                          formData.inquiryType === type
                            ? "bg-[#C9A96E] text-black border-[#C9A96E]"
                            : "bg-transparent text-[rgb(var(--text-muted))] border-[rgb(var(--border))] hover:border-[#C9A96E]/50 hover:text-[rgb(var(--foreground))]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[9px] font-medium tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--text-muted))] px-4 py-3.5 focus:border-[#C9A96E]/50 focus:outline-none text-sm tracking-wide transition-colors rounded-xl"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[9px] font-medium tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--text-muted))] px-4 py-3.5 focus:border-[#C9A96E]/50 focus:outline-none text-sm tracking-wide transition-colors rounded-xl"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-[9px] font-medium tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--text-muted))] px-4 py-3.5 focus:border-[#C9A96E]/50 focus:outline-none text-sm tracking-wide transition-colors rounded-xl"
                      placeholder="+61 412 345 678"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[9px] font-medium tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">Project Brief *</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--text-muted))] px-4 py-3.5 focus:border-[#C9A96E]/50 focus:outline-none text-sm tracking-wide transition-colors resize-none rounded-xl"
                    placeholder="Describe your ceiling height, room type, fixture style, and any specific timeline requirements..."
                    required
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full h-12" isLoading={isLoading}>
                  {!isLoading && (
                    <span className="flex items-center justify-center gap-2">
                      Send Message <Send size={13} />
                    </span>
                  )}
                </Button>
                {errorMsg && (
                  <p className="text-red-400 text-[10px] tracking-widest text-center pt-1">{errorMsg}</p>
                )}
              </form>
            )}
          </ScrollReveal>

          {/* Column 2: Contact Details */}
          <ScrollReveal variant="slideLeft" className="space-y-8">
            {/* Contact Info Block */}
            <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] p-8 space-y-7 rounded-2xl">
              <h3 className="font-serif text-lg tracking-wide text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-4">
                Melbourne Showroom
              </h3>
              
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <MapPin className="text-[#C9A96E] mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[rgb(var(--text-muted))] block mb-1">Location</span>
                    <p className="text-sm text-[rgb(var(--foreground))] leading-relaxed">21 Breezy Cct, Werribee,<br />Melbourne, VIC 3030, Australia</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <Mail className="text-[#C9A96E] mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[rgb(var(--text-muted))] block mb-1">Email</span>
                    <a href="mailto:support@shreesaicreation.com.au" className="text-sm text-[rgb(var(--foreground))] hover:text-[#C9A96E] transition-colors">
                      support@shreesaicreation.com.au
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="text-[#C9A96E] mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[rgb(var(--text-muted))] block mb-1">Phone</span>
                    <a href="tel:+61432784241" className="text-sm text-[rgb(var(--foreground))] hover:text-[#C9A96E] transition-colors">
                      +61 432 784 241
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Clock className="text-[#C9A96E] mt-0.5 shrink-0" size={16} />
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[rgb(var(--text-muted))] block mb-1">Opening Hours</span>
                    <p className="text-sm text-[rgb(var(--foreground))]">Monday – Saturday: 10:00 AM – 7:00 PM</p>
                    <p className="text-sm text-[rgb(var(--text-muted))] mt-1">Sunday: By Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative aspect-[16/9] bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden flex items-center justify-center group select-none">
              <div className="absolute inset-0 bg-cover bg-center opacity-25 transition-transform duration-[4000ms] group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')` }} />
              <div className="absolute inset-0 bg-black/40" />
              
              <div className="relative z-10 text-center space-y-3">
                <div className="inline-flex p-3.5 bg-black/80 border border-[#C9A96E] rounded-full text-[#C9A96E] animate-bounce">
                  <MapPin size={20} />
                </div>
                <p className="font-serif text-sm text-white tracking-widest">Shree Sai Creation Melbourne</p>
                <p className="text-[9px] text-white/70 tracking-widest uppercase">21 Breezy Cct, Werribee · Melbourne, VIC</p>
              </div>
            </div>

            {/* Quick response badge */}
            <div className="bg-[#C9A96E]/5 border border-[#C9A96E]/15 p-5 flex items-start gap-4 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#C9A96E] mt-1.5 animate-pulse shrink-0" />
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A96E] font-medium mb-1">Typically replies within 2 hours</p>
                <p className="text-xs text-[rgb(var(--text-muted))] leading-relaxed">Our design team is available Mon–Sat 10 AM – 7 PM AEST. For urgent inquiries, call us directly.</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
