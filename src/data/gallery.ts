export interface GalleryItem {
  id: string;
  image: string;
  category: "Chandelier" | "Pendant" | "Sconce" | "Ambient" | "Installation";
  title: string;
  aspect: string; // Tailwind aspect classes e.g. aspect-[3/4]
  location: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal_1",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800",
    category: "Chandelier",
    title: "Artisanal Globe Pendant Clusters",
    aspect: "aspect-[3/4]",
    location: "Private Residence, Geneva"
  },
  {
    id: "gal_2",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800",
    category: "Sconce",
    title: "Alabaster Eclipse Close Up",
    aspect: "aspect-square",
    location: "Hotel lobby, Milan"
  },
  {
    id: "gal_3",
    image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=800",
    category: "Pendant",
    title: "Satin Brass Hoop Geometry",
    aspect: "aspect-[4/3]",
    location: "Corporate Boardroom, Chicago"
  },
  {
    id: "gal_4",
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=800",
    category: "Chandelier",
    title: "Staggered Cascade Installation",
    aspect: "aspect-[2/3]",
    location: "Penthouse Dining, Monaco"
  },
  {
    id: "gal_5",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
    category: "Ambient",
    title: "Golden Hour Glow Reflection",
    aspect: "aspect-[3/4]",
    location: "Luxury Loft, SoHo"
  },
  {
    id: "gal_6",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800",
    category: "Pendant",
    title: "Linear Dining Solstice Detail",
    aspect: "aspect-square",
    location: "Michelin Restaurant, Kyoto"
  },
  {
    id: "gal_7",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800",
    category: "Ambient",
    title: "Warm Overhead Geometric Shadow",
    aspect: "aspect-[2/3]",
    location: "Modern Living Foyer, Zurich"
  },
  {
    id: "gal_8",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
    category: "Installation",
    title: "Fluted Crystal Rod Detail",
    aspect: "aspect-[4/3]",
    location: "Royal Suite, London"
  }
];
