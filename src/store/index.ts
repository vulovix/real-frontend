import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { feature1Slice, Feature1State } from '../features/Feature1/slice';
import { feature2Slice, Feature2State } from '../features/Feature2/slice';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    feature1: feature1Slice.reducer,
    feature2: feature2Slice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Keep thunk enabled
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export interface RootState {
  feature1: Feature1State;
  feature2: Feature2State;
}

export type AppDispatch = typeof store.dispatch;
