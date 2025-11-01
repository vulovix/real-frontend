import { all, fork } from 'redux-saga/effects';
import { feature1Saga } from '../features/feature-1/saga';

export function* rootSaga() {
  yield all([fork(feature1Saga)]);
}
