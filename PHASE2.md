# Phase 2: Feature Proposals & Implementation Roadmap

**Project:** grokbuildjs (Express + Prisma + React)
**Audience:** Junior SWE upskilling
**Goal:** Move from basic CRUD to a production-like application while learning real-world patterns, architecture decisions, and trade-offs.

This document outlines proposed new features and a detailed, step-by-step implementation plan. Each feature includes learning objectives, technical approach, potential pitfalls, and why it matters for a junior engineer's growth.

> **Status 2026-10-06:** Nothing in sections 1–5 is implemented. The baseline is one `Task` model, five routes in `backend/src/routes/tasks.ts`, and one page. It does not start as committed (see README, "Before You Try to Run It"). Do section 0 first.

---

## 0. Make the Baseline Run and Behave (do this first)

**0.1 Make the backend start.**
Goal: add `cors` and `@types/cors` to `backend/package.json`. Create `backend/.env.example` with `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/grokbuildjs` (copy it to `.env`), then run the first migration.
**Check:** `docker compose up -d`, `npx prisma migrate dev --name init` and `npm run dev` all succeed, and `curl http://localhost:5000/health` returns `{"status":"ok",...}`.

**0.2 Fix "Complete".**
Goal: the `PUT /:id` handler parses with `createTaskSchema`, which requires `title` and has no `completed` key. The frontend sends `{ completed: true }`, so it gets a 400. Even a body with a title would lose `completed`, because Zod strips unknown keys. Add `completed: z.boolean().optional()` to the update schema and parse with `updateTaskSchema`.
**Check:** `curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' localhost:5000/api/tasks/1` returns 200 with `"completed":true`, and the title is unchanged.

**0.3 Stop reporting every failure as "not found".**
Goal: `updateTask` and `deleteTask` in `taskService.ts` catch every error and return `null`/`false`, which the routes turn into 404. Catch only Prisma's "record not found" error (`P2025`) and rethrow everything else. Also return 400 when `parseInt(req.params.id)` is `NaN`.
**Check:** `DELETE /api/tasks/abc` returns 400. `DELETE /api/tasks/999999` returns 404. With Postgres stopped, `DELETE /api/tasks/1` returns 500, not 404.

**0.4 Make the frontend boot.**
Goal: add `frontend/index.html` (with `<div id="root">` and a module script for `/src/main.tsx`), `vite.config.ts` with `@vitejs/plugin-react`, and a `tsconfig.json` (`npm run build` runs `tsc` first, and `tsc` with no config just prints help and fails). Then add `src/index.css` with the three `@tailwind` directives, plus `tailwind.config.js` and `postcss.config.js`.
**Check:** `npm run build` in `frontend/` exits 0, and `npm run dev` shows the task list loaded from the backend.

---

## 1. User Authentication & Authorization (JWT + Role-based)

### Why This Feature?
Most real applications need users to log in. This teaches security fundamentals, state management between frontend/backend, and protecting routes.

### Learning Objectives
- Understand JWT authentication flow
- Learn middleware and protected routes
- Handle authentication state in React (without over-relying on global stores)
- Basic authorization (user vs admin roles)
- Secure password handling

### Detailed Implementation Plan

#### Backend (Express + Prisma)
1. **Database Changes**
   - Add `User` model with `email`, `passwordHash`, `role` (enum: USER | ADMIN)
   - Add `userId` foreign key to `Task` model (so tasks belong to a user)

2. **Authentication Service**
   - Create `auth.service.ts`
   - Use `bcrypt` for password hashing
   - Implement `register` and `login` functions
   - Generate JWT using `jsonwebtoken` (or `jose` for modern approach)

3. **Middleware**
   - Create `auth.middleware.ts`
   - Verify JWT from `Authorization: Bearer <token>` header
   - Attach `user` object to `req` (typed via custom interface)
   - Role-based authorization middleware (e.g., `requireRole('ADMIN')`)

4. **Routes**
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - Protect all `/api/tasks` routes (except public ones if needed)
   - Add `GET /api/auth/me` endpoint

#### Frontend (React + Vite)
1. **API Layer Updates**
   - Add `login(email, password)` and `register(...)` functions in `src/api/auth.ts`
   - Store JWT in `localStorage` (or better: httpOnly cookie in a real app — explain the trade-off)

2. **Auth Context / State**
   - Create `AuthContext.tsx` using React Context + `useReducer` or Zustand
   - Provide `user`, `token`, `login`, `logout`, `isAuthenticated`
   - Use `useEffect` to check for existing token on app load

3. **Protected Routes**
   - Create `ProtectedRoute` component that redirects unauthenticated users
   - Integrate with React Router

4. **Login/Register UI**
   - Simple forms using React Hook Form + Zod
   - Show loading and error states

#### Cross-cutting Concerns
- Add `createdById` to Task model and display "Created by" in the UI
- Update all task queries to scope by current user (or admin can see all)
- Add basic admin-only page (list all users)

### Phased Approach for a Junior
**Week 1:** Just implement login/register with fake users (no real hashing)
**Week 2:** Add real password hashing + JWT
**Week 3:** Add role-based protection and user-scoped tasks

---

## 2. Pagination, Filtering & Search

