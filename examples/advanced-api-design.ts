/*
Advanced API Design Examples in Node/Express/TS

Example 1: Middleware for logging and auth
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

Example 2: Validation with Zod in route
const schema = z.object({ name: z.string().min(1) });
const parsed = schema.parse(req.body);

Example 3: Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

Example 4: Pagination helper
function paginate(data, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  return data.slice(start, start + limit);
}

Problems:
1. Implement rate limiting middleware.
2. Add API versioning (/v1/, /v2/).
3. Create a reusable error class hierarchy.
*/
