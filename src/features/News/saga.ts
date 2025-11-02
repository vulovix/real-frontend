/**
 * News Saga
 * Handles side effects for news operations
 */

import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { selectAuth } from '../Auth/slice';
import {
  createUserArticle,
  deleteUserArticle,
  fetchNewsSidebarData,
  fetchUserArticles,
  updateUserArticle,
} from './slice';

function* watchFetchUserArticles() {
  yield takeLatest(fetchUserArticles.pending.type, function* () {
    // The thunk handles the repository call, saga can handle additional side effects if needed
    // For now, we let the thunk handle everything
  });
}

function* watchCreateUserArticle() {
  yield takeEvery(createUserArticle.fulfilled.type, function* () {
    // Refresh sidebar data when an article is created
    yield put(fetchNewsSidebarData());
  });
}

function* watchUpdateUserArticle() {
  yield takeEvery(updateUserArticle.fulfilled.type, function* () {
    // Refresh sidebar data when an article is updated
    yield put(fetchNewsSidebarData());
  });
}

function* watchDeleteUserArticle() {
  yield takeEvery(deleteUserArticle.fulfilled.type, function* () {
    // Refresh sidebar data when an article is deleted
    yield put(fetchNewsSidebarData());
  });
}

// Helper saga to automatically fetch user articles when user logs in
function* fetchUserArticlesOnLogin() {
  try {
    const authState: ReturnType<typeof selectAuth> = yield select(selectAuth);

    if (authState.currentUser) {
      // Fetch all published articles
      yield put(fetchUserArticles({ isPublished: true }));
      // Also fetch sidebar data
      yield put(fetchNewsSidebarData());
    }
  } catch (error) {
    // Error handling - could dispatch an error action if needed
    // For now, silently fail as the thunk will handle errors
  }
}

// Watch for auth changes to auto-fetch articles
function* watchAuthChanges() {
  yield takeLatest('auth/loadSessionSuccess', fetchUserArticlesOnLogin);
  yield takeLatest('auth/loginSuccess', fetchUserArticlesOnLogin);
}

// Root saga
export function* newsSaga() {
  yield all([
    watchFetchUserArticles(),
    watchCreateUserArticle(),
    watchUpdateUserArticle(),
    watchDeleteUserArticle(),
    watchAuthChanges(),
  ]);
}