### Why This Feature?
Real apps rarely return thousands of records at once. This teaches performance thinking, query optimization, and good UX patterns.

### Learning Objectives
- Database query optimization (limit/offset or cursor-based)
- URL-driven state (filters in query params)
- Debouncing search input
- TanStack Query + pagination best practices

### Detailed Implementation Plan

#### Backend
1. Update `GET /api/tasks` to accept query params:
   - `page`, `limit`
   - `search` (title/description contains)
   - `completed` (true/false filter)
   - `sortBy`, `sortOrder`

2. Use Prisma's `skip` + `take` (or cursor-based pagination for better performance)
3. Return pagination metadata:
   ```json
   {
     "data": [...],
     "meta": { "total": 142, "page": 2, "limit": 10, "totalPages": 15 }
   }
   ```

#### Frontend
1. Add filter UI (search input, status dropdown, sort select)
2. Use URL search params (`useSearchParams` from react-router)
3. Integrate with `useQuery` using `queryKey: ['tasks', {page, limit, search, ...}]`
4. Implement debounced search (use `useDebounce` or lodash)
5. Add pagination controls (previous/next or page numbers)

### Recommended Approach for Juniors
Start with client-side filtering (load all tasks, filter in React). Then move to server-side. This shows the performance difference.

---

## 3. Real-time Updates (WebSockets)

### Why This Feature?
Many modern apps feel "live". This introduces event-driven architecture and a completely different communication model.

### Learning Objectives
- WebSocket fundamentals vs REST
- Socket.io (or native WebSockets)
- Broadcasting updates
- Optimistic UI updates + conflict handling

### Detailed Implementation Plan

#### Backend
- Add Socket.io to the Express server
- On task creation/update/deletion, emit events to connected clients:
  - `task:created`
  - `task:updated`
  - `task:deleted`
- Use rooms if you implement user authentication (only send updates to relevant users)

#### Frontend
- Create a WebSocket connection hook (`useSocket`)
- Listen for events and use `queryClient.setQueryData` or `invalidateQueries` to update the UI
- Implement optimistic updates when the user creates/edits a task, then reconcile with server event

### Trade-offs to Discuss
- Complexity vs perceived performance
- When to use polling instead
- Scaling WebSockets (Redis adapter, etc.)

---

## 4. File Attachments on Tasks

### Why This Feature?
Most real CRUD apps need to handle media/files. This introduces storage concerns, security, and async processing.

### Learning Objectives
- Handling multipart/form-data
- File validation and security (size, type)
- Cloud storage vs local (use S3 or local for simplicity)
- Updating UI while upload is in progress

### Detailed Implementation Plan

#### Backend
- Add `TaskAttachment` model (or store URLs on Task)
- Use `multer` (or better: `multer-s3`) for uploads
- Store files in `/uploads` locally during development
- Return file metadata (filename, url, size, mimeType)

#### Frontend
- Add file input in the task form
- Use `FormData` when submitting
- Show upload progress (using Axios or fetch with progress)
- Display attached files with preview/download

### Bonus Stretch
Add ability to delete attachments.

---

## 5. Testing Strategy (Phase 2.5)

### Why This Feature?
Juniors often skip testing until it's painful. This feature teaches testing as a first-class concern.

### Proposed Scope
- Backend: Unit tests for services + integration tests for routes (using supertest + test DB)
- Frontend: Component tests for critical UI + hook tests (using Vitest + React Testing Library)
- E2E: Basic Playwright test for create + complete flow

### Implementation Plan
1. Set up test database (separate Prisma schema or SQLite for speed)
2. Write service layer tests first (easiest to test in isolation)
3. Add route tests
4. Add frontend tests for the task form and list

---

## Overall Implementation Roadmap (Suggested for a Junior)

| Phase       | Focus Area                     | Estimated Time | Key Learning                  |
|-------------|--------------------------------|----------------|-------------------------------|
| Phase 2.1   | Authentication & Authorization | 1–2 weeks      | Security, state management    |
| Phase 2.2   | Pagination + Filtering         | 1 week         | Performance, API design       |
| Phase 2.3   | WebSockets                     | 1–1.5 weeks    | Real-time, event-driven       |
| Phase 2.4   | File Uploads                   | 1 week         | Async flows, storage          |
| Phase 2.5   | Testing                        | Ongoing        | Confidence in changes         |

## Additional Recommendations

- Add proper error handling with consistent error shapes
- Implement loading skeletons instead of spinners everywhere
- Add a simple admin view (list all users + their task counts)
- Introduce environment-specific configuration properly (`.env`, secrets management)
- Add basic logging (e.g., `pino` or Winston)
- Consider adding OpenAPI/Swagger generation (using `tsoa` or manual)

---

## Success Criteria for a Junior Completing Phase 2

By the end of Phase 2, a developer should be able to:
- Explain the full request lifecycle from React component → API → DB → back
- Make intentional trade-off decisions (e.g., polling vs websockets)
- Write code that is reasonably secure and observable
- Understand how authentication changes almost every layer
- Confidently add new features without breaking existing ones

This phase should feel like moving from "I can make a CRUD app" to "I can build something that could be used in a real startup."
