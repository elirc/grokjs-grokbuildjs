/*
Example: TanStack React Query for Server State
*/

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.getTasks(),
    staleTime: 1000 * 60 // 1 minute
  });
}

function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (newTask) => api.createTask(newTask),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

/*
React Query treats server state as a first-class citizen. It gives you loading, error, and data states automatically, plus caching, background refetching, and optimistic updates.

The queryKey is the identity of the data. When you invalidate or update by key, all components using that key re-render with fresh data.

A junior should stop reaching for useEffect + useState for data fetching once they understand React Query. It eliminates an enormous amount of boilerplate and race condition bugs.
*/
