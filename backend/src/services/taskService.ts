// =============================================================================
// TASK SERVICE - Business Logic Layer
// =============================================================================
// This file contains the actual logic for working with tasks.
//
// Why have a service layer?
// - Keeps route files thin (they should only deal with HTTP).
// - Makes it easier to test business logic in isolation.
// - If we later switch from Prisma to something else, we only change this file.
//
// All functions here are async because database operations are asynchronous.
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Note: In a real app you would inject the Prisma client (dependency injection)
// instead of creating it here. This is simplified for learning.

export async function getAllTasks() {
  // We use findMany to get all records.
  // orderBy makes sure newest tasks appear first.
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTaskById(id: number) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
}) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      // Prisma expects Date objects for DateTime fields
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
}

export async function updateTask(id: number, data: any) {
  try {
    return await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  } catch (error) {
    // Prisma throws when record doesn't exist
    return null;
  }
}

export async function deleteTask(id: number) {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
