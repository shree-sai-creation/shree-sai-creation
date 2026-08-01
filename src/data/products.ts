export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  reviews: Review[];
  dimensions: string;
  material: string;
  finish: string;
  bulbs: string;
  stock: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  relatedProducts: string[];
  defaultVariantId?: string;
}

export const CATEGORIES = [
  "All",
  "Chandelier",
  "Indoor wall lamps",
  "Linear lights",
  "Ceiling lights",
  "Internal pendant lights",
  "Outdoor wall lamps"
];

export const PRODUCTS: Product[] = [
  {
    "id": "927328c9-a828-4c97-9a8a-1e68f3abfa7f",
    "name": "Villagrazia Up-Down LED Wall Light",
    "slug": "villagrazia-up-down-led-wall-light",
    "description": "The Villagrazia Up-Down LED Wall Light delivers elegant tri-color illumination with a clean architectural profile. Its modern design enhances villas, gardens, pathways, and commercial exteriors while providing balanced upward and downward lighting for a premium appearance.",
    "category": "Chandelier",
    "price": 250,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Width: 10 cm | Height: 80 cm",
    "material": "",
    "finish": "",
    "bulbs": "Light: tri-colour",
    "stock": 15,
    "images": [
      "/uploads/1785337269099_external-wall-light--05072026-6-image_1785337269099.jpg",
      "/uploads/1785337268861_external-wall-light--05072026-6-image-12-_1785337268861.jpg",
      "/uploads/1785337275843_chatgpt-image-jul-29--2026--12-46-53-pm_1785337275843.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Width: 10 cm | Height: 80 cm",
      "Bulbs Required": "Light: tri-colour",
      "Bulbs": "Light: tri-colour"
    },
    "relatedProducts": []
  },
  {
    "id": "683b20dd-afb2-46fe-9bff-c8c6f985d603",
    "name": "Hollis 36 Exterior Wall Light",
    "slug": "hollis-36-exterior-wall-light",
    "description": "The Hollis 36 Exterior Wall Light offers modern styling with tri-color LED illumination in a compact, elegant design. Perfect for entrances, patios, pathways, and balconies, it provides stylish exterior lighting while complementing contemporary architecture.",
    "category": "Chandelier",
    "price": 100,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 36 cm | Width: 12 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785337184906_whatsapp-image-2026-07-29-at-8-18-22-pm_1785337184906.jpeg",
      "/uploads/1785337185292_whatsapp-image-2026-07-29-at-8-18-23-pm_1785337185292.jpg",
      "/uploads/1785337184808_whatsapp-image-2026-07-29-at-8-18-24-pm_1785337184808.jpeg",
      "/uploads/1785337195156_whatsapp-image-2026-07-29-at-8-18-22-pm--1-_1785337195156.jpeg",
      "/uploads/1785337195178_whatsapp-image-2026-07-29-at-8-18-22-pm--2-_1785337195178.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 36 cm | Width: 12 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "aaf224e6-91bd-49a6-b11c-109d90def1e0",
    "name": "Noctra Outdoor Wall Sconce",
    "slug": "noctra-outdoor-wall-sconce",
    "description": "The Noctra Outdoor Wall Sconce combines acrylic glass with a sleek black finish to create contemporary exterior lighting. Its tri-color illumination makes it ideal for patios, entryways, garages, balconies, and modern residential or commercial buildings.",
    "category": "Chandelier",
    "price": 100,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 45 cm | Width: 12 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335867699_external-wall-light--05072026-6-image_1785335867697.jpg",
      "/uploads/1785335867658_external-wall-light--05072026-6-image-10-_1785335867658.jpg",
      "/uploads/1785335873973_chatgpt-image-jul-29--2026--12-42-50-pm_1785335873973.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 45 cm | Width: 12 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "5b32b984-9dd7-48ce-b9d6-20ba3604305a",
    "name": "Classical Outdoor Wall Lamp",
    "slug": "classical-outdoor-wall-lamp",
    "description": "Bring timeless elegance to your outdoor spaces with this classical waterproof wall lamp. Featuring tri-color lighting and a durable black finish, it provides reliable illumination for entrances, patios, balconies, and exterior architectural walls.",
    "category": "Chandelier",
    "price": 200,
    "discount": 35,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 58 cm | Width: 18 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335796093_upscalemedia-transformed--1-_1785335796093.jpg",
      "/uploads/1785335796145_upscalemedia-transformed--2-_1785335796144.jpg",
      "/uploads/1785335796004_upscalemedia-transformed--3-_1785335795967.jpg",
      "/uploads/1785335796078_upscalemedia-transformed--4-_1785335796046.jpg",
      "/uploads/1785335795917_upscalemedia-transformed_1785335795917.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 58 cm | Width: 18 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "47aaeb06-65e9-49dc-b968-6c276e7564be",
    "name": "Lantern of Time Wall Lamp",
    "slug": "lantern-of-time-wall-lamp",
    "description": "Inspired by timeless lantern styling, this outdoor waterproof wall lamp features a built-in dusk sensor and tri-color lighting. Its elegant black and gold finish makes it an excellent choice for entrances, gardens, patios, and traditional or modern homes.",
    "category": "Chandelier",
    "price": 175,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 58 cm | Width: 20 cm",
    "material": "",
    "finish": "black/gold",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335710142_chatgpt-image-jul-29--2026--12-40-53-pm_1785335710106.jpg",
      "/uploads/1785335709806_external-wall-light--05072026-6-image_1785335709806.jpg",
      "/uploads/1785335709810_external-wall-light--05072026-6-image-8-_1785335709810.jpg",
      "/uploads/1785335709992_external-wall-light--05072026-6-image1_1785335709992.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 58 cm | Width: 20 cm",
      "Finish Options": "black/gold",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black/gold",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "774d747b-8d4d-4022-94fd-852704fae2ed",
    "name": "Modern Porch Wall Light",
    "slug": "modern-porch-wall-light",
    "description": "This modern porch wall light features frosted acrylic construction with tri-color LED illumination. Designed for front doors, patios, decks, and gardens, it combines elegant styling with reliable performance to enhance any contemporary exterior.",
    "category": "Chandelier",
    "price": 125,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 75 cm | Width: 12 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335578314_upscalemedia-transformed--1-_1785335578314.jpeg",
      "/uploads/1785335578520_upscalemedia-transformed--2-_1785335578520.jpg",
      "/uploads/1785335578611_upscalemedia-transformed--3-_1785335578610.jpg",
      "/uploads/1785335578772_upscalemedia-transformed-3_1785335578772.jpg",
      "/uploads/1785335578416_upscalemedia-transformed_1785335578416.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 75 cm | Width: 12 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "b830c231-7151-412c-8951-ff7a499e0b6b",
    "name": "Villagrazia LED Outdoor Wall Light",
    "slug": "villagrazia-led-outdoor-wall-light",
    "description": "The Villagrazia LED outdoor wall light features elegant tri-color illumination and a sleek architectural profile. Available in multiple sizes, it enhances modern homes, villas, pathways, and commercial buildings with stylish and reliable exterior lighting.",
    "category": "Chandelier",
    "price": 1500,
    "discount": 0,
    "rating": 5,
    "reviews": [],
    "dimensions": "Width: 12/12/14 | Height: 40/60/80",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335466455_external-wall-light--05072026-6-image_1785335466455.jpg",
      "/uploads/1785335466561_external-wall-light--05072026-6-image-6-_1785335466560.jpg",
      "/uploads/1785335466722_external-wall-light--05072026-6-image1_1785335466722.jpg",
      "/uploads/1785335466672_external-wall-light--05072026-6-image2_1785335466672.jpg",
      "/uploads/1785335466550_external-wall-light--05072026-6-image3_1785335466550.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Width: 12/12/14 | Height: 40/60/80",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "0c80d904-d350-4839-bdb2-9de2a5cff069",
    "name": "Outdoor Pillar Wall Light",
    "slug": "outdoor-pillar-wall-light",
    "description": "Designed for pillars, garden walls, and exterior landscapes, this elegant outdoor light offers tri-color illumination in multiple heights. Its slim contemporary profile complements modern architecture while providing stylish decorative lighting for residential and commercial spaces.",
    "category": "Chandelier",
    "price": 100,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Height: 60 cm / 100 cm / 120 cm | Width: 8 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Tri Color",
    "stock": 15,
    "images": [
      "/uploads/1785335282299_upscalemedia-transformed--1-_1785335282299.jpg",
      "/uploads/1785335282581_upscalemedia-transformed--2-_1785335282581.jpg",
      "/uploads/1785335282213_upscalemedia-transformed--3-_1785335282213.jpg",
      "/uploads/1785335281914_upscalemedia-transformed_1785335281913.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Height: 60 cm / 100 cm / 120 cm | Width: 8 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Tri Color",
      "Finish": "black",
      "Bulbs": "Light- Tri Color"
    },
    "relatedProducts": []
  },
  {
    "id": "1a081ebb-463f-4b1e-a998-7245d19e13be",
    "name": "Dual Head Outdoor Wall Light",
    "slug": "dual-head-outdoor-wall-light",
    "description": "Featuring dual adjustable heads, this outdoor wall light provides focused warm white illumination exactly where it's needed. Its sleek black finish and contemporary design make it perfect for patios, entrances, balconies, and exterior feature walls.",
    "category": "Chandelier",
    "price": 75,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Adjustable Head Design",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Warm White",
    "stock": 15,
    "images": [
      "/uploads/1785333531526_upscalemedia-transformed--3-_1785333531523.jpg",
      "/uploads/1785335173329_whatsapp-image-2026-07-29-at-7-46-08-pm--2-_1785335173329.jpeg",
      "/uploads/1785335184167_whatsapp-image-2026-07-29-at-7-46-07-pm_1785335184167.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Adjustable Head Design",
      "Finish Options": "black",
      "Bulbs Required": "Light- Warm White",
      "Finish": "black",
      "Bulbs": "Light- Warm White"
    },
    "relatedProducts": []
  },
  {
    "id": "b2598e95-8739-4fb6-a46c-57b943a08613",
    "name": "Heavy-Duty Outdoor Wall Light",
    "slug": "heavy-duty-outdoor-wall-light",
    "description": "Built for durability and modern style, this heavy-duty outdoor wall light features an up-down lighting design with an included tri-color E27 globe. Its robust construction makes it ideal for exterior walls, garages, entrances, and commercial properties.",
    "category": "Chandelier",
    "price": 100,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Width: 9 cm | Height: 26 cm",
    "material": "",
    "finish": "black",
    "bulbs": "E27 Globe (Tri color - included)",
    "stock": 15,
    "images": [
      "/uploads/1785333415491_upscalemedia-transformed_1785333415478.jpg",
      "/uploads/1785333441665_upscalemedia-transformed--2-_1785333441665.jpg",
      "/uploads/1785335130987_whatsapp-image-2026-07-29-at-7-46-08-pm_1785335130987.jpeg",
      "/uploads/1785335137467_whatsapp-image-2026-07-29-at-7-46-08-pm--1-_1785335137467.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Width: 9 cm | Height: 26 cm",
      "Finish Options": "black",
      "Bulbs Required": "E27 Globe (Tri color - included)",
      "Finish": "black",
      "Bulbs": "E27 Globe (Tri color - included)"
    },
    "relatedProducts": []
  },
  {
    "id": "c2f8f21d-37b5-4305-8fa7-db826d65795c",
    "name": "Up-Down Outdoor Wall Light",
    "slug": "up-down-outdoor-wall-light",
    "description": "This sleek up-down outdoor wall light delivers warm white illumination with a minimalist contemporary design. Available in two wattages, it creates beautiful architectural lighting effects while enhancing exterior walls, balconies, gardens, pathways, and entrance areas.",
    "category": "Chandelier",
    "price": 25,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Length – 17/30 cm, Height – 8/10 cm",
    "material": "",
    "finish": "black",
    "bulbs": "Light- Warm White",
    "stock": 15,
    "images": [
      "/uploads/1785333312158_upscalemedia-transformed--2-_1785333312158.jpeg",
      "/uploads/1785333312315_upscalemedia-transformed--3-_1785333312315.jpg",
      "/uploads/1785333312371_upscalemedia-transformed_1785333312371.jpg",
      "/uploads/1785335113433_whatsapp-image-2026-07-29-at-7-46-08-pm--3-_1785335113433.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Length – 17/30 cm, Height – 8/10 cm",
      "Finish Options": "black",
      "Bulbs Required": "Light- Warm White",
      "Finish": "black",
      "Bulbs": "Light- Warm White"
    },
    "relatedProducts": []
  },
  {
    "id": "cfae5c5a-93af-438d-852a-c23f49509bb6",
    "name": "Spanish Marble Outdoor Wall Light",
    "slug": "spanish-marble-outdoor-wall-light",
    "description": "Crafted with elegant Spanish natural marble, this premium outdoor wall light combines luxurious aesthetics with reliable LED illumination. Featuring tri-color lighting and a sophisticated black and white finish, it enhances entrances, patios, balconies, and exterior walls with timeless modern style.",
    "category": "Chandelier",
    "price": 200,
    "discount": 30,
    "rating": 5,
    "reviews": [],
    "dimensions": "Length: 45 cm",
    "material": "",
    "finish": "black-white",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785333220163_upscalemedia-transformed--1-_1785333220141.jpg",
      "/uploads/1785333220228_upscalemedia-transformed--2-_1785333220221.jpg",
      "/uploads/1785333220275_upscalemedia-transformed--3-_1785333220275.jpg",
      "/uploads/1785333220289_upscalemedia-transformed_1785333220289.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Length: 45 cm",
      "Finish Options": "black-white",
      "Finish": "black-white"
    },
    "relatedProducts": []
  },
  {
    "id": "4e5982fb-90fb-4438-bdcc-c36b2d0eb093",
    "name": "Ginkgo Leaves Ceramic Chandelier",
    "slug": "ginkgo-leaves-ceramic-chandelier",
    "description": "Inspired by natural ginkgo leaves, this extraordinary ceramic chandelier showcases over 500 decorative ceramic pieces. Its grand scale and elegant craftsmanship make it an exceptional centerpiece for luxury homes, hotel lobbies, banquet halls, and premium commercial interiors.",
    "category": "Chandelier",
    "price": 5000,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 120 cm | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317975516_upscalemedia-transformed--1-_1785317975516.jpg",
      "/uploads/1785317975890_upscalemedia-transformed--2-_1785317975890.jpg",
      "/uploads/1785317975838_upscalemedia-transformed--3-_1785317975838.jpg",
      "/uploads/1785317976007_upscalemedia-transformed_1785317976007.jpg",
      "/uploads/1785317975396_upscalemedia-transformed1_1785317975396.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 120 cm | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "68fd41bb-e9e6-4736-bcf9-68bbae02ae9b",
    "name": "Genevieve 37-Light Pendant",
    "slug": "genevieve-37-light-pendant",
    "description": "The Genevieve 37-Light Pendant combines elegant contemporary styling with brilliant illumination. Featuring tri-color lighting, remote control, and an adjustable suspension, it is designed to become the focal point of grand foyers, staircases, and luxury living spaces.",
    "category": "Chandelier",
    "price": 2250,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317836116_chatgpt-image-jul-29--2026--12-11-07-pm_1785317836116.jpg",
      "/uploads/1785317836392_upscalemedia-transformed--2-_1785317836392.jpg",
      "/uploads/1785317841520_chatgpt-image-jul-29--2026--12-11-17-pm_1785317841520.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "107d547f-2931-4f57-b365-d4fc6d5d0564",
    "name": "Spiral Bubble Crystal Chandelier",
    "slug": "spiral-bubble-crystal-chandelier",
    "description": "Featuring elegant crystal glass rods arranged in a striking spiral bubble design, this chandelier creates an unforgettable statement. Complete with tri-color lighting, remote control, and fifty lights, it is ideal for villas, staircases, and luxury hotel interiors.",
    "category": "Chandelier",
    "price": 2875,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 100 cm | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317779661_upscalemedia-transformed--1-_1785317779661.jpg",
      "/uploads/1785317779514_upscalemedia-transformed_1785317779514.jpg",
      "/uploads/1785317780235_upscalemedia-transformed_1785317780235.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 100 cm | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "9c6b70a2-9c3c-4066-984a-fd2cedc73993",
    "name": "Jura 6-Tier Pendant",
    "slug": "jura-6-tier-pendant",
    "description": "Elevate your interior with the Jura 6-Tier Pendant, featuring tri-color LED lighting and remote control. Designed for grand staircases and luxury foyers, its impressive six-tier arrangement creates spectacular illumination and exceptional visual impact.",
    "category": "Chandelier",
    "price": 2500,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 100 cm | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317689494_upscalemedia-transformed_1785317689493.jpg",
      "/uploads/1785318144169_upscalemedia-transformed--5-_1785318144169.jpeg",
      "/uploads/1785318147629_upscalemedia-transformed--1-_1785318147628.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 100 cm | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "ca05862e-887b-4792-9aec-f0b3fe3003ac",
    "name": "Glitz 8-Tier Pendant Light",
    "slug": "glitz-8-tier-pendant-light",
    "description": "The Glitz 8-Tier Pendant Light combines layered elegance with contemporary styling. Featuring an adjustable chain and premium metallic finish, it delivers brilliant illumination while serving as a stunning centerpiece for staircases, dining rooms, and luxury living spaces.",
    "category": "Chandelier",
    "price": 1000,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Chandelier Height: 1.2 m | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317599098_upscalemedia-transformed--1-_1785317599098.jpeg",
      "/uploads/1785317599357_upscalemedia-transformed--2-_1785317599357.jpg",
      "/uploads/1785317599241_upscalemedia-transformed--3-_1785317599241.jpg",
      "/uploads/1785317599439_upscalemedia-transformed--4-_1785317599439.jpeg",
      "/uploads/1785317599775_upscalemedia-transformed_1785317599775.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Chandelier Height: 1.2 m | Adjustable Chain: 1.5 m",
      "Finish Options": "black, gold",
      "Finish": "black, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "bdb08445-d3eb-4908-a13e-d31c19161654",
    "name": "Luxury Foyer Hanging Chandelier",
    "slug": "luxury-foyer-hanging-chandelier",
    "description": "Designed specifically for staircases, entryways, and double-storey spaces, this elegant hanging chandelier creates a luxurious visual impact. Its adjustable chain and premium finish provide both versatility and timeless style for upscale residential and commercial interiors.",
    "category": "Chandelier",
    "price": 1250,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Chandelier Height: 2.8 m / 3.3 m | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black-gold, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317521625_upscalemedia-transformed--1-_1785317521625.jpg",
      "/uploads/1785317521879_upscalemedia-transformed--2-_1785317521878.jpg",
      "/uploads/1785317521639_upscalemedia-transformed--3-_1785317521638.jpg",
      "/uploads/1785317521513_upscalemedia-transformed-2_1785317521513.jpg",
      "/uploads/1785317521694_upscalemedia-transformed_1785317521693.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Chandelier Height: 2.8 m / 3.3 m | Adjustable Chain: 1.5 m",
      "Finish Options": "black-gold, gold",
      "Finish": "black-gold, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "27482386-ccf9-4a45-951c-d7dd66a49bba",
    "name": "15-Ring Donut Crystal Chandelier",
    "slug": "15-ring-donut-crystal-chandelier",
    "description": "Make a dramatic statement with this fifteen-ring crystal chandelier featuring a modern donut-inspired design. Crafted for foyers and staircases, its elegant gold finish and adjustable suspension create a luxurious centerpiece for contemporary interiors.",
    "category": "Chandelier",
    "price": 1875,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Sizes: 25/30/40 cm | 15 Rings | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317419294_4-1-_1785317419294.jpg",
      "/uploads/1785317419109_4_1785317419109.jpeg",
      "/uploads/1785317419997_upscalemedia-transformed--1-_1785317419997.jpg",
      "/uploads/1785317419419_upscalemedia-transformed--2-_1785317419419.jpg",
      "/uploads/1785317419940_upscalemedia-transformed_1785317419940.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Sizes: 25/30/40 cm | 15 Rings | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "57d56d17-2535-45e8-837c-dd6e8c456b3d",
    "name": "Crystal Geometric LED Chandelier",
    "slug": "crystal-geometric-led-chandelier",
    "description": "Designed with six crystal rings featuring three-sided crystal detailing, this luxurious geometric chandelier offers tri-color LED lighting and remote operation. Its impressive scale makes it perfect for grand staircases, hotel lobbies, and premium residential interiors.",
    "category": "Chandelier",
    "price": 1875,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Sizes: 100/80/60/50/40/30 cm | Adjustable Length: 4 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317302099_3--1-_1785317302098.jpeg",
      "/uploads/1785317302215_3--2-_1785317302215.jpg",
      "/uploads/1785317302356_3--2-_1785317302356.jpg",
      "/uploads/1785317308163_3--1-_1785317308163.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Sizes: 100/80/60/50/40/30 cm | Adjustable Length: 4 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "d072e4d0-0b7d-475d-838b-4e68b4c35cf0",
    "name": "LED Geometric 6-Ring Chandelier",
    "slug": "led-geometric-6-ring-chandelier",
    "description": "Featuring six elegant LED rings with tri-color lighting and remote control, this geometric chandelier is designed for high ceilings. Its adjustable 3.5-meter suspension makes it an impressive centerpiece for staircases, foyers, villas, and luxury commercial spaces.",
    "category": "Chandelier",
    "price": 1450,
    "discount": 38,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Sizes: 100/80/60/50/40/20 cm | Adjustable Length: 3.5 m",
    "material": "",
    "finish": "silver, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785317206837_2--1-_1785317206837.jpg",
      "/uploads/1785317206301_2--2-_1785317206301.png",
      "/uploads/1785317206652_2--3-_1785317206652.jpg",
      "/uploads/1785317206496_2--4-_1785317206496.jpg",
      "/uploads/1785317206445_2--5-_1785317206445.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Sizes: 100/80/60/50/40/20 cm | Adjustable Length: 3.5 m",
      "Finish Options": "silver, gold",
      "Finish": "silver, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "d3853853-6aaa-4d54-a8bc-4b711e7e6a90",
    "name": "Azzurra Chandelier",
    "slug": "azzurra-chandelier",
    "description": "The Azzurra Chandelier is a luxurious statement piece featuring a sophisticated brass finish and elegant contemporary styling. Designed for premium interiors, its adjustable hanging rod and refined craftsmanship create an impressive focal point while delivering exceptional ambient lighting.",
    "category": "Chandelier",
    "price": 3398,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Height: 20 cm | Adjustable Rod: 150 cm",
    "material": "",
    "finish": "brass",
    "bulbs": "",
    "stock": 13,
    "images": [
      "/uploads/1785248937063_36--1-_1785248937062.jpg",
      "/uploads/1785248937122_36--2-_1785248937121.jpg",
      "/uploads/1785248936777_36--3-_1785248936777.jpg",
      "/uploads/1785248936456_36--4-_1785248936456.jpg",
      "/uploads/1785248937112_36_1785248937112.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Height: 20 cm | Adjustable Rod: 150 cm",
      "Finish Options": "brass",
      "Finish": "brass"
    },
    "relatedProducts": []
  },
  {
    "id": "d7aa4903-b477-44de-8e01-bc24410f90d2",
    "name": "Calamette Glass Chandelier",
    "slug": "calamette-glass-chandelier",
    "description": "The Calamette Glass Chandelier showcases elegant brass detailing paired with a refined round glass design. Its adjustable hanging rod and sophisticated appearance make it an outstanding lighting choice for luxury residences, boutique hotels, restaurants, and premium commercial spaces.",
    "category": "Chandelier",
    "price": 2798,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Height: 20 cm | Adjustable Rod: 150 cm",
    "material": "",
    "finish": "brass",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248872575_35--1-_1785248872575.jpg",
      "/uploads/1785248872452_35--2-_1785248872452.jpg",
      "/uploads/1785248872206_35--3-_1785248872206.jpg",
      "/uploads/1785248872589_35_1785248872589.jpg",
      "/uploads/1785312604626_chatgpt-image-jul-29--2026--01-39-53-pm_1785312604626.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Height: 20 cm | Adjustable Rod: 150 cm",
      "Finish": "brass",
      "Finish Options": "brass"
    },
    "relatedProducts": []
  },
  {
    "id": "4c108d5b-b979-4817-b5dc-bed10d3a2434",
    "name": "Spanish Alabaster Chandelier",
    "slug": "spanish-alabaster-chandelier",
    "description": "Crafted from solid brass with beautifully layered natural Spanish alabaster, this premium chandelier offers timeless elegance and refined craftsmanship. Its luxurious materials and sophisticated design make it an exceptional centerpiece for upscale homes, boutique hotels, and designer interiors.",
    "category": "Chandelier",
    "price": 1332,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Height: 18.5 cm | Adjustable Chain: 150 cm",
    "material": "",
    "finish": "brass",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248799198_34--1-_1785248799197.jpg",
      "/uploads/1785248799341_34_1785248799341.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Height: 18.5 cm | Adjustable Chain: 150 cm",
      "Finish Options": "brass",
      "Finish": "brass"
    },
    "relatedProducts": []
  },
  {
    "id": "d1f076ce-ac96-4838-ace5-8fe3c931a766",
    "name": "Aurora NewYork Three-Tier Chandelier",
    "slug": "aurora-newyork-three-tier-chandelier",
    "description": "The Aurora NewYork Three-Tier Chandelier combines layered elegance with contemporary luxury. Featuring an adjustable hanging chain and premium metallic finish, it provides stunning illumination while becoming the focal point of dining rooms, foyers, staircases, and luxury living spaces.",
    "category": "Chandelier",
    "price": 1000,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 50 cm / 60 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "silver, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248719264_33--1-_1785248719264.jpg",
      "/uploads/1785248719185_33_1785248719185.jpg",
      "/uploads/1785248732643_33--2-_1785248732642.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 50 cm / 60 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "silver, gold",
      "Finish": "silver, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "18f7dffc-3c83-4cc0-945f-bd750a5a9931",
    "name": "Luxury Crystal Ring Chandelier XL",
    "slug": "luxury-crystal-ring-chandelier-xl",
    "description": "Designed for large luxury spaces, this crystal ring chandelier features a multi-ring design with an extended adjustable suspension. Complete with remote control and premium crystal accents, it creates a spectacular focal point for staircases, hotel lobbies, and grand residential interiors.",
    "category": "Chandelier",
    "price": 1000,
    "discount": 30,
    "rating": 5,
    "reviews": [],
    "dimensions": "Dimensions: Ring Sizes: 60/40 cm or 80/60 cm | Adjustable Length: 2 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248580792_32--2-_1785248580791.jpg",
      "/uploads/1785248589619_32--1-_1785248589619.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Dimensions: Ring Sizes: 60/40 cm or 80/60 cm | Adjustable Length: 2 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "5b51f69e-a0a8-4243-9ef2-4aa30d7afe9c",
    "name": "French Premium Chandelier",
    "slug": "french-premium-chandelier",
    "description": "Inspired by classic French luxury, this premium chandelier brings timeless elegance to modern interiors. Its refined gold finish, adjustable hanging chain, and sophisticated design make it a perfect centerpiece for dining rooms, foyers, living rooms, and upscale commercial spaces.",
    "category": "Chandelier",
    "price": 800,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248498250_31_1785248498250.jpg",
      "/uploads/1785248504908_31--1-_1785248504908.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "fc04e8ba-832c-4e92-9d7f-0e1bd9da6bb6",
    "name": "K9 Crystal Drum Chandelier",
    "slug": "k9-crystal-drum-chandelier",
    "description": "Crafted with top-grade diamond-cut crystals and premium K9 crystal elements, this drum chandelier delivers luxurious brilliance and modern elegance. Its sophisticated ceiling-mounted design makes it a stunning centerpiece for dining rooms, living areas, hotels, and upscale interiors.",
    "category": "Chandelier",
    "price": 732,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248435676_30--1-_1785248435676.jpg",
      "/uploads/1785248435346_30--2-_1785248435346.jpg",
      "/uploads/1785248435205_30--3-_1785248435205.jpg",
      "/uploads/1785248435067_30--4-_1785248435067.jpg",
      "/uploads/1785248435768_30_1785248435768.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "57853ffb-a552-44e3-9090-1df7dbf236ac",
    "name": "Vienna Flush Mount Chandelier",
    "slug": "vienna-flush-mount-chandelier",
    "description": "Bring timeless elegance into your home with the Vienna Collection Flush Mount Chandelier. Its luxurious gold finish and sophisticated ceiling-mounted design create a refined focal point while delivering beautiful illumination for contemporary living spaces.",
    "category": "Chandelier",
    "price": 800,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Height: 50 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248327834_29--1-_1785248327834.jpg",
      "/uploads/1785248327386_29--2-_1785248327386.jpg",
      "/uploads/1785248327123_29--3-_1785248327123.jpg",
      "/uploads/1785312806105_upscalemedia-transformed--1-_1785312806104.jpg",
      "/uploads/1785312806456_upscalemedia-transformed_1785312806456.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Height: 50 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "692b2363-818d-43a3-9133-fd58314a86b2",
    "name": "Jordan Flush Mount Chandelier",
    "slug": "jordan-flush-mount-chandelier",
    "description": "The Jordan Collection Flush Mount Chandelier combines clean contemporary styling with a premium finish. Designed for modern interiors, it provides excellent illumination while maintaining a sleek ceiling-mounted profile that's perfect for living rooms, dining rooms, and luxury apartments.",
    "category": "Chandelier",
    "price": 750,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm | Height: 50 cm",
    "material": "",
    "finish": "black, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248242140_28--1-_1785248242140.jpg",
      "/uploads/1785248242205_28--2-_1785248242205.jpg",
      "/uploads/1785248242216_28--3-_1785248242216.jpg",
      "/uploads/1785248241664_28--4-_1785248241664.jpg",
      "/uploads/1785248242252_28_1785248242252.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm | Height: 50 cm",
      "Finish Options": "black, gold",
      "Finish": "black, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "57e21310-2859-40b9-b55c-646c328cf4ac",
    "name": "Arina Crystal Ceiling Light",
    "slug": "arina-crystal-ceiling-light",
    "description": "The Arina Crystal Ceiling Light showcases an elegant double-layer design with smoky gray and K9 crystal accents. Its refined appearance and ceiling-mounted construction make it a beautiful lighting solution for contemporary homes seeking luxurious style and exceptional illumination.",
    "category": "Chandelier",
    "price": 625,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248180926_27--1-_1785248180926.jpg",
      "/uploads/1785248180634_27--2-_1785248180634.jpg",
      "/uploads/1785248180331_27--3-_1785248180331.jpg",
      "/uploads/1785248180932_27--4-_1785248180932.jpg",
      "/uploads/1785248180114_27_1785248180114.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "76ccf174-fc99-4ee5-9363-fef85b7541e6",
    "name": "Double Layer Crystal Chandelier",
    "slug": "double-layer-crystal-chandelier",
    "description": "Featuring a stunning double-layer crystal arrangement, this flush mount chandelier adds elegance and brilliance to modern interiors. Its sophisticated gold finish and premium crystal detailing make it a perfect choice for living rooms, dining areas, and luxurious residential spaces.",
    "category": "Chandelier",
    "price": 750,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 40cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785248021928_26--2-_1785248021928.jpg",
      "/uploads/1785248022060_26_1785248022060.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 40cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "f17f985d-7da1-41a7-b889-2ee693c1ff2d",
    "name": "Raven Crystal Chandelier",
    "slug": "raven-crystal-chandelier",
    "description": "The Raven Crystal Chandelier features a luxurious blend of sparkling crystals and contemporary styling. Designed with an adjustable chain and elegant finishes, it creates an eye-catching focal point while providing brilliant illumination for sophisticated residential and commercial spaces.",
    "category": "Chandelier",
    "price": 750,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black/gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247922231_25--1-_1785247922231.jpg",
      "/uploads/1785247922696_25_1785247922696.jpg",
      "/uploads/1785247928497_25--2-_1785247928497.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "black/gold",
      "Finish": "black/gold"
    },
    "relatedProducts": []
  },
  {
    "id": "8fada671-6c03-4455-8fe9-9a85f25faca1",
    "name": "Modern Crystal LED Chandelier",
    "slug": "modern-crystal-led-chandelier",
    "description": "Designed to impress, this modern crystal LED chandelier combines elegant crystal detailing with a sleek contemporary silhouette. Its adjustable suspension and premium finish make it a striking centerpiece for dining rooms, foyers, luxury living spaces, and commercial interiors.",
    "category": "Chandelier",
    "price": 1000,
    "discount": 35,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 80 cm / 95 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247829273_24_1785247829273.jpg",
      "/uploads/1785247833804_24--1-_1785247833804.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 80 cm / 95 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "9065ae5f-d867-4420-a7b6-e6f3d385328d",
    "name": "Modern Acrylic Crystal Chandelier",
    "slug": "modern-acrylic-crystal-chandelier",
    "description": "Designed with premium acrylic and crystal elements, this modern chandelier provides elegant illumination with three adjustable color temperatures. Its sleek gold finish and adjustable suspension make it a perfect centerpiece for dining rooms, living areas, and luxury commercial spaces.",
    "category": "Chandelier",
    "price": 625,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247732162_23--2-_1785247732162.jpg",
      "/uploads/1785247736765_23--1-_1785247736765.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "7c64c30e-28ea-4806-ab11-6d5982f4e374",
    "name": "Premium Acrylic Crystal Chandelier",
    "slug": "premium-acrylic-crystal-chandelier",
    "description": "This premium acrylic crystal chandelier features three adjustable color temperatures and remote operation for exceptional lighting flexibility. Crafted with elegant K9 crystal accents, it brings luxury, brilliance, and contemporary style to spacious residential and commercial interiors.",
    "category": "Chandelier",
    "price": 932,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60/30 cm or 80/50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247589402_22--1-_1785247589402.jpg",
      "/uploads/1785247589005_22--2-_1785247589005.jpg",
      "/uploads/1785313528305_1_1785313528305.jpg",
      "/uploads/1785313528573_1785247589282-22-1785247589281_1785313528573.jpg",
      "/uploads/1785313528310_1785247598150-22--2--1785247598150_1785313528310.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60/30 cm or 80/50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "4fd2299f-1093-4d78-8eec-479dd1ab0ef3",
    "name": "6-Ring Acrylic Chandelier",
    "slug": "6-ring-acrylic-chandelier",
    "description": "Create a dramatic statement with this luxury six-ring acrylic chandelier. Its adjustable suspension, modern circular design, and remote control provide exceptional flexibility while adding contemporary elegance to large living rooms, staircases, hotel lobbies, and premium interiors.",
    "category": "Chandelier",
    "price": 1000,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Sizes: 100/60 cm | Adjustable Length: 2.5 m",
    "material": "",
    "finish": "gold, black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247470310_21--2-_1785247470310.jpg",
      "/uploads/1785247470300_21--3-_1785247470299.jpg",
      "/uploads/1785247470338_21_1785247470338.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Sizes: 100/60 cm | Adjustable Length: 2.5 m",
      "Finish Options": "gold, black",
      "Finish": "gold, black"
    },
    "relatedProducts": []
  },
  {
    "id": "48061366-464c-4861-92e9-5c6f8ad6394e",
    "name": "Luxury Crystal Ring Chandelier",
    "slug": "luxury-crystal-ring-chandelier",
    "description": "Bring elegance into your home with this premium crystal ring chandelier. Featuring a luxurious silver or gold finish, adjustable hanging length, and remote control, it creates a warm, sophisticated atmosphere in dining rooms, foyers, and contemporary living spaces.",
    "category": "Chandelier",
    "price": 625,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Diameter: 60 cm | Adjustable Length: 1.5 m",
    "material": "",
    "finish": "silver, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247401799_20--1-_1785247401799.jpg",
      "/uploads/1785247401968_20--2-_1785247401968.jpg",
      "/uploads/1785247401964_20--3-_1785247401964.jpg",
      "/uploads/1785247401708_20--4-_1785247401707.jpg",
      "/uploads/1785247401821_20_1785247401821.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Diameter: 60 cm | Adjustable Length: 1.5 m",
      "Finish Options": "silver, gold",
      "Finish": "silver, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "9cbcc390-26e2-4205-8cfb-8452c6edb235",
    "name": "Triple Ring Crystal Chandelier",
    "slug": "triple-ring-crystal-chandelier",
    "description": "Designed with three elegant crystal rings, this luxury chandelier delivers a dramatic visual impact while providing brilliant illumination. Its adjustable hanging length and remote functionality make it an ideal centerpiece for staircases, foyers, and spacious modern homes.",
    "category": "Chandelier",
    "price": 625,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Sizes: 60/40/30 cm | Adjustable Length: 2.5 m",
    "material": "",
    "finish": "silver, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247346278_19--1-_1785247346278.jpg",
      "/uploads/1785247346878_19--2-_1785247346877.jpg",
      "/uploads/1785247346536_19--3-_1785247346536.jpg",
      "/uploads/1785247347051_19--4-_1785247347051.jpg",
      "/uploads/1785247346407_19_1785247346407.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Sizes: 60/40/30 cm | Adjustable Length: 2.5 m",
      "Finish Options": "silver, gold",
      "Finish": "silver, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "e39ba98b-348b-4290-9993-e7bb4e029f1e",
    "name": "Luxury Ring Crystal Chandelier",
    "slug": "luxury-ring-crystal-chandelier",
    "description": "This elegant ring crystal chandelier combines modern luxury with practical functionality. Featuring a sleek gold finish, remote control, and adjustable hanging length, it enhances spacious interiors with brilliant illumination while adding timeless sophistication to your décor.",
    "category": "Chandelier",
    "price": 625,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Ring Diameter: 60 cm | Adjustable Length: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247237428_18--1-_1785247237427.jpg",
      "/uploads/1785247237144_18--2-_1785247237144.jpg",
      "/uploads/1785247236950_18--3-_1785247236950.jpg",
      "/uploads/1785247237032_18--4-_1785247237032.jpg",
      "/uploads/1785247236687_18_1785247236687.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Ring Diameter: 60 cm | Adjustable Length: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "6be6e121-8374-42eb-8c27-c8fc2a081680",
    "name": "Remote LED Crystal Chandelier",
    "slug": "remote-led-crystal-chandelier",
    "description": "Experience luxury lighting with this modern LED crystal chandelier featuring three color-changing modes and remote control. Its elegant gold finish, adjustable chain, and premium crystal design create a striking focal point for dining rooms, living spaces, and grand entrances.",
    "category": "Chandelier",
    "price": 625,
    "discount": 12,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 15 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247104093_17--2-_1785247104093.jpg",
      "/uploads/1785247104056_17_1785247104056.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 15 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "ecea98dc-4a46-4605-9b76-97a8a4cff5e1",
    "name": "Art Deco Floral Chandelier",
    "slug": "art-deco-floral-chandelier",
    "description": "Inspired by classic Art Deco styling, this floral glass chandelier blends elegant craftsmanship with modern convenience. Complete with remote control and an adjustable wire, it creates a luxurious ambiance in dining rooms, foyers, and upscale living spaces.",
    "category": "Chandelier",
    "price": 532,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Wire: 1.5 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785247043749_16--1-_1785247043749.jpg",
      "/uploads/1785247043802_16--2-_1785247043802.jpg",
      "/uploads/1785247043860_16--3-_1785247043860.jpg",
      "/uploads/1785247043673_16--4-_1785247043673.jpg",
      "/uploads/1785247043644_16_1785247043644.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Wire: 1.5 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "2f3b9822-4772-45a0-ba9c-f5d9a46714eb",
    "name": "Luxury Crystal LED Chandelier",
    "slug": "luxury-crystal-led-chandelier",
    "description": "Bring contemporary elegance into your home with this luxury crystal LED chandelier. Featuring three color-changing lighting options and a sophisticated black and gold finish, it provides exceptional illumination while serving as a stunning centerpiece for modern interiors.",
    "category": "Chandelier",
    "price": 532,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785246940665_15--2-_1785246940665.jpg",
      "/uploads/1785246940522_15--3-_1785246940521.jpg",
      "/uploads/1785246940389_15--4-_1785246940389.jpg",
      "/uploads/1785246940901_15_1785246940901.jpg",
      "/uploads/1785246949351_15--1-_1785246949351.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "black, gold",
      "Finish": "black, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "8ac15fbf-24df-4e49-b099-92e828b8e6c8",
    "name": "Acrylic Crystal Chandelier",
    "slug": "acrylic-crystal-chandelier",
    "description": "This acrylic crystal chandelier features three color temperatures and convenient remote control for versatile lighting. Its modern circular design, adjustable wire, and elegant finish make it an excellent choice for living rooms, dining areas, and stylish commercial spaces.",
    "category": "Chandelier",
    "price": 500,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60/40 cm | Height: 30 cm | Adjustable Wire: 1.5 m",
    "material": "",
    "finish": "black/gold/silver",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785246841387_14--1-_1785246841384.jpg",
      "/uploads/1785246841429_14--2-_1785246841428.jpg",
      "/uploads/1785246841783_14--2-_1785246841783.jpg",
      "/uploads/1785246841881_14--3-_1785246841880.jpg",
      "/uploads/1785246841818_14_1785246841817.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60/40 cm | Height: 30 cm | Adjustable Wire: 1.5 m",
      "Finish Options": "black/gold/silver",
      "Finish": "black/gold/silver"
    },
    "relatedProducts": []
  },
  {
    "id": "4a9932aa-b6a2-4ea1-b581-86352128e39c",
    "name": "Squillo Nordic Chandelier",
    "slug": "squillo-nordic-chandelier",
    "description": "The Squillo Nordic Chandelier combines glass, crystal, and modern elegance with convenient remote operation. Its adjustable pipe length allows flexible installation while delivering stylish illumination, making it ideal for luxury dining rooms, lounges, and premium residential interiors.",
    "category": "Chandelier",
    "price": 698,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Pipe: 1.5 m",
    "material": "",
    "finish": "black, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785245030546_13--1-_1785245030546.jpg",
      "/uploads/1785245030324_13--2-_1785245030324.jpg",
      "/uploads/1785245030845_13--3-_1785245030845.jpg",
      "/uploads/1785245030482_13--4-_1785245030482.jpg",
      "/uploads/1785245030443_13_1785245030443.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Pipe: 1.5 m",
      "Finish Options": "black, gold",
      "Finish": "black, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "69fbc536-2a64-46bf-a477-8850dc7d3b45",
    "name": "Premium LED Crystal Chandelier",
    "slug": "premium-led-crystal-chandelier",
    "description": "Create a luxurious atmosphere with this premium LED crystal chandelier featuring three color-changing light modes. The striking black and gold finish, adjustable chain, and sparkling crystals make it an ideal focal point for spacious contemporary interiors.",
    "category": "Chandelier",
    "price": 532,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black-gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244955773_12--2-_1785244955773.jpg",
      "/uploads/1785244955651_12--3-_1785244955651.jpg",
      "/uploads/1785244956443_12--4-_1785244956442.jpg",
      "/uploads/1785244956250_12_1785244956249.jpg",
      "/uploads/1785244968032_12--1-_1785244968032.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm | Height: 40 cm / 50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "black-gold",
      "Finish": "black-gold"
    },
    "relatedProducts": []
  },
  {
    "id": "29733a1a-fe08-4c21-990e-f8606f91474c",
    "name": "Luxury Gold Crystal Chandelier",
    "slug": "luxury-gold-crystal-chandelier",
    "description": "Designed with elegant glass and crystal elements, this luxury chandelier adds timeless sophistication to any room. Its brass finish and adjustable chain make it ideal for dining rooms, bedrooms, foyers, and modern living spaces seeking refined decorative lighting.",
    "category": "Chandelier",
    "price": 200,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 23 cm / 40 cm / 80 cm | Adjustable Chain: 1.5m",
    "material": "",
    "finish": "brass",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244875349_11--1-_1785244875349.jpg",
      "/uploads/1785244875454_11--2-_1785244875454.jpg",
      "/uploads/1785244875475_11--3-_1785244875475.jpg",
      "/uploads/1785244875328_11--4-_1785244875328.jpg",
      "/uploads/1785244875382_11_1785244875382.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 23 cm / 40 cm / 80 cm | Adjustable Chain: 1.5m",
      "Finish Options": "brass",
      "Finish": "brass"
    },
    "relatedProducts": []
  },
  {
    "id": "b45561c1-9731-411f-957d-bf67be9e997e",
    "name": "Gold LED Crystal Chandelier",
    "slug": "gold-led-crystal-chandelier",
    "description": "Enhance your interior with this elegant gold LED crystal chandelier featuring three color-changing lighting modes. Its luxurious crystal detailing and adjustable chain provide both style and flexibility, making it an excellent centerpiece for dining rooms, living spaces, and grand entrances.",
    "category": "Chandelier",
    "price": 500,
    "discount": 30,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 40 cm | Adjustable Chain: 1 m",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244805554_10--2-_1785244805540.jpg",
      "/uploads/1785244805605_10_1785244805583.jpg",
      "/uploads/1785244814209_10--1-_1785244814209.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 40 cm | Adjustable Chain: 1 m",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "a8e95a62-f8d6-4d9e-b61b-5ac9d29e885f",
    "name": "Luxury LED Crystal Chandelier",
    "slug": "luxury-led-crystal-chandelier",
    "description": "This luxury LED crystal chandelier features elegant crystal accents with three color-changing lighting modes. The adjustable chain allows flexible installation, while the modern design makes it an ideal centerpiece for dining rooms, foyers, and premium living spaces.",
    "category": "Chandelier",
    "price": 200,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 40 cm / 60 cm / 80 cm | Height: 30 cm / 40 cm / 50 cm | Adjustable Chain: 1.5 m",
    "material": "",
    "finish": "black-gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244741304_9--1-_1785244741304.jpg",
      "/uploads/1785244741433_9--2-_1785244741433.jpg",
      "/uploads/1785244741503_9--3-_1785244741503.jpg",
      "/uploads/1785244741375_9--4-_1785244741375.jpg",
      "/uploads/1785244741480_9_1785244741480.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 40 cm / 60 cm / 80 cm | Height: 30 cm / 40 cm / 50 cm | Adjustable Chain: 1.5 m",
      "Finish Options": "black-gold",
      "Finish": "black-gold"
    },
    "relatedProducts": []
  },
  {
    "id": "886fb652-85ad-460c-94b2-af36b37e38fc",
    "name": "Modern Black Crystal Chandelier",
    "slug": "modern-black-crystal-chandelier",
    "description": "The Modern Black Crystal Chandelier combines bold styling with sparkling crystal elegance. Designed to become the centerpiece of any room, it offers exceptional illumination while complementing contemporary, industrial, and luxury interior décor.",
    "category": "Chandelier",
    "price": 400,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 50 cm | Height: 40 cm",
    "material": "",
    "finish": "black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244340770_8--1-_1785244340770.jpg",
      "/uploads/1785244341072_8--2-_1785244341072.jpg",
      "/uploads/1785244341456_8--3-_1785244341456.jpg",
      "/uploads/1785244340892_8_1785244340892.jpg",
      "/uploads/1785244341195_81_1785244341195.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 50 cm | Height: 40 cm",
      "Finish Options": "black",
      "Finish": "black"
    },
    "relatedProducts": []
  },
  {
    "id": "bb81141d-aa37-40df-af9a-7bbc2dea5936",
    "name": "Nordic Crystal Chandelier",
    "slug": "nordic-crystal-chandelier",
    "description": "Featuring elegant smoky crystal accents, this Nordic-inspired chandelier delivers a refined contemporary look. Its sophisticated layered design creates stunning visual appeal, making it perfect for dining rooms, luxury living spaces, and grand entrances.",
    "category": "Chandelier",
    "price": 598,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm / 80 cm",
    "material": "",
    "finish": "smoky crystals",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244245680_7--1-_1785244245680.jpg",
      "/uploads/1785244245784_7--2-_1785244245784.jpg",
      "/uploads/1785244245184_7--3-_1785244245184.jpg",
      "/uploads/1785244245339_7--4-_1785244245339.jpg",
      "/uploads/1785244245299_7_1785244245299.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm / 80 cm",
      "Finish Options": "smoky crystals",
      "Finish": "smoky crystals"
    },
    "relatedProducts": []
  },
  {
    "id": "0daf0edd-7546-4276-83cf-a682f4eb83f9",
    "name": "5-Tier Crystal Chandelier",
    "slug": "5-tier-crystal-chandelier",
    "description": "Bring luxurious elegance into your home with this five-tier crystal chandelier. The layered crystal arrangement creates dazzling reflections while the flush mount design provides a clean, sophisticated look suitable for modern and classic interiors alike.",
    "category": "Chandelier",
    "price": 400,
    "discount": 30,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 40 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244205752_6--1-_1785244205752.jpg",
      "/uploads/1785244205887_6--2-_1785244205887.jpg",
      "/uploads/1785244205429_6--3-_1785244205429.jpg",
      "/uploads/1785244205156_6--5-_1785244205156.jpg",
      "/uploads/1785244205298_6_1785244205298.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 40 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "3f5acba9-e982-464e-bed8-861aeacd08ba",
    "name": "Jasper LED Chandelier",
    "slug": "jasper-led-chandelier",
    "description": "The Jasper LED Chandelier combines sparkling crystal elements with a sleek postmodern design. Featuring tri-color lighting, it creates a luxurious ambiance while complementing bedrooms, dining areas, and living spaces with sophisticated contemporary elegance.",
    "category": "Chandelier",
    "price": 320,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 50 cm / 60 cm / 80 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244118545_5--1-_1785244118544.jpg",
      "/uploads/1785244118552_5--2-_1785244118552.jpg",
      "/uploads/1785244118558_5--3-_1785244118558.jpg",
      "/uploads/1785244118589_5--4-_1785244118589.jpg",
      "/uploads/1785244118568_5_1785244118568.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 50 cm / 60 cm / 80 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "a7762ca8-ca2b-4854-a631-ae57d52455a3",
    "name": "Luxury Crystal Ceiling Light",
    "slug": "luxury-crystal-ceiling-light",
    "description": "Designed with premium crystal accents and a sophisticated ceiling-mounted profile, this luxury ceiling light delivers brilliant illumination while enhancing modern interiors. Its elegant finish makes it an excellent choice for bedrooms, lounges, hallways, and premium residential spaces.",
    "category": "Chandelier",
    "price": 280,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 40 cm / 60 cm | Height: 20 cm / 30 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785244058908_4--1-_1785244058908.jpg",
      "/uploads/1785244058762_4--2-_1785244058762.jpg",
      "/uploads/1785244059129_4--3-_1785244059129.jpg",
      "/uploads/1785244059122_4--4-_1785244059121.jpg",
      "/uploads/1785244058985_4_1785244058985.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 40 cm / 60 cm | Height: 20 cm / 30 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "86c20b34-2225-45b9-adde-1fb584bc6175",
    "name": "Crystal Drum Mount Chandelier",
    "slug": "crystal-drum-mount-chandelier",
    "description": "Featuring beautifully carved crystal details, this drum mount chandelier adds timeless elegance to any room. Its ceiling-mounted construction offers brilliant illumination while creating a luxurious atmosphere, making it ideal for living rooms, dining spaces, and stylish modern homes.",
    "category": "Chandelier",
    "price": 400,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 40 cm / 60 cm",
    "material": "",
    "finish": "black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785243799261_3--1-_1785243799253.jpg",
      "/uploads/1785243799623_3--2-_1785243799623.jpg",
      "/uploads/1785243799583_3--3-_1785243799560.jpg",
      "/uploads/1785243799332_3--4-_1785243799331.jpg",
      "/uploads/1785243799222_3_1785243799221.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 40 cm / 60 cm",
      "Finish Options": "black",
      "Finish": "black"
    },
    "relatedProducts": []
  },
  {
    "id": "4725855c-683c-459d-95f7-458c4bf354f8",
    "name": "Cassius 8-Light Pendant",
    "slug": "cassius-8-light-pendant",
    "description": "The Cassius 8-Light Pendant blends metal and glass with a striking modern silhouette. Designed to brighten spacious interiors, its elegant finish and adjustable rod make it a perfect addition to dining rooms, foyers, living rooms, and premium commercial settings.",
    "category": "Chandelier",
    "price": 998,
    "discount": 50,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 85 cm | Height: 50 cm | Adjustable Rod: 1.5 m",
    "material": "",
    "finish": "black, gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785243726053_2--1-_1785243726053.jpg",
      "/uploads/1785243725921_2--2-_1785243725921.jpg",
      "/uploads/1785243726446_2--3-_1785243726445.jpg",
      "/uploads/1785243726622_2--4-_1785243726622.jpg",
      "/uploads/1785243726179_2_1785243726179.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 85 cm | Height: 50 cm | Adjustable Rod: 1.5 m",
      "Finish Options": "black, gold",
      "Finish": "black, gold"
    },
    "relatedProducts": []
  },
  {
    "id": "73cf7257-7791-4e80-bc16-4a676d59df5e",
    "name": "Midnight Glow Chandelier",
    "slug": "midnight-glow-chandelier",
    "description": "Transform your interior with the Midnight Glow Chandelier, featuring a sleek black finish and contemporary design. Perfect for dining rooms, living spaces, or luxury bedrooms, this chandelier delivers elegant illumination while serving as a sophisticated centerpiece for modern interiors.",
    "category": "Chandelier",
    "price": 500,
    "discount": 30,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 60 cm | Height: 40 cm | Adjustable Chain: 1 m",
    "material": "",
    "finish": "black",
    "bulbs": "",
    "stock": 1,
    "images": [
      "/uploads/1785243626697_1--1-_1785243626696.jpg",
      "/uploads/1785243626866_1--2-_1785243626845.jpg",
      "/uploads/1785313997682_1_1785313997682.jpg",
      "/uploads/1785313997688_2_1785313997688.jpg",
      "/uploads/1785313997871_chatgpt-image-jul-29--2026--02-01-04-pm_1785313997871.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 60 cm | Height: 40 cm | Adjustable Chain: 1 m",
      "Finish Options": "black",
      "Finish": "black"
    },
    "relatedProducts": []
  },
  {
    "id": "3eab29a4-90bf-4075-8b68-3a27b1926b06",
    "name": "Modern Flush Crystal Chandelier",
    "slug": "modern-flush-crystal-chandelier",
    "description": "This modern flush mount crystal chandelier combines contemporary style with dazzling crystal brilliance. Designed to fit close to the ceiling, it is perfect for bedrooms, hallways, living rooms, and entryways where elegant lighting and space-saving design are equally important.",
    "category": "Ceiling lights",
    "price": 100,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 23 cm | Height: 20 cm",
    "material": "",
    "finish": "gold, black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785235227394_11--1-_1785235227394.jpg",
      "/uploads/1785235227371_11--2-_1785235227371.jpg",
      "/uploads/1785235227346_11--3-_1785235227346.jpg",
      "/uploads/1785235227359_11--4-_1785235227359.jpg",
      "/uploads/1785235227259_11_1785235227258.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 23 cm | Height: 20 cm",
      "Finish Options": "gold, black",
      "Finish": "gold, black"
    },
    "relatedProducts": []
  },
  {
    "id": "78cce814-9857-48f0-8c50-01789883f011",
    "name": "Modern Crystal Hallway Light",
    "slug": "modern-crystal-hallway-light",
    "description": "Bring elegance to your hallway or foyer with this beautifully crafted crystal ceiling light. The modern design complements various interior styles while the sparkling crystals provide a luxurious appearance, making it ideal for residential and commercial interiors alike.",
    "category": "Ceiling lights",
    "price": 105,
    "discount": 29,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 18 cm | Height: 20 cm",
    "material": "",
    "finish": "Gold, silver",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785235199370_10--1-_1785235199369.jpg",
      "/uploads/1785235199471_10--2-_1785235199470.jpg",
      "/uploads/1785235199507_10--3-_1785235199507.jpg",
      "/uploads/1785235199515_10_1785235199515.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 18 cm | Height: 20 cm",
      "Finish Options": "Gold, silver",
      "Finish": "Gold, silver"
    },
    "relatedProducts": []
  },
  {
    "id": "44fe9f99-0854-4780-9ac8-20df149329cb",
    "name": "Crystal Foyer Ceiling Light",
    "slug": "crystal-foyer-ceiling-light",
    "description": "This stylish crystal foyer ceiling light enhances entrances, hallways, kitchens, and compact living areas with brilliant illumination. Its elegant crystal detailing and modern finish create a welcoming atmosphere, making it a perfect blend of beauty and everyday practicality.",
    "category": "Ceiling lights",
    "price": 105,
    "discount": 29,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 16 cm | Height: 24 cm",
    "material": "",
    "finish": "gold, silver",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785235135658_9--1-_1785235135658.jpg",
      "/uploads/1785235135695_9--2-_1785235135695.jpg",
      "/uploads/1785235135666_9--3-_1785235135666.jpg",
      "/uploads/1785235135703_9--4-_1785235135703.jpg",
      "/uploads/1785235135359_9_1785235135359.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 16 cm | Height: 24 cm",
      "Finish Options": "gold, silver",
      "Finish": "gold, silver"
    },
    "relatedProducts": []
  },
  {
    "id": "b75732f9-8d49-4aab-a9d5-7627784ccb44",
    "name": "Crystal Hallway Ceiling Light",
    "slug": "crystal-hallway-ceiling-light",
    "description": "Designed for hallways, foyers, porches, and kitchen spaces, this crystal ceiling light adds a sophisticated decorative touch while providing efficient illumination. Its compact design makes it an excellent choice for smaller areas without compromising elegance or brightness.",
    "category": "Ceiling lights",
    "price": 100,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 20 cm | Height: 30 cm",
    "material": "",
    "finish": "silver",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785235102846_8--1-_1785235102846.jpg",
      "/uploads/1785235102951_8--2-_1785235102951.jpg",
      "/uploads/1785235103053_8--3-_1785235103053.jpg",
      "/uploads/1785235103000_8--4-_1785235103000.jpg",
      "/uploads/1785235102993_8_1785235102993.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 20 cm | Height: 30 cm",
      "Finish Options": "silver",
      "Finish": "silver"
    },
    "relatedProducts": []
  },
  {
    "id": "0a1737c5-3be1-47a2-91d3-f882597a7aed",
    "name": "Crystal Bedroom Ceiling Light",
    "slug": "crystal-bedroom-ceiling-light",
    "description": "Brighten your home with this elegant crystal ceiling light, crafted for bedrooms, hallways, and decorative indoor spaces. Its sparkling crystal finish enhances the room's ambiance while offering reliable lighting that perfectly combines style, durability, and functionality.",
    "category": "Ceiling lights",
    "price": 105,
    "discount": 29,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 20 cm | Height: 25 cm",
    "material": "",
    "finish": "gold, silver",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785234914637_7--1-_1785234914636.jpg",
      "/uploads/1785234914370_7--2-_1785234914369.jpg",
      "/uploads/1785234914455_7--3-_1785234914421.jpg",
      "/uploads/1785234914658_7--4-_1785234914658.jpg",
      "/uploads/1785316576490_12_1785316576490.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 20 cm | Height: 25 cm",
      "Finish Options": "gold, silver",
      "Finish": "gold, silver"
    },
    "relatedProducts": []
  },
  {
    "id": "ef99d52b-2ff6-4f02-9032-7e077bbfa713",
    "name": "Modern Ceiling Decoration Light",
    "slug": "modern-ceiling-decoration-light",
    "description": "Designed for versatility, this decorative ceiling light complements entryways, bedrooms, hallways, lounges, and living spaces. Its contemporary appearance blends effortlessly with modern interiors while delivering comfortable, evenly distributed lighting for everyday use.",
    "category": "Ceiling lights",
    "price": 120,
    "discount": 29,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 23 cm | Height: 30 cm",
    "material": "",
    "finish": "black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785234841527_6--2-_1785234841465.jpg",
      "/uploads/1785316889450_1_1785316889450.jpg",
      "/uploads/1785316889517_1785234841402-6--1--1785234841402_1785316889510.jpg",
      "/uploads/1785316889541_1785234841433-6-1785234841433_1785316889540.jpg",
      "/uploads/1785316889563_chatgpt-image-jul-29--2026--02-51-13-pm_1785316889563.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 23 cm | Height: 30 cm",
      "Finish Options": "black",
      "Finish": "black"
    },
    "relatedProducts": []
  },
  {
    "id": "470d0732-203b-44ab-819b-e872a08364ff",
    "name": "Crystal Drum Chandelier",
    "slug": "crystal-drum-chandelier",
    "description": "Elevate your décor with this recessed crystal drum chandelier. Combining premium craftsmanship with a stylish modern design, it delivers exceptional illumination while serving as an eye-catching centerpiece. Suitable for living rooms, dining areas, hotels, and elegant residential interiors.",
    "category": "Ceiling lights",
    "price": 180,
    "discount": 28,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 30 cm / 40 cm | Height: 30 cm",
    "material": "",
    "finish": "gold, black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785234769397_5-original--4-_1785234769394.jpg",
      "/uploads/1785234769676_5original--1-_1785234769655.jpg",
      "/uploads/1785234769508_5original--2-_1785234769495.jpg",
      "/uploads/1785234769600_5original--3-_1785234769585.jpg",
      "/uploads/1785234769647_5original_1785234769647.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 30 cm / 40 cm | Height: 30 cm",
      "Finish Options": "gold, black",
      "Finish": "gold, black"
    },
    "relatedProducts": []
  },
  {
    "id": "dc54f506-f4d5-4e7e-b407-fd99cbcff7f3",
    "name": "Modern Crystal Chandelier",
    "slug": "modern-crystal-chandelier",
    "description": "Add a touch of luxury with this modern crystal chandelier. Designed with a contemporary aesthetic and dazzling crystal elements, it provides both decorative appeal and functional lighting. Ideal for entryways, bedrooms, dining spaces, or any room needing a refined finishing touch.",
    "category": "Ceiling lights",
    "price": 200,
    "discount": 25,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 20 cm | Height: 30 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785234454951_4--1-_1785234454931.jpg",
      "/uploads/1785234454616_4--1-_1785234454606.jpg",
      "/uploads/1785234454645_4--2-_1785234454645.jpg",
      "/uploads/1785234454776_4_1785234454776.jpg",
      "/uploads/1785316614943_chatgpt-image-jul-29--2026--02-46-41-pm_1785316614943.jpg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 20 cm | Height: 30 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  },
  {
    "id": "a1fc925b-cd24-48e5-ac8e-1ccf151f6844",
    "name": "Crystal Semi Flush Mount Ceiling Light",
    "slug": "crystal-semi-flush-mount-ceiling-light",
    "description": "This crystal semi flush mount ceiling light offers the perfect balance between elegance and practicality. The sparkling crystal accents beautifully reflect light, creating a welcoming atmosphere. An excellent choice for bedrooms, hallways, foyers, and contemporary living spaces.",
    "category": "Ceiling lights",
    "price": 125,
    "discount": 28,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 25 cm | Height: 25 cm",
    "material": "",
    "finish": "black",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785062032835_3--1-_1785062032834.jpeg",
      "/uploads/1785062034366_3--2-_1785062034365.jpeg",
      "/uploads/1785062035853_3--3-_1785062035851.jpeg",
      "/uploads/1785062037490_3_1785062037489.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 25 cm | Height: 25 cm",
      "Finish Options": "black",
      "Finish": "black"
    },
    "relatedProducts": []
  },
  {
    "id": "8eaa3423-cf99-4b3e-a3fd-e5cddcb9afa8",
    "name": "Crystal Drum Ceiling Light",
    "slug": "crystal-drum-ceiling-light",
    "description": "Featuring a sleek drum-shaped crystal design, this ceiling light combines modern style with brilliant illumination. Its flush mount construction makes it ideal for rooms with standard ceiling heights, adding elegance and warmth to bedrooms, lounges, dining areas, and entryways.",
    "category": "Ceiling lights",
    "price": 150,
    "discount": 20,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 25 cm / 30 cm | Height: 30 cm",
    "material": "",
    "finish": "Gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785060667293_2--1-_1785060667289.jpeg",
      "/uploads/1785060668801_2--2-_1785060668799.jpeg",
      "/uploads/1785060669441_2--2-_1785060669440.png",
      "/uploads/1785060669982_2-resize-1_1785060669982.jpeg",
      "/uploads/1785060672248_2_1785060672247.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 25 cm / 30 cm | Height: 30 cm",
      "Finish Options": "Gold",
      "Finish": "Gold"
    },
    "relatedProducts": []
  },
  {
    "id": "250b20fc-6e1b-4b00-af38-424d846bb24a",
    "name": "Crystal Surface Mount Ceiling Light",
    "slug": "crystal-surface-mount-ceiling-light-1",
    "description": "Enhance your interiors with this elegant crystal surface mount ceiling light. Its sparkling crystal design and premium finish create a luxurious ambiance while providing bright, even illumination. Perfect for bedrooms, hallways, living rooms, and modern homes seeking a sophisticated decorative lighting solution.",
    "category": "Ceiling lights",
    "price": 150,
    "discount": 27,
    "rating": 5,
    "reviews": [],
    "dimensions": "Diameter: 30 cm | Height: 30 cm",
    "material": "",
    "finish": "gold",
    "bulbs": "",
    "stock": 15,
    "images": [
      "/uploads/1785060455661_1--1-_1785060455660.png",
      "/uploads/1785060461491_1--3-_1785060461122.png",
      "/uploads/1785060463972_1--4-_1785060463789.png",
      "/uploads/1785060465297_1--5-_1785060465297.png",
      "/uploads/1785234136105_whatsapp-image-2026-07-28-at-3-50-17-pm_1785234136076.jpeg"
    ],
    "features": [],
    "specifications": {
      "Dimensions": "Diameter: 30 cm | Height: 30 cm",
      "Finish Options": "gold",
      "Finish": "gold"
    },
    "relatedProducts": []
  }
];
