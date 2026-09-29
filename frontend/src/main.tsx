// This is the entry point of the React application.
// 
// Key things happening here (important for juniors to understand):
// 1. We wrap the app with QueryClientProvider so TanStack Query works everywhere.
// 2. React.StrictMode helps catch bugs during development.
// 3. We render the TasksPage as the main view for this educational app.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TasksPage } from './pages/TasksPage'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // In real apps you often want to set staleTime, retry, etc.
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TasksPage />
    </QueryClientProvider>
  </React.StrictMode>,
)
