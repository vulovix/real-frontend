import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from './api';
import { createPost, fetchPosts, updatePost } from './thunk';

export interface Feature2State {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: Feature2State = {
  posts: [],
  loading: false,
  error: null,
};

export const feature2Slice = createSlice({
  name: 'feature2',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.error = null;
    },
    togglePostBookmark: (state, action: PayloadAction<number>) => {
      // Add a bookmarked property to posts (client-side only)
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        (post as any).bookmarked = !(post as any).bookmarked;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create post';
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update post';
      });
  },
});

export const { clearPosts, togglePostBookmark } = feature2Slice.actions;

export default feature2Slice.reducer;
