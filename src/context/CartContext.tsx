"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFinish: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, finish?: string) => void;
  removeFromCart: (productId: string, finish: string) => void;
  updateCartQuantity: (productId: string, finish: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discountAmount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  theme: "dark" | "light";
  toggleTheme: () => void;
  
  // Custom global systems
  currency: "USD" | "EUR" | "GBP" | "INR";
  setCurrency: (currency: "USD" | "EUR" | "GBP" | "INR") => void;
  formatPrice: (amount: number) => string;
  language: "EN" | "FR" | "ES";
  setLanguage: (lang: "EN" | "FR" | "ES") => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Sub-component to render client notifications
const ToastList: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-[90vw]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`p-4 shadow-2xl border flex items-center justify-between gap-3 text-[9px] uppercase tracking-widest ${
              t.type === "error"
                ? "bg-[#140b0b] border-red-500/20 text-red-400"
                : t.type === "info"
                ? "bg-[#0b0e14] border-blue-500/20 text-blue-400"
                : "bg-[#0d0d0d] border-white/5 text-[#C5A880]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">
                {t.type === "error" ? (
                  <AlertCircle size={14} />
                ) : t.type === "info" ? (
                  <Info size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}
              </span>
              <span className="text-white/80 font-sans font-light normal-case tracking-wider leading-relaxed">
                {t.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/30 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // New states
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "INR">("INR");
  const [language, setLanguage] = useState<"EN" | "FR" | "ES">("EN");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage after mount to prevent SSR mismatch
  useEffect(() => {
    const savedCart = localStorage.getItem("shree_sai_creation_cart");
    const savedWishlist = localStorage.getItem("shree_sai_creation_wishlist");
    const savedTheme = localStorage.getItem("shree_sai_creation_theme") as "dark" | "light" | null;
    const savedLanguage = localStorage.getItem("shree_sai_creation_language") as "EN" | "FR" | "ES" | null;

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error reading cart from localStorage", e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error reading wishlist from localStorage", e);
      }
    }
    if (savedTheme) {
      setTheme(savedTheme);
      const root = document.documentElement;
      if (savedTheme === "light") {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
    }
    setCurrency("INR");
    if (savedLanguage) setLanguage(savedLanguage as "EN" | "FR" | "ES");
    
    setMounted(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("shree_sai_creation_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("shree_sai_creation_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("shree_sai_creation_theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("shree_sai_creation_currency", currency);
    }
  }, [currency, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("shree_sai_creation_language", language);
    }
  }, [language, mounted]);

  // Toast functions
  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency Formatter — always INR (₹)
  const formatPrice = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (next === "light") {
          root.classList.add("light");
        } else {
          root.classList.remove("light");
        }
      }
      return next;
    });
  };

  const addToCart = (product: Product, quantity = 1, finish = "") => {
    const selectedFinish = finish || product.finish.split(",")[0]?.trim() || "Default";
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFinish === selectedFinish
      );
      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      }
      return [...prev, { product, quantity, selectedFinish }];
    });
    setIsCartOpen(true);
    addToast(`${product.name} added to your order bag.`, "success");
  };

  const removeFromCart = (productId: string, finish: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedFinish === finish)));
    addToast("Item removed from your order bag.", "info");
  };

  const updateCartQuantity = (productId: string, finish: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, finish);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedFinish === finish ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode("");
    setDiscountPercent(0);
    addToast("Order bag cleared successfully.", "info");
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`${product.name} removed from saved coordinates.`, "info");
        return prev.filter((item) => item.id !== product.id);
      }
      addToast(`${product.name} saved to coordinates.`, "success");
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const applyPromoCode = (code: string) => {
    const formatted = code.toUpperCase().trim();
    if (formatted === "SHREE SAI CREATION10") {
      setPromoCode(formatted);
      setDiscountPercent(10);
      addToast("Promo code SHREE SAI CREATION10 applied (10% OFF).", "success");
      return true;
    } else if (formatted === "WELCOME15") {
      setPromoCode(formatted);
      setDiscountPercent(15);
      addToast("Promo code WELCOME15 applied (15% OFF).", "success");
      return true;
    }
    addToast("Invalid promo code key combination.", "error");
    return false;
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.price * (1 - item.product.discount / 100);
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.08; // 8% sales tax
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150; // free shipping over $5000
  const total = taxableAmount + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        promoCode,
        applyPromoCode,
        discountAmount,
        subtotal,
        tax,
        shipping,
        total,
        theme,
        toggleTheme,
        
        // Custom global systems
        currency,
        setCurrency,
        formatPrice,
        language,
        setLanguage,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
      <ToastList toasts={toasts} removeToast={removeToast} />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
