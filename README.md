# Shree Sai Creation

E-commerce platform for premium chandeliers and luxury lighting solutions.

Built with **Next.js 15**, **TypeScript**, **Prisma ORM**, **Supabase** and **TailwindCSS v4**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| Database ORM | Prisma |
| Database | PostgreSQL (via Supabase) |
| File Storage | Supabase Storage |
| Auth | JWT (bcryptjs) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Validation | Zod |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd shree-sai-creation

# Install dependencies
npm install

# Set up environment variables
cp .env.production.example .env.local
# Edit .env.local with your credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npm run prisma:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

See `.env.production.example` for all required variables. Key ones:

```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

---

## Project Structure

```
src/
├── app/
│   ├── api/v1/         # REST API routes
│   ├── admin/          # Admin dashboard
│   ├── shop/           # Product listing & detail pages
│   └── ...             # Other pages (cart, checkout, account etc.)
├── components/
│   ├── common/         # Header, Footer, shared UI
│   └── ui/             # Reusable UI primitives
├── context/            # React context (Cart, Theme etc.)
├── lib/                # Server utilities (auth, storage, email)
├── utils/              # Client utilities
└── data/               # Static data (fallback products)
prisma/
└── schema.prisma       # Database schema
```

---

## Available Scripts

```bash
npm run dev           # Development server (Turbopack)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed database
```

---

## Deployment

The app is deployed on a VPS with **PM2** and **Nginx** as reverse proxy.

```bash
# Build and restart
npm run build
pm2 restart shree-sai-creation
```

---

## Admin Access

Navigate to `/admin` and sign in with an account that has the `ADMIN` role.

Admin features include:
- Product management (create, edit, publish/unpublish)
- Image upload with client-side compression
- Order management
- Category & brand management
- CMS sections (banners, SEO, company info)
- Analytics dashboard

---

## License

Private — All rights reserved © Shree Sai Creation
