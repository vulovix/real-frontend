import { createAsyncThunk } from '@reduxjs/toolkit';
import { feature2Api, Post } from './api';

// Fetch posts thunk
export const fetchPosts = createAsyncThunk('feature2/fetchPosts', async () => {
  const posts = await feature2Api.fetchPosts();
  return posts;
});

// Create post thunk
export const createPost = createAsyncThunk(
  'feature2/createPost',
  async (postData: Omit<Post, 'id'>) => {
    const newPost = await feature2Api.createPost(postData);
    return newPost;
  }
);

// Update post thunk
export const updatePost = createAsyncThunk(
  'feature2/updatePost',
  async ({ id, data }: { id: number; data: Partial<Post> }) => {
    const updatedPost = await feature2Api.updatePost(id, data);
    return updatedPost;
  }
);

// Fetch cat facts thunk (alternative data)
export const fetchCatFacts = createAsyncThunk('feature2/fetchCatFacts', async () => {
  const facts = await feature2Api.fetchCatFacts();
  return facts;
});
