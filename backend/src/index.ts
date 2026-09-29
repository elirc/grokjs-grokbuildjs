// =============================================================================
// MAIN BACKEND ENTRY POINT - grokbuildjs
// =============================================================================
// This is where the Express server starts.
// 
// Why Express + TypeScript?
// - Express is the most common Node.js framework in startups.
// - TypeScript gives us type safety so we catch bugs before runtime.
// - This combination is very common in small-to-medium teams.
//
// We keep this file small on purpose. The actual logic lives in routes/ and services/.
// This follows the "thin controllers" pattern.
//
// How this file interacts with the rest:
// - It sets up the server and middleware.
// - It mounts the routes from ./routes/tasks.ts
// - Routes call services, which talk to Prisma (database).
// =============================================================================

import express from 'express';
import cors from 'cors'; // Important for frontend (React) to call backend from different port
import taskRoutes from './routes/tasks'; // Our CRUD routes for tasks

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------------
// MIDDLEWARE SETUP
// -----------------------------------------------------------------------------

// Enable CORS so the React frontend (usually on port 5173 with Vite) can talk to us.
// In production you would lock this down to your actual frontend domain.
app.use(cors());

// Parse JSON bodies in requests. This lets us access req.body as an object.
app.use(express.json());

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

// All task-related routes live under /api/tasks
// This keeps our API organized. Later we can add /api/users, /api/auth, etc.
app.use('/api/tasks', taskRoutes);

// Simple health check route - very useful for Docker and monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log('📝 API available at http://localhost:' + PORT + '/api/tasks');
});
