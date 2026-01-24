import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.contact.deleteMany();
  await prisma.media.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.service.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123!",
    12
  );
  
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@humaam.dev",
      password: hashedPassword,
      name: "Humaam",
      role: "admin",
    },
  });
  console.log("✅ Admin user created");

  // Create site settings
  await prisma.siteSettings.create({
    data: {
      id: "main",
      name: "Humaam",
      tagline: "Full-Stack Developer & Systems Architect",
      email: "hello@humaam.dev",
      phone: "+960 7211404",
      location: "Maldives",
      bio: "I build powerful digital solutions that drive business growth. From enterprise systems to mobile apps, I deliver clean, scalable code that solves real problems.",
      aboutContent: `With 4+ years of experience in full-stack development, I specialize in building enterprise-grade applications that transform how businesses operate.

My journey started with PHP and Laravel, quickly expanding into the React ecosystem, mobile development with React Native, and systems programming with Rust and C#. This diverse background allows me to choose the right tool for every job.

**What I Build:**
- Enterprise Resource Planning (ERP) systems
- Business operations and workflow platforms
- Mobile applications for iOS and Android
- Trading bots and automation systems
- Custom internal tools and dashboards

**My Approach:**
I believe in writing code that's not just functional, but maintainable and scalable. Every project starts with understanding the business problem, followed by architecting a solution that grows with your needs.

**Values:**
- Clean, readable code over clever shortcuts
- User experience drives technical decisions
- Communication and transparency throughout
- Continuous learning and improvement`,
      github: "https://github.com/mohamed-humaam",
      linkedin: "https://linkedin.com/in/humaam-codes",
      twitter: "https://x.com/HumaamAthif",
      whatsapp: "https://wa.me/9607211404",
      telegram: "https://t.me/hummato",
      calendly: "https://calendly.com/humaam/30min",
      seoTitle: "Humaam | Full-Stack Developer & Systems Architect",
      seoDesc: "Expert full-stack developer specializing in ERPs, business systems, mobile apps, and automation. 4+ years of experience building scalable solutions.",
      yearsExp: 4,
      projectsCount: 50,
      clientsCount: 30,
    },
  });
  console.log("✅ Site settings created");

  // Create services
  const services = [
    {
      title: "Custom ERP & Internal Systems",
      slug: "custom-erp-systems",
      shortDesc: "Tailored enterprise solutions that streamline your operations and boost productivity.",
      longDesc: `Transform your business operations with custom-built ERP systems designed specifically for your workflow.

I develop comprehensive enterprise solutions that integrate all aspects of your business - from inventory and accounting to HR and customer management. Unlike off-the-shelf solutions, my systems are built around how YOUR business actually works.

**Why Custom ERP?**
- Perfect fit for your unique processes
- No monthly licensing fees
- Full ownership and control
- Scalable as you grow
- Integration with existing tools`,
      icon: "Building2",
      deliverables: [
        "Requirements analysis & system design",
        "Custom database architecture",
        "User-friendly admin dashboard",
        "Role-based access control",
        "Reporting & analytics module",
        "API integrations",
        "Staff training & documentation",
        "6 months support included"
      ],
      pricingNote: "Starting from $5,000. Price varies based on complexity and modules required.",
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Event & Booking Systems",
      slug: "event-booking-systems",
      shortDesc: "Powerful reservation and event management platforms with real-time availability.",
      longDesc: `Build a seamless booking experience for your customers with custom reservation systems.

Whether you're managing hotel rooms, restaurant tables, appointment slots, or event tickets, I create intuitive booking platforms that reduce no-shows and maximize your capacity.

**Features Include:**
- Real-time availability calendar
- Automated confirmations & reminders
- Payment gateway integration
- Customer portal
- Admin management dashboard
- Analytics and reporting`,
      icon: "Calendar",
      deliverables: [
        "Custom booking engine",
        "Calendar integration",
        "Payment processing setup",
        "Email/SMS notifications",
        "Customer self-service portal",
        "Admin dashboard",
        "Mobile-responsive design",
        "3 months support included"
      ],
      pricingNote: "Starting from $3,000",
      featured: true,
      sortOrder: 2,
    },
    {
      title: "Web Applications",
      slug: "web-applications",
      shortDesc: "Modern, fast, and scalable web apps built with Next.js and React.",
      longDesc: `Create powerful web applications that deliver exceptional user experiences across all devices.

Using modern frameworks like Next.js and React, I build applications that are fast, SEO-friendly, and easy to maintain. From SaaS platforms to customer portals, your web app will be built with best practices and scalability in mind.

**Technologies:**
- Next.js / React for frontend
- Node.js / Laravel for backend
- PostgreSQL / MongoDB for data
- Tailwind CSS for styling
- Vercel / AWS for hosting`,
      icon: "Globe",
      deliverables: [
        "UI/UX design & prototyping",
        "Responsive frontend development",
        "Backend API development",
        "Database design & setup",
        "Authentication & security",
        "Performance optimization",
        "SEO implementation",
        "Deployment & CI/CD setup"
      ],
      pricingNote: "Starting from $2,500",
      featured: true,
      sortOrder: 3,
    },
    {
      title: "Mobile App Development",
      slug: "mobile-app-development",
      shortDesc: "Cross-platform mobile apps for iOS and Android using React Native.",
      longDesc: `Launch your mobile app on both iOS and Android with a single codebase, saving time and budget.

I specialize in React Native development, creating native-feeling apps that your users will love. From concept to App Store submission, I handle the entire mobile development lifecycle.

**Benefits of React Native:**
- Single codebase for both platforms
- Native performance and feel
- Faster development time
- Easier maintenance
- Cost-effective updates`,
      icon: "Smartphone",
      deliverables: [
        "App UI/UX design",
        "Cross-platform development",
        "API integration",
        "Push notifications",
        "Offline functionality",
        "App Store optimization",
        "iOS & Android submission",
        "Post-launch support"
      ],
      pricingNote: "Starting from $4,000",
      featured: false,
      sortOrder: 4,
    },
    {
      title: "API Development & Integrations",
      slug: "api-development",
      shortDesc: "Robust APIs and seamless third-party integrations for your systems.",
      longDesc: `Connect your systems and automate data flow with custom API development.

Whether you need a REST or GraphQL API, integration with payment gateways, CRMs, or other third-party services, I build reliable connections that keep your data synchronized and your processes automated.

**Common Integrations:**
- Payment gateways (Stripe, PayPal)
- Email services (SendGrid, Mailchimp)
- CRMs (Salesforce, HubSpot)
- Accounting (QuickBooks, Xero)
- Social media platforms
- Custom webhook systems`,
      icon: "Plug",
      deliverables: [
        "API architecture design",
        "RESTful or GraphQL development",
        "Authentication & rate limiting",
        "Third-party integrations",
        "API documentation",
        "Testing & monitoring setup",
        "Versioning strategy"
      ],
      pricingNote: "Starting from $1,500",
      featured: false,
      sortOrder: 5,
    },
    {
      title: "Automation & Trading Bots",
      slug: "automation-bots",
      shortDesc: "Custom Python bots for trading, scraping, and workflow automation.",
      longDesc: `Automate repetitive tasks and build intelligent systems that work 24/7.

From cryptocurrency trading bots to web scrapers and workflow automation, I develop Python-based solutions that save time and create new opportunities.

**Automation Solutions:**
- Trading bots with custom strategies
- Web scraping & data extraction
- Report generation automation
- Email and notification bots
- Data processing pipelines
- Social media automation`,
      icon: "Bot",
      deliverables: [
        "Strategy consultation",
        "Bot development & testing",
        "Backtesting (for trading)",
        "Risk management features",
        "Monitoring dashboard",
        "Alert system setup",
        "Documentation & training",
        "Ongoing maintenance options"
      ],
      pricingNote: "Starting from $2,000",
      featured: false,
      sortOrder: 6,
    },
    {
      title: "Legacy System Modernization",
      slug: "legacy-modernization",
      shortDesc: "Upgrade outdated .NET, C#, or PHP systems to modern architectures.",
      longDesc: `Breathe new life into your legacy applications without losing critical business logic.

Old systems don't have to hold your business back. I specialize in migrating and modernizing legacy applications built on .NET, C#, or older PHP versions to modern, maintainable architectures.

**Modernization Approaches:**
- Incremental refactoring
- API wrapper development
- Database migration
- UI/UX refresh
- Cloud migration
- Complete rebuild when necessary`,
      icon: "RefreshCw",
      deliverables: [
        "Legacy system audit",
        "Modernization roadmap",
        "Incremental migration",
        "Data migration & validation",
        "New feature development",
        "Performance optimization",
        "Documentation update",
        "Team training"
      ],
      pricingNote: "Varies based on system complexity. Free initial assessment.",
      featured: false,
      sortOrder: 7,
    },
    {
      title: "Cloud Deployment & DevOps",
      slug: "cloud-deployment",
      shortDesc: "Deploy and scale your applications on Firebase, Cloudflare, or VPS.",
      longDesc: `Get your application online with reliable, scalable infrastructure.

I help you choose the right hosting solution and set up automated deployment pipelines that make updates seamless. Whether you need Firebase for real-time apps, Cloudflare for edge performance, or a custom VPS setup, I've got you covered.

**Services Include:**
- Hosting platform selection
- Server configuration
- CI/CD pipeline setup
- SSL & security hardening
- Performance optimization
- Monitoring & alerts
- Backup strategies`,
      icon: "Cloud",
      deliverables: [
        "Infrastructure assessment",
        "Platform setup & configuration",
        "CI/CD pipeline",
        "SSL certificate setup",
        "Domain configuration",
        "Monitoring setup",
        "Backup automation",
        "Documentation"
      ],
      pricingNote: "Starting from $500",
      featured: false,
      sortOrder: 8,
    },
    {
      title: "Accounting & Inventory Modules",
      slug: "accounting-inventory",
      shortDesc: "Financial tracking and inventory management integrated into your systems.",
      longDesc: `Keep your finances and stock levels under control with custom accounting and inventory modules.

I build tailored financial tracking systems that integrate seamlessly with your existing operations. From invoice generation to stock management, these modules give you real-time visibility into your business health.

**Module Features:**
- Invoice & quotation generation
- Expense tracking
- Profit & loss reports
- Stock level monitoring
- Reorder alerts
- Supplier management
- Multi-currency support`,
      icon: "Calculator",
      deliverables: [
        "Requirements analysis",
        "Module development",
        "Integration with existing systems",
        "Report templates",
        "Dashboard widgets",
        "Data import tools",
        "User training",
        "3 months support"
      ],
      pricingNote: "Starting from $2,000",
      featured: false,
      sortOrder: 9,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log("✅ Services created");

  // Create skills
  const skills = [
    // Frontend
    { name: "React", category: "Frontend", level: 95, sortOrder: 1 },
    { name: "Next.js", category: "Frontend", level: 90, sortOrder: 2 },
    { name: "TypeScript", category: "Frontend", level: 90, sortOrder: 3 },
    { name: "Tailwind CSS", category: "Frontend", level: 95, sortOrder: 4 },
    { name: "Vue.js / Nuxt", category: "Frontend", level: 75, sortOrder: 5 },
    { name: "HTML/CSS", category: "Frontend", level: 95, sortOrder: 6 },
    
    // Backend
    { name: "PHP / Laravel", category: "Backend", level: 95, sortOrder: 1 },
    { name: "Node.js", category: "Backend", level: 85, sortOrder: 2 },
    { name: "Python", category: "Backend", level: 80, sortOrder: 3 },
    { name: "C# / .NET", category: "Backend", level: 70, sortOrder: 4 },
    { name: "Rust", category: "Backend", level: 60, sortOrder: 5 },
    { name: "REST APIs", category: "Backend", level: 95, sortOrder: 6 },
    { name: "GraphQL", category: "Backend", level: 75, sortOrder: 7 },
    
    // Mobile
    { name: "React Native", category: "Mobile", level: 90, sortOrder: 1 },
    { name: "Expo", category: "Mobile", level: 90, sortOrder: 2 },
    { name: "Flutter / Dart", category: "Mobile", level: 65, sortOrder: 3 },
    
    // Database
    { name: "PostgreSQL", category: "Database", level: 90, sortOrder: 1 },
    { name: "MySQL", category: "Database", level: 90, sortOrder: 2 },
    { name: "MongoDB", category: "Database", level: 75, sortOrder: 3 },
    { name: "Redis", category: "Database", level: 70, sortOrder: 4 },
    { name: "Prisma ORM", category: "Database", level: 85, sortOrder: 5 },
    
    // DevOps & Cloud
    { name: "Firebase", category: "DevOps", level: 85, sortOrder: 1 },
    { name: "Cloudflare", category: "DevOps", level: 80, sortOrder: 2 },
    { name: "Vercel", category: "DevOps", level: 85, sortOrder: 3 },
    { name: "Docker", category: "DevOps", level: 70, sortOrder: 4 },
    { name: "Linux / VPS", category: "DevOps", level: 80, sortOrder: 5 },
    { name: "Git / GitHub", category: "DevOps", level: 95, sortOrder: 6 },
    { name: "CI/CD", category: "DevOps", level: 75, sortOrder: 7 },
    
    // Tools
    { name: "VS Code", category: "Tools", level: 95, sortOrder: 1 },
    { name: "Figma", category: "Tools", level: 70, sortOrder: 2 },
    { name: "Postman", category: "Tools", level: 90, sortOrder: 3 },
    { name: "Jira / Linear", category: "Tools", level: 80, sortOrder: 4 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log("✅ Skills created");

  // Create sample projects
  const projects = [
    {
      title: "Enterprise Resource Planning System",
      slug: "enterprise-erp-system",
      summary: "A comprehensive ERP solution for a mid-sized manufacturing company, handling inventory, orders, accounting, and HR.",
      description: `## Project Overview

Built a fully custom ERP system for a manufacturing company with 50+ employees, replacing their fragmented Excel-based workflows with a unified platform.

## Key Features

- **Inventory Management**: Real-time stock tracking across 3 warehouses with automated reorder points
- **Order Processing**: End-to-end order lifecycle from quote to delivery to invoice
- **Accounting Module**: Double-entry bookkeeping, automated journal entries, financial reports
- **HR & Payroll**: Employee management, attendance tracking, payroll calculation
- **Customer Portal**: Self-service order tracking and invoice payments
- **Analytics Dashboard**: KPIs, trends, and custom report builder

## Technical Highlights

- Built with Laravel backend, React frontend
- PostgreSQL database with optimized queries for large datasets
- Real-time updates using WebSockets
- PDF generation for invoices and reports
- Role-based access control with granular permissions
- REST API for third-party integrations

## Results

- 60% reduction in order processing time
- 99.9% inventory accuracy (up from ~80%)
- $50k+ annual savings in operational efficiency`,
      stack: ["Laravel", "React", "PostgreSQL", "Redis", "WebSockets", "Tailwind CSS"],
      images: ["/images/projects/erp-dashboard.jpg", "/images/projects/erp-inventory.jpg"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
      sortOrder: 1,
      status: "published",
    },
    {
      title: "Crypto Trading Bot Platform",
      slug: "crypto-trading-bot",
      summary: "Automated cryptocurrency trading system with custom strategies, backtesting, and real-time monitoring.",
      description: `## Project Overview

Developed a sophisticated trading bot platform that executes automated trades across multiple cryptocurrency exchanges based on custom technical analysis strategies.

## Key Features

- **Strategy Builder**: Visual interface to create trading strategies using technical indicators
- **Backtesting Engine**: Test strategies against historical data before going live
- **Multi-Exchange Support**: Binance, Coinbase Pro, KuCoin integration
- **Risk Management**: Stop-loss, take-profit, position sizing rules
- **Real-time Dashboard**: Live P&L, open positions, trade history
- **Alert System**: Telegram/Email notifications for trades and signals

## Technical Highlights

- Python backend with asyncio for concurrent operations
- PostgreSQL for trade history, TimescaleDB for tick data
- React dashboard with real-time WebSocket updates
- Docker deployment with auto-scaling
- Secure API key management with encryption

## Results

- Processing 1000+ signals per minute
- 99.7% uptime over 12 months
- Consistently outperforming buy-and-hold by 15-30%`,
      stack: ["Python", "React", "PostgreSQL", "TimescaleDB", "Docker", "WebSockets"],
      images: ["/images/projects/trading-bot.jpg"],
      liveUrl: null,
      repoUrl: null,
      featured: true,
      sortOrder: 2,
      status: "published",
    },
    {
      title: "Resort Booking Platform",
      slug: "resort-booking-platform",
      summary: "Full-featured hotel booking system with real-time availability, payments, and guest management.",
      description: `## Project Overview

Built a complete booking platform for a boutique resort chain with 5 properties, replacing their manual reservation process with an automated system.

## Key Features

- **Booking Engine**: Real-time room availability with instant confirmation
- **Dynamic Pricing**: Rate management based on season, demand, and length of stay
- **Payment Processing**: Stripe integration for deposits and full payments
- **Guest Portal**: Manage bookings, special requests, and check-in details
- **Admin Dashboard**: Occupancy reports, revenue analytics, guest communication
- **Channel Manager**: Sync with Booking.com and Airbnb (via API)

## Technical Highlights

- Next.js frontend with server-side rendering for SEO
- Laravel API backend
- PostgreSQL with complex availability queries
- Stripe Connect for multi-property payouts
- Email automation for confirmations and reminders

## Results

- 40% increase in direct bookings
- 90% reduction in booking errors
- Guest satisfaction score improved to 4.8/5`,
      stack: ["Next.js", "Laravel", "PostgreSQL", "Stripe", "Tailwind CSS", "Redis"],
      images: ["/images/projects/resort-booking.jpg"],
      liveUrl: "https://example-resort.com",
      repoUrl: null,
      featured: true,
      sortOrder: 3,
      status: "published",
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log("✅ Projects created");

  // Create sample blog posts
  const posts = [
    {
      title: "Building Scalable ERPs: Lessons from the Trenches",
      slug: "building-scalable-erps-lessons",
      excerpt: "After building multiple enterprise systems, here are the patterns and practices that consistently lead to success.",
      content: `When I started building my first ERP system, I made every mistake in the book. Four years and dozens of systems later, I've learned what actually works.

## Start with the Data Model

The single most important decision in any ERP is your data architecture. Get this wrong, and you'll be fighting uphill forever.

\`\`\`typescript
// Bad: Storing everything in JSON
interface Order {
  id: string;
  data: Record<string, any>; // 😱 No structure, no validation
}

// Good: Explicit, typed relationships
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totals: OrderTotals;
  createdAt: Date;
}
\`\`\`

## Embrace Domain-Driven Design

Break your system into bounded contexts. Your inventory module shouldn't know about your HR module's implementation details.

## Build for Change

Requirements WILL change. Build abstractions that allow for this:

- Use service classes instead of fat controllers
- Implement the repository pattern for data access  
- Create clear interfaces between modules

## Performance from Day One

ERPs deal with large datasets. Optimize your queries early:

\`\`\`sql
-- Add indexes for common query patterns
CREATE INDEX idx_orders_customer_date 
ON orders (customer_id, created_at DESC);
\`\`\`

## The Bottom Line

Building enterprise software is a marathon, not a sprint. Invest in solid foundations, and your future self will thank you.`,
      coverImage: "/images/blog/erp-architecture.jpg",
      tags: ["ERP", "Architecture", "Laravel", "Best Practices"],
      readingTime: 5,
      status: "published",
      publishedAt: new Date("2024-11-15"),
    },
    {
      title: "Why I Switched from Vue to React (And When I'd Switch Back)",
      slug: "vue-to-react-comparison",
      excerpt: "A practical comparison of Vue and React from someone who has built production apps in both.",
      content: `I spent two years building everything in Vue/Nuxt. Then I switched to React/Next.js. Here's my honest take.

## Why I Switched to React

### 1. Job Market Reality
Like it or not, more companies use React. For freelance work, this means more opportunities.

### 2. The Ecosystem
React's ecosystem is massive. Whatever you need, there's probably a well-maintained library for it.

### 3. TypeScript Experience
While Vue 3 has excellent TypeScript support, React's integration feels more natural, especially with hooks.

## What I Miss About Vue

### 1. Single File Components
Vue's SFCs are genuinely elegant. Having template, script, and styles in one file with clear separation is beautiful.

\`\`\`vue
<template>
  <button @click="increment">{{ count }}</button>
</template>

<script setup lang="ts">
const count = ref(0)
const increment = () => count.value++
</script>
\`\`\`

### 2. Built-in State Management
Pinia is simpler than Redux. Even Zustand, which I use now, has more boilerplate.

### 3. Vue's Reactivity
\`ref()\` and \`reactive()\` are more intuitive than \`useState()\` and \`useEffect()\`.

## When I'd Use Each

- **Vue/Nuxt**: Smaller teams, content-heavy sites, quick MVPs
- **React/Next.js**: Large teams, complex SPAs, when hiring is a concern

## The Verdict

Both are excellent. React's market share won this round, but Vue remains my secret weapon for certain projects.`,
      coverImage: "/images/blog/vue-vs-react.jpg",
      tags: ["React", "Vue", "JavaScript", "Opinion"],
      readingTime: 4,
      status: "published",
      publishedAt: new Date("2024-10-28"),
    },
    {
      title: "Automating My Trading: Building a Python Bot That Actually Works",
      slug: "python-trading-bot-guide",
      excerpt: "A deep dive into building a cryptocurrency trading bot, from strategy to deployment.",
      content: `Trading bots have a reputation for either being scams or money printers. The reality is somewhere in between.

## The Architecture

After many iterations, here's the architecture that works:

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Exchange   │────▶│   Strategy  │────▶│  Executor   │
│   Feeds     │     │   Engine    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌─────────────┐
                    │  Database   │
                    └─────────────┘
\`\`\`

## The Strategy Engine

Your strategy should be a pure function: given market data, return a signal.

\`\`\`python
from dataclasses import dataclass
from enum import Enum

class Signal(Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"

@dataclass
class MarketData:
    price: float
    volume: float
    rsi: float
    ma_20: float
    ma_50: float

def simple_ma_strategy(data: MarketData) -> Signal:
    if data.ma_20 > data.ma_50 and data.rsi < 70:
        return Signal.BUY
    elif data.ma_20 < data.ma_50 and data.rsi > 30:
        return Signal.SELL
    return Signal.HOLD
\`\`\`

## Risk Management is Everything

The strategy is 20% of the work. Risk management is 80%.

- Never risk more than 1-2% per trade
- Always use stop losses
- Size positions based on volatility
- Track drawdown and pause when limits hit

## Backtesting Honestly

Most backtests are lies. Account for:
- Slippage
- Exchange fees
- Realistic fill rates
- Look-ahead bias

## Deployment

I run my bot on a VPS with:
- Docker for isolation
- PostgreSQL for trade history
- Prometheus + Grafana for monitoring
- Telegram alerts for important events

## Results?

After a year of live trading with modest capital, the bot has outperformed buy-and-hold by about 20%. Not life-changing, but consistently profitable.`,
      coverImage: "/images/blog/trading-bot.jpg",
      tags: ["Python", "Trading", "Automation", "Tutorial"],
      readingTime: 7,
      status: "published",
      publishedAt: new Date("2024-09-12"),
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }
  console.log("✅ Blog posts created");

  // Create sample testimonials
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "CEO",
      company: "TechMaldives",
      content: "Humaam built our entire operations platform from scratch. His understanding of business processes combined with technical expertise made him the perfect partner. The system has transformed how we work.",
      featured: true,
      sortOrder: 1,
    },
    {
      name: "Sarah Chen",
      role: "Founder",
      company: "BookingEase",
      content: "Working with Humaam on our booking platform was a game-changer. He delivered a system that's fast, reliable, and our customers love it. Highly recommend for any complex web application.",
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Mohamed Ali",
      role: "Operations Manager",
      company: "IslandResorts",
      content: "The ERP system Humaam built replaced five different tools we were using. Everything is now in one place, and our team is 10x more productive. Worth every penny.",
      featured: true,
      sortOrder: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("✅ Testimonials created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
