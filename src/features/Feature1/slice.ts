import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodoItem } from './api';

export interface Feature1State {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
}

const initialState: Feature1State = {
  todos: [],
  loading: false,
  error: null,
};

export const feature1Slice = createSlice({
  name: 'feature1',
  initialState,
  reducers: {
    fetchTodosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTodosSuccess: (state, action: PayloadAction<TodoItem[]>) => {
      state.loading = false;
      state.todos = action.payload;
    },
    fetchTodosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.todos.unshift(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    clearTodos: (state) => {
      state.todos = [];
      state.error = null;
    },
  },
});

export const {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodo,
  toggleTodo,
  clearTodos,
} = feature1Slice.actions;

export default feature1Slice.reducer;
