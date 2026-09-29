# grokbuildjs - Fullstack Task CRUD App (Educational)

**Goal:** Help a noob coder level up to junior SWE by building a real fullstack app with modern startup tech.

## Tech Stack Choices (Why these are popular in startups 2025-2026)

### Backend
- **Node.js + Express + TypeScript**: Fast to iterate, huge ecosystem. TypeScript adds safety that juniors need to learn early.
- **Prisma**: Modern ORM. Excellent DX, great migrations, type-safe queries. Much better for learning than raw SQL or older ORMs.
- **PostgreSQL**: Industry standard relational DB. Most startups use it (or start with it).
- **Zod**: Runtime + compile-time validation. Essential for APIs.

### Frontend
- **Vite + React + TypeScript**: Fastest dev experience. TypeScript is non-negotiable for junior growth.
- **@tanstack/react-query**: Handles caching, loading states, refetching. Replaces a ton of boilerplate useEffect + useState.
- **React Hook Form + Zod**: Best-in-class form handling + validation.
- **Tailwind CSS**: Fast styling, used everywhere in startups.
- **React Router**: Client-side routing.

### DevOps / Other
- Docker + docker-compose for consistent Postgres dev environment.
- No overkill (no NestJS, no Next.js fullstack, no tRPC) — we want to show clear frontend/backend separation.

## Project Structure

grokbuildjs/
├── backend/                 # Express + Prisma API
│   ├── src/
│   │   ├── routes/          # API route handlers (controllers)
│   │   ├── services/        # Business logic
│   │   ├── prisma/          # Prisma schema + client
│   │   └── ...
├── frontend/                # React app (Vite)
│   └── src/
│       ├── api/             # API client functions (TanStack Query friendly)
│       ├── components/      # Reusable UI
│       ├── hooks/           # Custom hooks
│       └── pages/           # Route pages
├── docker-compose.yml       # Postgres for local dev
├── JOURNAL.md               # Thought process of a senior SWE
└── README.md

## How to Run (After Setup)

See JOURNAL.md for the full thought process.

This project has **extensive comments** explaining:
- Why we chose certain patterns
- What specific lines do
- How frontend talks to backend
- Tradeoffs juniors should know about

The `examples/` folder contains many additional narrated code examples for API design, Zod validation, Prisma, React Query, Docker, etc.

Start by reading `JOURNAL.md` first, then explore the code.
