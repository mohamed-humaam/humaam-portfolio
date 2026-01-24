# Humaam Portfolio

A modern, full-stack developer portfolio with integrated CMS, built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- 🎨 **Modern UI** - Clean, premium design with dark/light mode
- 📱 **Responsive** - Mobile-first, looks great on all devices
- 🚀 **Fast** - Server-side rendering, optimized images, Lighthouse-minded
- 📝 **Blog** - Markdown/MDX support with syntax highlighting
- 🔐 **Admin CMS** - Full CRUD for projects, posts, services, skills
- 📊 **SEO Ready** - Dynamic metadata, sitemap, robots.txt
- 📬 **Contact Form** - With spam protection and database storage
- 🎯 **Lead Generation** - Clear CTAs throughout

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Custom JWT-based authentication
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/humaam-portfolio.git
cd humaam-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/humaam_portfolio"
AUTH_SECRET="your-secret-key-at-least-32-characters"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin panel.

### Default Admin Credentials

- Email: Value of `ADMIN_EMAIL` in `.env`
- Password: Value of `ADMIN_PASSWORD` in `.env`

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── projects/
│   │   └── services/
│   ├── admin/             # Admin dashboard
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── posts/
│   │   ├── services/
│   │   ├── skills/
│   │   ├── contacts/
│   │   └── settings/
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Header, Footer
│   ├── home/              # Homepage sections
│   └── admin/             # Admin components
├── lib/
│   ├── auth.ts            # Authentication
│   ├── db.ts              # Prisma client
│   ├── utils.ts           # Utilities
│   ├── validations.ts     # Zod schemas
│   └── mdx.ts             # MDX processing
├── actions/               # Server actions
│   ├── auth.ts
│   ├── contact.ts
│   ├── posts.ts
│   ├── projects.ts
│   ├── services.ts
│   ├── skills.ts
│   └── settings.ts
└── types/
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
AUTH_SECRET=your-production-secret
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Database Setup

For production, use a managed PostgreSQL service:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

## MVP Roadmap

### ✅ Included in MVP
- [x] Homepage with hero, projects, services, blog preview
- [x] About page with skills
- [x] Services list and detail pages
- [x] Projects list and detail pages
- [x] Blog with markdown support
- [x] Contact form with spam protection
- [x] Admin dashboard
- [x] CRUD for all content types
- [x] Dark/light mode
- [x] SEO optimization
- [x] Responsive design

### 🔜 Next Iterations
- [ ] Image upload to cloud storage (S3/R2)
- [ ] Rich text editor for blog posts
- [ ] Testimonials management
- [ ] Analytics dashboard
- [ ] Email notifications for contacts
- [ ] Newsletter subscription
- [ ] Project case study templates
- [ ] Multi-language support
- [ ] Comments on blog posts
- [ ] Social sharing images generation

## Customization

### Branding

1. Update `src/app/globals.css` for colors
2. Modify the site name in `prisma/seed.ts`
3. Replace favicon and OG images in `public/`

### Content

1. Edit seed data in `prisma/seed.ts`
2. Run `npm run db:seed` to repopulate
3. Or use the admin panel at `/admin`

## License

MIT

## Author

Built with ❤️ by Humaam
