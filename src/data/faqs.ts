export interface FAQItem {
  question: string;
  answer: string;
  category: "Ordering & Customization" | "Shipping & Delivery" | "Installation & Care" | "Warranty & Returns";
}

export const FAQS: FAQItem[] = [
  {
    question: "Do you offer customization for your chandeliers?",
    answer: "Yes. Almost all of our suspension lights and chandeliers can be customized in height (cord lengths), finish, and canopy configurations. Please contact our concierge team at concierge@shreesaicreation.com with your ceiling height and interior details for custom architectural plans.",
    category: "Ordering & Customization"
  },
  {
    question: "What is your typical production lead time?",
    answer: "As each fixture is handcrafted, assembled, and tested individually, our standard production lead time is 6 to 10 weeks. For custom requests or bespoke scale models, the lead time may vary between 12 to 16 weeks.",
    category: "Ordering & Customization"
  },
  {
    question: "Do you ship internationally? How are fragile items packed?",
    answer: "Yes, we ship globally via specialized white-glove carriers. All glass droplets and heavy brass canopies are securely packaged in custom-molded wooden crates to ensure zero-risk transit. Shipping includes tracking, full insurance, and customs clearance support.",
    category: "Shipping & Delivery"
  },
  {
    question: "Is professional installation required for Shree Sai Creation chandeliers?",
    answer: "Yes. Due to the high-end materials, weights (many over 40 lbs), and custom wiring of our statements pieces, we strongly recommend hiring a certified professional electrician. We provide comprehensive technical blueprints, wiring guides, and ceiling reinforcing instructions with every shipment.",
    category: "Installation & Care"
  },
  {
    question: "How should I clean and maintain natural alabaster and brass finishes?",
    answer: "Alabaster is porous and should only be dusted with a dry microfiber cloth; never use liquid detergents or water. For raw brass, it will develop a natural patina over time. You can maintain its satin finish by gently wiping it with specialized dry metal cloths. Always turn off power before cleaning fixtures.",
    category: "Installation & Care"
  },
  {
    question: "What warranty do you offer on integrated LED components?",
    answer: "We offer a 5-year structural and electrical warranty on all lighting components. Our integrated LEDs are rated for 50,000+ hours of operation (approx. 20 years under normal use). If any driver or diode fails, our customer support will dispatch replacement modules immediately.",
    category: "Warranty & Returns"
  }
];
