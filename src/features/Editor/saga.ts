/**
 * Editor Saga
 * Handles async operations for the Editor feature
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { RepositoryFactory } from '../../services/Repository';
import { RootState } from '../../store';
import {
  deleteTabFailure,
  deleteTabRequest,
  deleteTabSuccess,
  loadArticleForEditFailure,
  loadArticleForEditRequest,
  loadArticleForEditSuccess,
  loadEditorTabsFailure,
  loadEditorTabsRequest,
  loadEditorTabsSuccess,
  saveArticleFailure,
  saveArticleRequest,
  saveArticleSuccess,
  saveDraftFailure,
  saveDraftRequest,
  saveDraftSuccess,
} from './slice';
import { DeleteTabRequest, EditorErrorCode, SaveTabRequest } from './types';

// Worker sagas
function* saveArticleSaga(action: PayloadAction<SaveTabRequest>): SagaIterator {
  try {
    const { tabId, authorId, authorName } = action.payload;
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Saga: Starting article save for tab ${tabId.slice(-8)}`);
    }
    
    const state: RootState = yield select();
    const { auth, editor } = state;

    if (!auth.currentUser) {
      yield put(
        saveArticleFailure({
          code: EditorErrorCode.UNAUTHORIZED,
          message: 'User not authenticated',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    const tab = editor.tabs.find((t) => t.id === tabId);
    const tabData = editor.tabData[tabId];

    if (!tab || !tabData) {
      yield put(
        saveArticleFailure({
          code: EditorErrorCode.TAB_NOT_FOUND,
          message: 'Tab or tab data not found',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    // Validate required fields
    if (!tabData.title || !tabData.title.trim()) {
      yield put(
        saveArticleFailure({
          code: EditorErrorCode.VALIDATION_ERROR,
          message: 'Article title is required',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    if (!tabData.intro || !tabData.intro.trim()) {
      yield put(
        saveArticleFailure({
          code: EditorErrorCode.VALIDATION_ERROR,
          message: 'Article introduction is required',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    // Check if content is empty (handles various TipTap empty states)
    const isContentEmpty = (content: string): boolean => {
      if (!content || !content.trim()) {
        return true;
      }
      
      // Remove common empty HTML patterns from TipTap
      const cleanContent = content
        .replace(/<p><\/p>/g, '') // Empty paragraphs
        .replace(/<p>\s*<\/p>/g, '') // Paragraphs with whitespace
        .replace(/<br\s*\/?>/g, '') // Line breaks
        .replace(/\s+/g, '') // All whitespace
        .trim();
      
      return cleanContent === '' || cleanContent === '<p></p>';
    };

    if (isContentEmpty(tabData.description || '')) {
      yield put(
        saveArticleFailure({
          code: EditorErrorCode.VALIDATION_ERROR,
          message: 'Article content is required',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    const newsRepo = yield call([RepositoryFactory, 'getNewsArticleRepository']);
    const now = new Date().toISOString();

    if (tab.type === 'edit' && tab.articleId) {
      // Update existing article
      const existingArticle = yield call([newsRepo, 'findById'], tab.articleId);
      if (!existingArticle) {
        yield put(
          saveArticleFailure({
            code: EditorErrorCode.VALIDATION_ERROR,
            message: 'Article not found',
            timestamp: now,
            tabId,
          })
        );
        return;
      }

      const updatedArticle = {
        ...existingArticle,
        title: tabData.title,
        intro: tabData.intro,
        description: tabData.description,
        category: tabData.category,
        imageUrl: tabData.imageUrl,
        isPublished: tabData.isPublished,
        tags: tabData.tags,
        updatedAt: now,
        readingTime: Math.max(1, Math.ceil(tabData.description.length / 1000)),
      };

      yield call([newsRepo, 'update'], tab.articleId, updatedArticle);
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Saga: Successfully updated article ${tab.articleId.slice(-8)}`);
      }
      
      yield put(saveArticleSuccess({ tabId, articleId: tab.articleId }));
    } else {
      // Create new article
      const newArticle = {
        id: crypto.randomUUID(),
        title: tabData.title,
        intro: tabData.intro,
        description: tabData.description,
        category: tabData.category,
        imageUrl: tabData.imageUrl,
        isPublished: tabData.isPublished,
        tags: tabData.tags,
        authorId,
        authorName,
        createdAt: now,
        updatedAt: now,
        readingTime: Math.max(1, Math.ceil(tabData.description.length / 1000)),
      };

      yield call([newsRepo, 'create'], newArticle);
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Saga: Successfully created new article ${newArticle.id.slice(-8)}`);
      }
      
      yield put(saveArticleSuccess({ tabId, articleId: newArticle.id }));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(
      saveArticleFailure({
        code: EditorErrorCode.SAVE_ERROR,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        tabId: action.payload.tabId,
      })
    );
  }
}

function* saveDraftSaga(action: PayloadAction<SaveTabRequest>): SagaIterator {
  try {
    const { tabId, authorId, authorName } = action.payload;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Saga: Starting draft save for tab ${tabId.slice(-8)}`);
    }

    const state: RootState = yield select();
    const { auth, editor } = state;

    if (!auth.currentUser) {
      yield put(
        saveDraftFailure({
          code: EditorErrorCode.UNAUTHORIZED,
          message: 'User not authenticated',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    const tab = editor.tabs.find((t) => t.id === tabId);
    const tabData = editor.tabData[tabId];

    if (!tab || !tabData) {
      yield put(
        saveDraftFailure({
          code: EditorErrorCode.TAB_NOT_FOUND,
          message: 'Tab or tab data not found',
          timestamp: new Date().toISOString(),
          tabId,
        })
      );
      return;
    }

    const newsRepo = yield call([RepositoryFactory, 'getNewsArticleRepository']);
    const now = new Date().toISOString();

    let articleId = tab.articleId;

    if (articleId) {
      // Update existing draft
      const existingArticle = yield call([newsRepo, 'findById'], articleId);
      if (existingArticle) {
        const updatedArticle = {
          ...existingArticle,
          title: tabData.title || 'Untitled',
          intro: tabData.intro || '',
          description: tabData.description || '',
          category: tabData.category,
          imageUrl: tabData.imageUrl,
          isPublished: false, // Always false for drafts
          tags: tabData.tags || [],
          updatedAt: now,
          readingTime: Math.max(1, Math.ceil((tabData.description || '').length / 1000)),
        };

        yield call([newsRepo, 'update'], articleId, updatedArticle);
      } else {
        // Article not found, create a new one
        articleId = crypto.randomUUID();
        const newArticle = {
          id: articleId,
          title: tabData.title || 'Untitled',
          intro: tabData.intro || '',
          description: tabData.description || '',
          category: tabData.category,
          imageUrl: tabData.imageUrl,
          isPublished: false,
          tags: tabData.tags || [],
          authorId,
          authorName,
          createdAt: now,
          updatedAt: now,
          readingTime: Math.max(1, Math.ceil((tabData.description || '').length / 1000)),
        };

        yield call([newsRepo, 'create'], newArticle);
      }
    } else {
      // Create new draft
      articleId = crypto.randomUUID();
      const newArticle = {
        id: articleId,
        title: tabData.title || 'Untitled',
        intro: tabData.intro || '',
        description: tabData.description || '',
        category: tabData.category,
        imageUrl: tabData.imageUrl,
        isPublished: false,
        tags: tabData.tags || [],
        authorId,
        authorName,
        createdAt: now,
        updatedAt: now,
        readingTime: Math.max(1, Math.ceil((tabData.description || '').length / 1000)),
      };

      yield call([newsRepo, 'create'], newArticle);
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
        `Saga: Draft saved successfully for tab ${tabId.slice(-8)}, articleId: ${articleId.slice(-8)}`
      );
    }

    yield put(saveDraftSuccess({ tabId, articleId }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        `Saga: Draft save failed for tab ${action.payload.tabId.slice(-8)}:`,
        errorMessage
      );
    }
    yield put(
      saveDraftFailure({
        code: EditorErrorCode.SAVE_ERROR,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        tabId: action.payload.tabId,
      })
    );
  }
}

function* loadEditorTabsSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const authorId = action.payload;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Saga: Loading editor tabs for author ${authorId}`);
    }

    const newsRepo = yield call([RepositoryFactory, 'getNewsArticleRepository']);

    // Load all drafts for this author
    const drafts = yield call([newsRepo, 'findDraftsByAuthorId'], authorId);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Saga: Found ${drafts.length} drafts for author`, drafts);
    }

    // Transform articles into tabs and tabData format
    // Use article ID as tab ID to maintain consistency
    const tabs = drafts.map((article: any, index: number) => ({
      id: `tab-${article.id}`, // Use article ID as base for tab ID
      title: article.title || 'Untitled',
      type: 'edit' as const,
      articleId: article.id,
      isDirty: false,
      isActive: index === 0, // Make first tab active
      createdAt: article.createdAt,
      lastModified: article.updatedAt,
      lastSaved: article.updatedAt,
    }));

    const tabData: Record<string, any> = {};
    tabs.forEach((tab: any, index: number) => {
      const article = drafts[index];
      tabData[tab.id] = {
        title: article.title || '',
        intro: article.intro || '',
        description: article.description || '',
        category: article.category,
        imageUrl: article.imageUrl || '',
        isPublished: article.isPublished || false,
        tags: article.tags || [],
      };
    });

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
        `Saga: Successfully loaded ${tabs.length} tabs`,
        tabs.map((t: any) => ({ id: t.id, title: t.title }))
      );
    }

    yield put(loadEditorTabsSuccess({ tabs, tabData }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Saga: Failed to load editor tabs:', errorMessage, error);
    }

    yield put(
      loadEditorTabsFailure({
        code: EditorErrorCode.LOAD_FAILED,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

function* deleteTabSaga(action: PayloadAction<DeleteTabRequest>): SagaIterator {
  try {
    const { tabId, deleteArticle } = action.payload;
    const state: RootState = yield select();
    const tab = state.editor.tabs.find((t) => t.id === tabId);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`Saga: Deleting tab ${tabId.slice(-8)}`, { deleteArticle, articleId: tab?.articleId });
    }

    if (deleteArticle && tab?.articleId) {
      const newsRepo = yield call([RepositoryFactory, 'getNewsArticleRepository']);
      yield call([newsRepo, 'delete'], tab.articleId);
      
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Saga: Successfully deleted article ${tab.articleId.slice(-8)} from storage`);
      }
    }

    yield put(deleteTabSuccess(tabId));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(
      deleteTabFailure({
        code: EditorErrorCode.SAVE_ERROR,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        tabId: action.payload.tabId,
      })
    );
  }
}

function* loadArticleForEditSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const articleId = action.payload;
    const newsRepo = yield call([RepositoryFactory, 'getNewsArticleRepository']);

    const article = yield call([newsRepo, 'findById'], articleId);

    if (!article) {
      yield put(
        loadArticleForEditFailure({
          code: EditorErrorCode.LOAD_FAILED,
          message: 'Article not found',
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }

    yield put(loadArticleForEditSuccess(article));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(
      loadArticleForEditFailure({
        code: EditorErrorCode.LOAD_FAILED,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

// Root saga
export function* watchEditorSagas(): SagaIterator {
  yield takeEvery(saveArticleRequest.type, saveArticleSaga);
  yield takeLatest(saveDraftRequest.type, saveDraftSaga);
  yield takeEvery(loadEditorTabsRequest.type, loadEditorTabsSaga);
  yield takeEvery(deleteTabRequest.type, deleteTabSaga);
  yield takeEvery(loadArticleForEditRequest.type, loadArticleForEditSaga);
}
