import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchThunkData } from './thunk';

export interface Feature2State {
  data: string[];
  loading: boolean;
  error: string | null;
}

const initialState: Feature2State = {
  data: [],
  loading: false,
  error: null,
};

export const feature2Slice = createSlice({
  name: 'feature2',
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThunkData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThunkData.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchThunkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { clearData } = feature2Slice.actions;
