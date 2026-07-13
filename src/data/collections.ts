export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "col_1",
    name: "The Alabaster Series",
    slug: "the-alabaster-series",
    description: "Carved from premium Spanish alabaster blocks, this series radiates an organic, celestial ambient glow, highlighting the natural stone veins.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
    productCount: 2
  },
  {
    id: "col_2",
    name: "Sculptural Brass",
    slug: "sculptural-brass",
    description: "Satin-finished solid brass lighting designed to function as architectural metal sculptures for modern high-end environments.",
    image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=1200",
    productCount: 3
  },
  {
    id: "col_3",
    name: "Celestial Hand-Blown Glass",
    slug: "celestial-hand-blown-glass",
    description: "Individually mouth-blown amber glass droplets suspended from gold plate structures, casting golden-hour reflections.",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1200",
    productCount: 2
  },
  {
    id: "col_4",
    name: "Modern Neoclassical Crystal",
    slug: "modern-neoclassical-crystal",
    description: "Timeless K9 cut crystal prisms modernized on matte charcoal frameworks to scatter clean rainbow spectra.",
    image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1200",
    productCount: 2
  }
];
