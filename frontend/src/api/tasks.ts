// =============================================================================
// FRONTEND API LAYER
// =============================================================================
// This file contains all functions that talk to our backend.
//
// Why separate the API layer?
// - All HTTP logic lives in one place.
// - Easy to change (e.g. switch to a different base URL or add auth headers later).
// - TanStack Query works best when you give it clean async functions.
//
// We use fetch here for simplicity. In bigger apps you might use Axios.
//
// Note the base URL: our backend runs on port 5000 by default.
// =============================================================================

const API_BASE = 'http://localhost:5000/api';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  const json = await res.json();
  return json.data;
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'completed'>) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function updateTask(id: number, data: Partial<Task>) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteTask(id: number) {
  await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
}
