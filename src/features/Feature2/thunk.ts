import { createAsyncThunk } from '@reduxjs/toolkit';

// Mock API call simulation
const mockApiCall = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random success/failure
      if (Math.random() > 0.2) {
        resolve(['Thunk Item 1', 'Thunk Item 2', 'Thunk Item 3', 'Fetched via Redux Thunk']);
      } else {
        reject(new Error('Failed to fetch data from API'));
      }
    }, 1000);
  });
};

export const fetchThunkData = createAsyncThunk('feature2/fetchData', async () => {
  const data = await mockApiCall();
  return data;
});
