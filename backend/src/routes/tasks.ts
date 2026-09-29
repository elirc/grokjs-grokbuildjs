// =============================================================================
// TASKS ROUTES - CRUD API Endpoints
// =============================================================================
// This file defines the HTTP interface for our Task resource.
//
// Why separate routes from services?
// - Routes handle HTTP concerns (status codes, request/response shape, validation).
// - Services handle business logic and data access.
// - This makes testing easier and keeps files focused.
//
// Flow for a typical request:
// 1. Express receives the HTTP request
// 2. This route file validates input using Zod
// 3. Calls the appropriate service function
// 4. Service talks to Prisma → database
// 5. We send back JSON (or error)
//
// We return consistent shapes:
// Success: { data: ... }
// Error:   { error: "message", details?: ... }
//
// This makes the frontend much easier to work with.
// =============================================================================

import { Router } from 'express';
import { z } from 'zod';
import * as taskService from '../services/taskService';

const router = Router();

// -----------------------------------------------------------------------------
// VALIDATION SCHEMAS (using Zod)
// -----------------------------------------------------------------------------
// We define the expected shape of incoming data here.
// This gives us both runtime validation AND TypeScript types.

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = createTaskSchema.partial(); // All fields optional for PATCH

// -----------------------------------------------------------------------------
// GET /api/tasks - List all tasks
// -----------------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({ data: tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// -----------------------------------------------------------------------------
// GET /api/tasks/:id - Get single task
// -----------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = await taskService.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ data: task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// -----------------------------------------------------------------------------
// POST /api/tasks - Create new task
// -----------------------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    // Validate the request body against our schema
    const validated = createTaskSchema.parse(req.body);
    
    const task = await taskService.createTask(validated);
    res.status(201).json({ data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// -----------------------------------------------------------------------------
// PUT /api/tasks/:id - Update task (full replace)
// -----------------------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validated = createTaskSchema.parse(req.body);
    
    const task = await taskService.updateTask(id, validated);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// -----------------------------------------------------------------------------
// DELETE /api/tasks/:id
// -----------------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await taskService.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(204).send(); // 204 No Content is standard for successful DELETE
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
