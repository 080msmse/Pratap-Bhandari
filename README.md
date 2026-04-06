# ProjectFlow — Project Management SaaS

A full-stack Monday.com-style project management SaaS built with Next.js 14, Prisma, NextAuth, and Tailwind CSS.

## Features

- **Multi-tenant** — each company gets its own isolated workspace
- **Kanban Board** — drag & drop tasks between columns
- **List View** — sortable table layout
- **Task Detail Modal** — description, comments, priority, assignee, due date
- **Dashboard** — stats, activity feed, completion progress
- **Calendar View** — monthly calendar with task due dates
- **Reports** — priority breakdown, per-project progress
- **Team Management** — invite members, role-based access (Owner/Admin/Member/Viewer)
- **Settings** — workspace config, billing plans, integrations
- **Landing Page** — full marketing page with pricing

## Tech Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Prisma ORM + SQLite** (easily swappable to PostgreSQL)
- **NextAuth.js** — JWT auth with credentials provider
- **Tailwind CSS** — custom design system
- **@hello-pangea/dnd** — drag-and-drop Kanban

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/080msmse/pratap-bhandari.git
cd pratap-bhandari
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Set up database
npm run db:push
npm run db:seed   # loads demo data

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `admin@acme.com` / `demo1234`

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Protected app pages
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── team/
│   │   ├── calendar/
│   │   ├── reports/
│   │   └── settings/
│   ├── (auth)/         # Login & register
│   ├── api/            # REST API routes
│   └── page.tsx        # Landing page
├── components/
│   ├── board/          # Kanban board & task modal
│   ├── layout/         # Sidebar & header
│   └── ui/             # Reusable UI components
├── lib/                # Auth, DB, utilities
└── types/              # TypeScript types
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Demo data
```

## Database Schema

```
Company → Members (roles) → Users
Company → Projects → Columns → Tasks
Tasks → Comments + Activity Log
Tasks → Assignee (User)
```

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```
