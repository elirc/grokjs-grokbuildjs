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

## Project Structure (as committed, checked 2026-10-06)

```
grokbuildjs/
├── backend/
│   ├── package.json             # express, zod, @prisma/client (note: no cors, see below)
│   ├── prisma/schema.prisma     # one model: Task
│   └── src/
│       ├── index.ts             # Express app, CORS, /health, mounts /api/tasks
│       ├── routes/tasks.ts      # CRUD handlers + Zod schemas
│       └── services/taskService.ts  # Prisma calls
├── frontend/
│   ├── package.json             # React 18, TanStack Query, Tailwind, Vite
│   └── src/
│       ├── main.tsx             # QueryClientProvider + TasksPage
│       ├── api/tasks.ts         # fetch client (API on port 5000)
│       └── pages/TasksPage.tsx  # list / create / complete / delete
├── coding-problems/problem-01-api.ts  # 5 problem statements, no starter code
├── examples/                    # 125 files, see below
├── docker-compose.yml           # Postgres 16 on 5432, db "grokbuildjs"
├── JOURNAL.md                   # Thought process of a senior SWE
├── PHASE2.md                    # Feature roadmap
└── README.md
```

There are no `components/` or `hooks/` folders yet. React Hook Form and Zod are not in the frontend's dependencies; the create form is a single `useState` input.

## Before You Try to Run It

The code is a readable sketch. As committed, it does not start:

- `backend/src/index.ts` imports `cors`, but `cors` isn't in `backend/package.json`.
- There's no `backend/.env` or `.env.example`. Prisma needs `DATABASE_URL`, e.g. `postgresql://postgres:postgres@localhost:5432/grokbuildjs`.
- `frontend/src/main.tsx` imports `./index.css`, and the frontend also has no `index.html`, Vite config or Tailwind config.
- The "Complete" button doesn't work. It sends `PUT` with `{ completed: true }`, but the route validates with `createTaskSchema` (title required, no `completed` field), so the response is 400. `updateTaskSchema` is defined but never used.

PHASE2.md section 0 turns each of these into an exercise with a check.

This project has **extensive comments** explaining:
- Why we chose certain patterns
- What specific lines do
- How frontend talks to backend
- Tradeoffs juniors should know about

About `examples/`: 5 files have real, topic-specific code (`advanced-api-design.ts`, `example-docker-compose-dev-env.ts`, `example-express-zod-validation.ts`, `example-prisma-transactions-and-relations.ts`, `example-react-query-caching.ts`). The other 120 (`example-fullstack-<topic>-01..08.ts`) come from one template, and their code doesn't match the topic in the file name. Skip them.

Start by reading `JOURNAL.md` first, then explore the code.
