/**
 * Root Saga
 * Combines all feature sagas for the application
 */

import { all, fork } from 'redux-saga/effects';
// Import feature sagas
import { authSaga } from '../features/Auth/saga';
import { watchEditorSagas } from '../features/Editor/saga';
import { newsSaga } from '../features/News/saga';
import { userManagementSaga } from '../features/Users/saga';

/**
 * Root saga that combines all feature sagas
 * News feature uses Redux Thunk (createAsyncThunk) with saga for side effects
 */
export function* rootSaga() {
  yield all([fork(authSaga), fork(watchEditorSagas), fork(newsSaga), fork(userManagementSaga)]);
}
