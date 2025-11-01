import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Feature1State {
  data: string[];
  loading: boolean;
  error: string | null;
}

const initialState: Feature1State = {
  data: [],
  loading: false,
  error: null,
};

export const feature1Slice = createSlice({
  name: 'feature1',
  initialState,
  reducers: {
    fetchDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure, clearData } =
  feature1Slice.actions;
