/**
 * Root Saga
 * Combines all feature sagas for the application
 */

import { all, fork } from 'redux-saga/effects';
// Import feature sagas
import { authSaga } from '../features/Auth/saga';
import { userManagementSaga } from '../features/Users/saga';

/**
 * Root saga that combines all feature sagas
 * Note: News feature uses Redux Thunk (createAsyncThunk), so no saga needed
 */
export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userManagementSaga),
    // Note: News uses Redux Thunk (createAsyncThunk), no saga needed
  ]);
}
