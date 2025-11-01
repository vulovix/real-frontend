import { call, delay, put, takeEvery } from 'redux-saga/effects';
import { fetchDataFailure, fetchDataStart, fetchDataSuccess } from './slice';

// Mock API call simulation
function* mockApiCall(): Generator<unknown, string[], unknown> {
  yield delay(1500); // Simulate network delay

  // Simulate random success/failure
  if (Math.random() > 0.2) {
    return ['Saga Item 1', 'Saga Item 2', 'Saga Item 3', 'Fetched via Redux-Saga'];
  }
  throw new Error('Failed to fetch data from API');
}

function* fetchDataSaga(): Generator<unknown, void, unknown> {
  try {
    const data = yield call(mockApiCall);
    yield put(fetchDataSuccess(data as string[]));
  } catch (error) {
    yield put(fetchDataFailure((error as Error).message));
  }
}

export function* feature1Saga(): Generator<unknown, void, unknown> {
  yield takeEvery(fetchDataStart.type, fetchDataSaga);
}
