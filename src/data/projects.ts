export interface Project {
  id: string;
  title: string;
  location: string;
  type: "Hotel" | "Villa" | "Restaurant" | "Luxury Home" | "Commercial Space";
  description: string;
  image: string;
  details: {
    client: string;
    year: string;
    fixtures: string[];
    designer: string;
  };
  gallery: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "The Ritz-Carlton Penthouse Foyer",
    location: "Miami, USA",
    type: "Hotel",
    description: "A breathtaking double-height entryway where multiple Shree Sai Creation Cascade Chandeliers are hung in a custom staggered cluster, illuminating a sleek travertine marble floating staircase.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
    details: {
      client: "Ritz-Carlton Residences",
      year: "2025",
      fixtures: ["Shree Sai Creation Cascade Chandelier (Custom Cluster)"],
      designer: "Studio Andre Fu"
    },
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1200"
    ]
  },
  {
    id: "proj_2",
    title: "Amanu Dining Pavilion",
    location: "Kyoto, Japan",
    type: "Restaurant",
    description: "A minimalist dining setting combining local dark cedar paneling and raw concrete. Six Linear Solstice pendants hang low over the custom oak dining tables to set a warm, intimate mood.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200",
    details: {
      client: "Amanu Hospitality",
      year: "2025",
      fixtures: ["Linear Solstice Dining Pendant"],
      designer: "Kengo Kuma Associates"
    },
    gallery: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200",
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=1200"
    ]
  },
  {
    id: "proj_3",
    title: "The Obsidian Cliffside Villa",
    location: "Santorini, Greece",
    type: "Villa",
    description: "A private luxury residence carved into volcanic cliffside. Integrated Alabaster Eclipse sconces are fitted along textured volcanic stone walls, providing subtle indirect glows that resemble lunar eclipses.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
    details: {
      client: "Private Collection",
      year: "2024",
      fixtures: ["Alabaster Eclipse Sconce", "Luna Alabaster Globe Lamp"],
      designer: "Block722 Architects"
    },
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200"
    ]
  },
  {
    id: "proj_4",
    title: "Marquee Salon Neoclassical Dining",
    location: "London, UK",
    type: "Restaurant",
    description: "A high-end private club in Mayfair. Stately Versailles Statement Chandeliers hang below high ceiling plaster mouldings, projecting brilliant prismatic patterns that accent the modern navy velvet booths.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200",
    details: {
      client: "The Mayfair Group",
      year: "2026",
      fixtures: ["Versailles Crystal Statement Chandelier"],
      designer: "Kelly Wearstler Studio"
    },
    gallery: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=1200"
    ]
  }
];
