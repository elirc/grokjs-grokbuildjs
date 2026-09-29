/*
Example: Input Validation with Zod in an Express Route

Protecting your API from bad or malicious data.
*/

import { z } from "zod";
import { Request, Response } from "express";

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium")
});

type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

app.post("/tasks", async (req: Request, res: Response) => {
  const parseResult = CreateTaskSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  const data: CreateTaskInput = parseResult.data;
  // data is now fully typed and validated
  const task = await createTask(data);
  res.status(201).json(task);
});

/*
Zod schemas are both validators and TypeScript type generators. By calling safeParse we get a result that tells us whether validation succeeded without throwing.

If validation fails we return a structured 400 with the exact fields that were wrong. This is much friendlier for frontend consumers than generic "bad request" messages.

Using .infer lets us derive a TypeScript type from the schema so we only maintain the rules in one place. The type flows into the rest of the service layer automatically.

A junior should treat every public API boundary as hostile. Never trust incoming JSON; always validate at the edge.
*/
