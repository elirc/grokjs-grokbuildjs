// =============================================================================
// MAIN TASKS PAGE - React Component
// =============================================================================
// This is the heart of the frontend.
//
// Key educational points:
//
// 1. We use @tanstack/react-query (React Query) instead of useEffect + useState for data.
//    Why? It handles loading states, errors, caching, and background refetching automatically.
//
// 2. All data fetching lives in the `api/tasks.ts` file. Components should not know about fetch().
//
// 3. We separate "presentational" concerns (UI) from "data" concerns.
//
// 4. Comments explain specific lines that juniors often get confused about.
//
// This file shows the full CRUD cycle in one place so you can see how everything connects.
// =============================================================================

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from '../api/tasks';

export function TasksPage() {
  const queryClient = useQueryClient(); // Gives us access to invalidate/refetch queries

  // ---------------------------------------------------------------------------
  // DATA FETCHING (using React Query)
  // ---------------------------------------------------------------------------
  // useQuery automatically handles:
  // - Loading state (isLoading)
  // - Error state (isError)
  // - Caching
  // - Background refetching
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],           // Unique key for this data
    queryFn: fetchTasks,           // The function that actually fetches
  });

  // ---------------------------------------------------------------------------
  // MUTATIONS (Create, Update, Delete)
  // ---------------------------------------------------------------------------
  // useMutation is for operations that change data.

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // After successful create, tell React Query that the 'tasks' data is stale.
      // It will automatically refetch and update the UI.
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // ---------------------------------------------------------------------------
  // LOCAL STATE (only for UI, not server data)
  // ---------------------------------------------------------------------------
  const [newTitle, setNewTitle] = useState('');

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createMutation.mutate({
      title: newTitle,
      description: null,
      dueDate: null,
    });
    setNewTitle(''); // Clear input after submit
  };

  const toggleComplete = (task: Task) => {
    updateMutation.mutate({
      id: task.id,
      data: { completed: !task.completed },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  if (isLoading) return <div className="p-8">Loading tasks...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load tasks</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title..."
          className="flex-1 border p-2 rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks yet. Create one above!</p>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <div className={task.completed ? 'line-through text-gray-400' : ''}>
                {task.title}
              </div>
              {task.description && (
                <div className="text-sm text-gray-600 mt-1">{task.description}</div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toggleComplete(task)}
                className="text-sm px-3 py-1 border rounded"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button 
                onClick={() => handleDelete(task.id)}
                className="text-sm px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
