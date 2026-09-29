# SWE Thought Process Journal - grokbuildjs

This journal explains **why** we made certain decisions while building this app. Written as if a senior engineer is explaining their thinking to a junior.

## High-Level Architecture Decisions

### Why separate frontend and backend folders?
- Clear separation of concerns. In real startups, frontend and backend are often owned by different teams or deployed separately.
- Makes it easier to scale later (e.g., move backend to its own repo).
- Frontend can be a SPA, backend can be a pure API.

### Why Prisma + PostgreSQL instead of MongoDB or raw SQL?
- PostgreSQL is the default for most new startups that need relational data (tasks have relationships).
- Prisma gives excellent TypeScript support and migrations out of the box. Much better developer experience than writing raw SQL or using older ORMs.
- Avoided Mongo because for a simple CRUD with relationships, relational DB teaches better fundamentals.

### Why TanStack Query instead of useEffect + useState?
- Real apps need caching, background refetching, optimistic updates, and loading/error states.
- Writing this by hand is error-prone and repetitive. Juniors need to learn the modern standard tool.
- It abstracts away a lot of the "data fetching boilerplate" that used to cause bugs.

### Why not Next.js fullstack?
- We want you to understand the boundary between frontend and backend clearly.
- Many companies still use separate repos or separate services.
- Learning how a pure API + pure SPA talk over HTTP is foundational.

## Backend Decisions

### Why Express + TypeScript instead of NestJS?
- NestJS is great but has a steep learning curve with decorators, modules, etc.
- Express + TypeScript is what many small startups start with. You can add structure yourself.
- Easier to understand the request → route → service → database flow.

### Folder structure (routes vs services)
- `routes/` = "What HTTP method and path maps to what logic?" (thin controllers)
- `services/` = "Business logic and data access"
- This separation makes testing easier and keeps route files small.

Example flow for creating a task:
1. POST /tasks hits `routes/tasks.ts`
2. Route validates input with Zod
3. Calls `services/taskService.ts`
4. Service talks to Prisma → database
5. Returns clean data (no Prisma internals leak to client)

### Why use Zod for validation?
- Single source of truth for what a Task looks like.
- Gives you runtime validation + great error messages.
- Generates TypeScript types so frontend and backend stay in sync.

## Frontend Decisions

### API Layer (`frontend/src/api/`)
We created a dedicated `api` folder with functions like:
- `createTask(data)`
- `fetchTasks()`
- `updateTask(id, data)`

**Why?**
- Keeps all HTTP logic in one place.
- Easy to swap the backend later (e.g., switch to tRPC or GraphQL).
- TanStack Query likes clean async functions.

### Why React Hook Form + Zod?
- React Hook Form is the current best practice for forms (performance + DX).
- Zod integrates beautifully for schema validation.
- Much better than controlled components + manual validation for anything beyond tiny forms.

### State Management
- No Redux or Zustand.
- We use TanStack Query as the single source of truth for server state.
- Local UI state (modals open/closed, form values) stays in components or React Hook Form.

This is how most modern startups work in 2025-2026.

## Key Interactions

### How frontend talks to backend
1. User clicks "Create Task" → Form submits
2. `useMutation` from TanStack Query calls `createTask()` in api layer
3. api layer does `fetch('/api/tasks', { method: 'POST', body: JSON.stringify(data) })`
4. Backend route receives it → validates → saves to DB via Prisma
5. Returns the created task
6. TanStack Query automatically updates the cache → UI re-renders the list

### Why we return the created object from POST
This allows optimistic updates and immediate UI feedback without another GET request.

## Things a Junior Should Notice

1. **Error handling**: We have consistent error shapes on both sides.
2. **Loading states**: Every mutation and query has isLoading.
3. **Type safety**: Prisma types flow all the way to the frontend via shared interfaces.
4. **Database**: We use migrations (Prisma migrate). Never edit production DB manually.
5. **Environment variables**: Never hardcode secrets. Use `.env` files.

## What We Intentionally Left Out (and why)

- Authentication (too big for a first fullstack project)
- Advanced pagination (focus on core CRUD first)
- Docker for the whole app (only DB for simplicity)
- Advanced testing (unit + e2e can be added later)

## Recommended Learning Path After Building

1. Read every comment in the code.
2. Try breaking things on purpose (remove validation, break the DB connection).
3. Add a new field to Task (e.g. priority) and propagate the change end-to-end.
4. Add soft deletes.
5. Later: Add JWT auth.

This project is meant to be studied, not just run.

Good luck!
