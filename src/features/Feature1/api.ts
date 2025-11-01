import { makeGetRequest, makePostRequest } from '../../services';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';
const BACKUP_API_URL = import.meta.env.VITE_BACKUP_API_BASE_URL || 'https://quotable.io';

// Types for API responses
export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// Feature1 API services using real endpoints
export const feature1Api = {
  // Fetch todos from JSONPlaceholder API
  fetchTodos: async (): Promise<TodoItem[]> => {
    return makeGetRequest<TodoItem[]>(`${API_BASE_URL}/todos`, {
      timeout: 5000,
    });
  },

  // Fetch a specific todo
  fetchTodo: async (id: number): Promise<TodoItem> => {
    return makeGetRequest<TodoItem>(`${API_BASE_URL}/todos/${id}`);
  },

  // Create a new todo
  createTodo: async (todo: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    return makePostRequest<TodoItem>(`${API_BASE_URL}/todos`, todo);
  },

  // Fetch users (alternative endpoint)
  fetchUsers: async (): Promise<User[]> => {
    return makeGetRequest<User[]>(`${API_BASE_URL}/users`, {
      timeout: 5000,
    });
  },

  // Fetch random quotes (alternative API)
  fetchQuotes: async (): Promise<{ content: string; author: string }[]> => {
    try {
      const response = await makeGetRequest<{ results: { content: string; author: string }[] }>(
        `${BACKUP_API_URL}/quotes?limit=5`,
        { timeout: 3000 }
      );
      return response.results;
    } catch (error) {
      // Fallback to local data if API fails
      return [
        { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        {
          content: 'Innovation distinguishes between a leader and a follower.',
          author: 'Steve Jobs',
        },
        {
          content: "Life is what happens to you while you're busy making other plans.",
          author: 'John Lennon',
        },
      ];
    }
  },
};
