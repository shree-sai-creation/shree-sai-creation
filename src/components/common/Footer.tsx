"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  if (pathname === "/signin" || pathname === "/signup" || pathname === "/admin") {
    return null;
  }

  return (
    <footer className="bg-[rgb(var(--surface))] text-[rgb(var(--text-secondary))] font-sans border-t border-[rgb(var(--border))] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Logo */}
          <div className="flex flex-col items-start space-y-6">
            <Link href="/" className="flex items-center select-none">
              <Logo iconSize={32} goldColor="#C9A96E" />
            </Link>
            <p className="text-[11px] leading-[2] tracking-wider text-[rgb(var(--text-muted))] max-w-sm">
              Shree Sai Creation brings luxury and elegance to your space with our exclusive collection of chandeliers and premium lighting.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-semibold">Quick Links</h4>
            <ul className="space-y-3.5 text-[10.5px] uppercase tracking-[0.2em]">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Terms & Conditions", href: "/terms" }
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-semibold">Customer Service</h4>
            <ul className="space-y-3.5 text-[10.5px] uppercase tracking-[0.2em]">
              {[
                { name: "Track Order", href: "/account" },
                { name: "My Account", href: "/account" },
                { name: "Wishlist", href: "/wishlist" }
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--foreground))] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] font-semibold">Get In Touch</h4>
            <div className="space-y-3.5 text-[10.5px] text-[rgb(var(--text-muted))]">
              <div className="flex items-center gap-2.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A96E] shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+61432784241" className="hover:text-[rgb(var(--foreground))] transition-colors">
                  +61 432 784 241
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A96E] shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <a href="mailto:support@shreesaicreation.com.au" className="hover:text-[rgb(var(--foreground))] transition-colors truncate">
                  support@shreesaicreation.com.au
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A96E] shrink-0 mt-0.5">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="leading-relaxed">
                  Werribee, Melbourne VIC 3030, Australia
                </span>
              </div>
            </div>

            {/* Social Icons inside Get In Touch */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/100087903455888/",
                  svg: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/shreesai__creations?utm_source=qr&igsh=czdmeTA4cHF4eWZr",
                  svg: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  )
                },
                {
                  name: "Email",
                  href: "mailto:support@shreesaicreation.com.au",
                  svg: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  )
                },
                {
                  name: "WhatsApp",
                  href: "https://wa.me/61432784241",
                  svg: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  )
                }
              ].map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--text-muted))] hover:text-[#C9A96E] hover:border-[#C9A96E]/40 hover:scale-105 transition-all duration-200"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright strip */}
        <div className="border-t border-[rgb(var(--border))] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[rgb(var(--text-muted))]">
            &copy; {new Date().getFullYear()} Shree Sai Creation. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
