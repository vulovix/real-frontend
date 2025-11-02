/**
 * News Redux Slice with Async Thunks
 * Professional implementation using Redux Toolkit createAsyncThunk
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { newsService, NewsServiceError } from './api';
import {
  BookmarkArticleRequest,
  CreateUserArticleRequest,
  DeleteUserArticleRequest,
  FetchArticlesThunkArg,
  FetchSourcesThunkArg,
  FetchUserArticlesRequest,
  MarkAsReadRequest,
  NewsAnalytics,
  NewsApiResponse,
  NewsArticle,
  NewsCategory,
  NewsError,
  NewsErrorCode,
  NewsPreferences,
  NewsSearchParams,
  NewsSidebarData,
  NewsSortBy,
  NewsSourcesResponse,
  NewsState,
  SearchArticlesThunkArg,
  UpdatePreferencesRequest,
  UpdateUserArticleRequest,
  UserNewsArticle,
  UserNewsState,
} from './types';

// Initial state
const initialState: NewsState = {
  articles: [],
  sources: [],
  preferences: null,
  searchParams: {
    sortBy: NewsSortBy.PUBLISHED_AT,
    pageSize: 20,
    page: 1,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    pageSize: 20,
    hasMore: false,
  },
  loading: {
    fetchingArticles: false,
    fetchingSources: false,
    refreshing: false,
    loadingMore: false,
    updatingPreferences: false,
  },
  error: null,
  lastUpdated: null,

  // User-created articles state
  userNews: {
    userArticles: [],
    loading: {
      fetchingUserArticles: false,
      creatingArticle: false,
      updatingArticle: false,
      deletingArticle: false,
    },
    error: null,
    filters: {
      showOnlyMyArticles: false,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      viewMode: 'grid',
    },
    lastUpdated: null,
  },

  // Sidebar data
  sidebarData: null,
  sidebarLoading: false,
  sidebarError: null,
};

// Async thunk for fetching articles
export const fetchArticles = createAsyncThunk<
  NewsApiResponse,
  FetchArticlesThunkArg,
  { rejectValue: NewsError }
>('news/fetchArticles', async ({ params, replace: _replace = true }, { rejectWithValue }) => {
  try {
    const response = await newsService.fetchArticles(params);
    return response;
  } catch (error) {
    if (error instanceof NewsServiceError) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.details,
      });
    }
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to fetch articles',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for loading more articles (pagination)
export const loadMoreArticles = createAsyncThunk<
  NewsApiResponse,
  void,
  {
    state: { news: NewsState };
    rejectValue: NewsError;
  }
>('news/loadMoreArticles', async (_, { getState, rejectWithValue }) => {
  try {
    const { news } = getState();
    const nextPage = news.pagination.currentPage + 1;

    const params: NewsSearchParams = {
      ...news.searchParams,
      page: nextPage,
    };

    const response = await newsService.fetchArticles(params);
    return response;
  } catch (error) {
    if (error instanceof NewsServiceError) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.details,
      });
    }
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to load more articles',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for fetching sources
export const fetchSources = createAsyncThunk<
  NewsSourcesResponse,
  FetchSourcesThunkArg,
  { rejectValue: NewsError }
>('news/fetchSources', async ({ category }, { rejectWithValue }) => {
  try {
    const response = await newsService.fetchSources(category);
    return response;
  } catch (error) {
    if (error instanceof NewsServiceError) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.details,
      });
    }
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to fetch sources',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for searching articles
export const searchArticles = createAsyncThunk<
  NewsApiResponse,
  SearchArticlesThunkArg,
  { rejectValue: NewsError }
>('news/searchArticles', async ({ query, filters, params = {} }, { rejectWithValue }) => {
  try {
    const searchParams: NewsSearchParams = {
      query,
      sortBy: NewsSortBy.RELEVANCY,
      pageSize: 20,
      page: 1,
      ...params,
    };

    // Apply filters if provided
    if (filters?.categories && filters.categories.length > 0) {
      searchParams.category = filters.categories[0]; // Take first category for demo
    }

    const response = await newsService.fetchArticles(searchParams);
    return response;
  } catch (error) {
    if (error instanceof NewsServiceError) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.details,
      });
    }
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to search articles',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for loading user preferences
export const loadUserPreferences = createAsyncThunk<
  NewsPreferences | null,
  string,
  { rejectValue: NewsError }
>('news/loadUserPreferences', async (userId, { rejectWithValue }) => {
  try {
    const preferences = await newsService.getUserPreferences(userId);
    return preferences;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to load user preferences',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for updating user preferences
export const updateUserPreferences = createAsyncThunk<
  NewsPreferences,
  { userId: string } & UpdatePreferencesRequest,
  { rejectValue: NewsError }
>('news/updateUserPreferences', async ({ userId, preferences }, { rejectWithValue }) => {
  try {
    const updated = await newsService.updateUserPreferences(userId, preferences);
    return updated;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to update preferences',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for marking article as read
export const markArticleAsRead = createAsyncThunk<
  string,
  { userId: string } & MarkAsReadRequest,
  { rejectValue: NewsError }
>('news/markArticleAsRead', async ({ userId, articleId }, { rejectWithValue }) => {
  try {
    await newsService.markAsRead(userId, articleId);
    return articleId;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to mark article as read',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for toggling bookmark
export const toggleArticleBookmark = createAsyncThunk<
  { articleId: string; isBookmarked: boolean },
  { userId: string } & BookmarkArticleRequest,
  { rejectValue: NewsError }
>('news/toggleArticleBookmark', async ({ userId, articleId }, { rejectWithValue }) => {
  try {
    const isBookmarked = await newsService.toggleBookmark(userId, articleId);
    return { articleId, isBookmarked };
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to toggle bookmark',
      timestamp: new Date().toISOString(),
    });
  }
});

// Async thunk for getting user analytics
export const getUserAnalytics = createAsyncThunk<NewsAnalytics, string, { rejectValue: NewsError }>(
  'news/getUserAnalytics',
  async (userId, { rejectWithValue }) => {
    try {
      const analytics = await newsService.getUserAnalytics(userId);
      return analytics;
    } catch (error) {
      return rejectWithValue({
        code: NewsErrorCode.UNKNOWN_ERROR,
        message: 'Failed to get analytics',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// User Articles Async Thunks
export const fetchUserArticles = createAsyncThunk<
  UserNewsArticle[],
  FetchUserArticlesRequest,
  { rejectValue: NewsError }
>('news/fetchUserArticles', async (request, { rejectWithValue }) => {
  try {
    // eslint-disable-next-line no-console
    console.log('fetchUserArticles thunk called with request:', request);

    const { RepositoryFactory } = await import('../../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();

    // eslint-disable-next-line no-console
    console.log('Repository initialized successfully');

    let result: UserNewsArticle[];

    if (request.authorId) {
      // eslint-disable-next-line no-console
      console.log('Fetching articles by authorId:', request.authorId);
      result = await newsRepo.findByAuthorId(request.authorId);
    } else if (request.category) {
      // eslint-disable-next-line no-console
      console.log('Fetching articles by category:', request.category);
      result = await newsRepo.findByCategory(request.category);
    } else if (request.isPublished !== undefined) {
      // eslint-disable-next-line no-console
      console.log('Fetching articles by published status:', request.isPublished);
      result = request.isPublished
        ? await newsRepo.findPublishedArticles()
        : await newsRepo.findAll();
    } else {
      // eslint-disable-next-line no-console
      console.log('Fetching all published articles (default)');
      result = await newsRepo.findPublishedArticles();
    }

    // eslint-disable-next-line no-console
    console.log('fetchUserArticles thunk completed successfully:', result);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetchUserArticles thunk failed:', error);

    const errorDetails = {
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to fetch user articles',
      timestamp: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    };

    // eslint-disable-next-line no-console
    console.error('Rejecting with error details:', errorDetails);
    return rejectWithValue(errorDetails);
  }
});

export const createUserArticle = createAsyncThunk<
  UserNewsArticle,
  CreateUserArticleRequest & { authorId: string; authorName: string },
  { rejectValue: NewsError }
>('news/createUserArticle', async (request, { rejectWithValue }) => {
  try {
    const { RepositoryFactory } = await import('../../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();

    const now = new Date().toISOString();
    const newArticle: UserNewsArticle = {
      id: crypto.randomUUID(),
      title: request.title,
      intro: request.intro,
      description: request.description,
      imageUrl: request.imageUrl,
      authorId: request.authorId,
      authorName: request.authorName,
      category: request.category,
      createdAt: now,
      updatedAt: now,
      publishedAt: request.isPublished ? now : undefined,
      isPublished: request.isPublished ?? false,
      readingTime: newsRepo.calculateReadingTime(request.description),
    };

    await newsRepo.create(newArticle);
    return newArticle;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to create article',
      timestamp: new Date().toISOString(),
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

export const updateUserArticle = createAsyncThunk<
  UserNewsArticle,
  UpdateUserArticleRequest,
  { rejectValue: NewsError }
>('news/updateUserArticle', async (request, { rejectWithValue }) => {
  try {
    const { RepositoryFactory } = await import('../../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();

    const updatedArticle = await newsRepo.update(request.id, request.updates);
    return updatedArticle;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to update article',
      timestamp: new Date().toISOString(),
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

export const deleteUserArticle = createAsyncThunk<
  string,
  DeleteUserArticleRequest,
  { rejectValue: NewsError }
>('news/deleteUserArticle', async (request, { rejectWithValue }) => {
  try {
    const { RepositoryFactory } = await import('../../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();

    await newsRepo.delete(request.id);
    return request.id;
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to delete article',
      timestamp: new Date().toISOString(),
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Sidebar Activity Thunk
export const fetchNewsSidebarData = createAsyncThunk<
  NewsSidebarData,
  void,
  { rejectValue: NewsError }
>('news/fetchSidebarData', async (_, { rejectWithValue }) => {
  try {
    const { RepositoryFactory } = await import('../../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();

    const [recentArticles, recentlyUpdatedArticles, topAuthors, activityStats] = await Promise.all([
      newsRepo.getRecentArticles(5),
      newsRepo.getRecentlyUpdatedArticles(5),
      newsRepo.getTopAuthors(5),
      newsRepo.getActivityStats(),
    ]);

    return {
      recentArticles,
      recentlyUpdatedArticles,
      topAuthors,
      activityStats,
    };
  } catch (error) {
    return rejectWithValue({
      code: NewsErrorCode.UNKNOWN_ERROR,
      message: 'Failed to fetch sidebar data',
      timestamp: new Date().toISOString(),
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// News slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    // Update search parameters
    updateSearchParams: (state, action: PayloadAction<Partial<NewsSearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },

    // Reset search and pagination
    resetSearch: (state) => {
      state.searchParams = initialState.searchParams;
      state.pagination = initialState.pagination;
      state.articles = [];
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update local article state (for optimistic updates)
    updateLocalArticle: (state, action: PayloadAction<Partial<NewsArticle> & { id: string }>) => {
      const index = state.articles.findIndex((article) => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = { ...state.articles[index], ...action.payload };
      }
    },

    // User News reducers
    updateUserNewsFilters: (state, action: PayloadAction<Partial<UserNewsState['filters']>>) => {
      state.userNews.filters = { ...state.userNews.filters, ...action.payload };
    },

    clearUserNewsError: (state) => {
      state.userNews.error = null;
    },

    // Reset entire state
    resetNews: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch articles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading.fetchingArticles = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading.fetchingArticles = false;
        state.articles = action.payload.articles;

        // Update pagination
        const totalPages = Math.ceil(action.payload.totalResults / state.searchParams.pageSize!);
        state.pagination = {
          currentPage: state.searchParams.page || 1,
          totalPages,
          totalResults: action.payload.totalResults,
          pageSize: state.searchParams.pageSize || 20,
          hasMore: (state.searchParams.page || 1) < totalPages,
        };

        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading.fetchingArticles = false;
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to fetch articles',
          timestamp: new Date().toISOString(),
        };
      });

    // Load more articles
    builder
      .addCase(loadMoreArticles.pending, (state) => {
        state.loading.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreArticles.fulfilled, (state, action) => {
        state.loading.loadingMore = false;

        // Append new articles
        state.articles = [...state.articles, ...action.payload.articles];

        // Update pagination
        const totalPages = Math.ceil(action.payload.totalResults / state.searchParams.pageSize!);
        state.pagination = {
          ...state.pagination,
          currentPage: state.pagination.currentPage + 1,
          totalPages,
          hasMore: state.pagination.currentPage + 1 < totalPages,
        };

        state.error = null;
      })
      .addCase(loadMoreArticles.rejected, (state, action) => {
        state.loading.loadingMore = false;
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to load more articles',
          timestamp: new Date().toISOString(),
        };
      });

    // Fetch sources
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading.fetchingSources = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading.fetchingSources = false;
        state.sources = action.payload.sources;
        state.error = null;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading.fetchingSources = false;
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to fetch sources',
          timestamp: new Date().toISOString(),
        };
      });

    // Search articles
    builder
      .addCase(searchArticles.pending, (state) => {
        state.loading.fetchingArticles = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.loading.fetchingArticles = false;
        state.articles = action.payload.articles;

        // Reset pagination for search results
        const totalPages = Math.ceil(
          action.payload.totalResults / (state.searchParams.pageSize || 20)
        );
        state.pagination = {
          currentPage: 1,
          totalPages,
          totalResults: action.payload.totalResults,
          pageSize: state.searchParams.pageSize || 20,
          hasMore: totalPages > 1,
        };

        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading.fetchingArticles = false;
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to search articles',
          timestamp: new Date().toISOString(),
        };
      });

    // Load user preferences
    builder
      .addCase(loadUserPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(loadUserPreferences.rejected, (state, action) => {
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to load preferences',
          timestamp: new Date().toISOString(),
        };
      });

    // Update user preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading.updatingPreferences = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading.updatingPreferences = false;
        state.preferences = action.payload;
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading.updatingPreferences = false;
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to update preferences',
          timestamp: new Date().toISOString(),
        };
      });

    // Mark article as read (no loading state, optimistic update)
    builder
      .addCase(markArticleAsRead.fulfilled, (state, action) => {
        // Update preferences locally
        if (state.preferences && !state.preferences.readArticles.includes(action.payload)) {
          state.preferences.readArticles.push(action.payload);
        }
      })
      .addCase(markArticleAsRead.rejected, (state, action) => {
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to mark as read',
          timestamp: new Date().toISOString(),
        };
      });

    // Toggle bookmark (optimistic update)
    builder
      .addCase(toggleArticleBookmark.fulfilled, (state, action) => {
        const { articleId, isBookmarked } = action.payload;

        if (state.preferences) {
          if (isBookmarked) {
            if (!state.preferences.bookmarkedArticles.includes(articleId)) {
              state.preferences.bookmarkedArticles.push(articleId);
            }
          } else {
            state.preferences.bookmarkedArticles = state.preferences.bookmarkedArticles.filter(
              (id) => id !== articleId
            );
          }
        }
      })
      .addCase(toggleArticleBookmark.rejected, (state, action) => {
        state.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to toggle bookmark',
          timestamp: new Date().toISOString(),
        };
      });

    // User Articles
    builder
      .addCase(fetchUserArticles.pending, (state) => {
        state.userNews.loading.fetchingUserArticles = true;
        state.userNews.error = null;
      })
      .addCase(fetchUserArticles.fulfilled, (state, action) => {
        state.userNews.loading.fetchingUserArticles = false;
        state.userNews.userArticles = action.payload;
        state.userNews.lastUpdated = new Date().toISOString();
        state.userNews.error = null;
      })
      .addCase(fetchUserArticles.rejected, (state, action) => {
        state.userNews.loading.fetchingUserArticles = false;
        state.userNews.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to fetch user articles',
          timestamp: new Date().toISOString(),
        };
      });

    builder
      .addCase(createUserArticle.pending, (state) => {
        state.userNews.loading.creatingArticle = true;
        state.userNews.error = null;
      })
      .addCase(createUserArticle.fulfilled, (state, action) => {
        state.userNews.loading.creatingArticle = false;
        state.userNews.userArticles.unshift(action.payload);
        state.userNews.lastUpdated = new Date().toISOString();
        state.userNews.error = null;
      })
      .addCase(createUserArticle.rejected, (state, action) => {
        state.userNews.loading.creatingArticle = false;
        state.userNews.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to create article',
          timestamp: new Date().toISOString(),
        };
      });

    builder
      .addCase(updateUserArticle.pending, (state) => {
        state.userNews.loading.updatingArticle = true;
        state.userNews.error = null;
      })
      .addCase(updateUserArticle.fulfilled, (state, action) => {
        state.userNews.loading.updatingArticle = false;
        const index = state.userNews.userArticles.findIndex(
          (article) => article.id === action.payload.id
        );
        if (index !== -1) {
          state.userNews.userArticles[index] = action.payload;
        }
        state.userNews.lastUpdated = new Date().toISOString();
        state.userNews.error = null;
      })
      .addCase(updateUserArticle.rejected, (state, action) => {
        state.userNews.loading.updatingArticle = false;
        state.userNews.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to update article',
          timestamp: new Date().toISOString(),
        };
      });

    builder
      .addCase(deleteUserArticle.pending, (state) => {
        state.userNews.loading.deletingArticle = true;
        state.userNews.error = null;
      })
      .addCase(deleteUserArticle.fulfilled, (state, action) => {
        state.userNews.loading.deletingArticle = false;
        state.userNews.userArticles = state.userNews.userArticles.filter(
          (article) => article.id !== action.payload
        );
        state.userNews.lastUpdated = new Date().toISOString();
        state.userNews.error = null;
      })
      .addCase(deleteUserArticle.rejected, (state, action) => {
        state.userNews.loading.deletingArticle = false;
        state.userNews.error = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to delete article',
          timestamp: new Date().toISOString(),
        };
      });

    // Sidebar Data
    builder
      .addCase(fetchNewsSidebarData.pending, (state) => {
        state.sidebarLoading = true;
        state.sidebarError = null;
      })
      .addCase(fetchNewsSidebarData.fulfilled, (state, action) => {
        state.sidebarLoading = false;
        state.sidebarData = action.payload;
        state.sidebarError = null;
      })
      .addCase(fetchNewsSidebarData.rejected, (state, action) => {
        state.sidebarLoading = false;
        state.sidebarError = action.payload || {
          code: NewsErrorCode.UNKNOWN_ERROR,
          message: 'Failed to fetch sidebar data',
          timestamp: new Date().toISOString(),
        };
      });
  },
});

// Export actions
export const {
  updateSearchParams,
  resetSearch,
  clearError,
  updateLocalArticle,
  updateUserNewsFilters,
  clearUserNewsError,
  resetNews,
} = newsSlice.actions;

// Selectors
export const selectNews = (state: { news: NewsState }) => state.news;
export const selectArticles = (state: { news: NewsState }) => state.news.articles;
export const selectSources = (state: { news: NewsState }) => state.news.sources;
export const selectNewsPreferences = (state: { news: NewsState }) => state.news.preferences;
export const selectSearchParams = (state: { news: NewsState }) => state.news.searchParams;
export const selectPagination = (state: { news: NewsState }) => state.news.pagination;
export const selectNewsLoading = (state: { news: NewsState }) => state.news.loading;
export const selectNewsError = (state: { news: NewsState }) => state.news.error;
export const selectLastUpdated = (state: { news: NewsState }) => state.news.lastUpdated;

// Computed selectors
export const selectIsLoadingAny = (state: { news: NewsState }) => {
  const loading = state.news.loading;
  return (
    loading.fetchingArticles ||
    loading.fetchingSources ||
    loading.refreshing ||
    loading.loadingMore ||
    loading.updatingPreferences
  );
};

export const selectReadArticles = (state: { news: NewsState }) =>
  state.news.preferences?.readArticles || [];

export const selectBookmarkedArticles = (state: { news: NewsState }) =>
  state.news.preferences?.bookmarkedArticles || [];

export const selectBookmarkedArticlesList = (state: { news: NewsState }) =>
  state.news.articles.filter((article) =>
    state.news.preferences?.bookmarkedArticles.includes(article.id)
  );

export const selectUnreadArticles = (state: { news: NewsState }) =>
  state.news.articles.filter(
    (article) => !state.news.preferences?.readArticles.includes(article.id)
  );

export const selectArticlesByCategory = (category: NewsCategory) => (state: { news: NewsState }) =>
  state.news.articles.filter((article) => article.category === category);

// User Articles Selectors
export const selectUserNews = (state: { news: NewsState }) => state.news.userNews;
export const selectUserArticles = (state: { news: NewsState }) => state.news.userNews.userArticles;
export const selectUserNewsLoading = (state: { news: NewsState }) => state.news.userNews.loading;
export const selectUserNewsError = (state: { news: NewsState }) => state.news.userNews.error;
export const selectUserNewsFilters = (state: { news: NewsState }) => state.news.userNews.filters;

export const selectMyArticles = (authorId: string) => (state: { news: NewsState }) =>
  state.news.userNews.userArticles.filter((article) => article.authorId === authorId);

export const selectFilteredUserArticles = (authorId?: string) => (state: { news: NewsState }) => {
  const { userArticles, filters } = state.news.userNews;
  let filtered = userArticles;

  // Filter by author if "My Articles" is selected
  if (filters.showOnlyMyArticles && authorId) {
    filtered = filtered.filter((article) => article.authorId === authorId);
  }

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter((article) => article.category === filters.category);
  }

  // Sort articles (create a copy first since Redux state is immutable)
  filtered = [...filtered].sort((a, b) => {
    const aValue = a[filters.sortBy];
    const bValue = b[filters.sortBy];

    if (filters.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }

    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });

  return filtered;
};

export const selectUserArticleById = (articleId: string) => (state: { news: NewsState }) =>
  state.news.userNews.userArticles.find((article) => article.id === articleId);

export const selectIsUserNewsLoading = (state: { news: NewsState }) => {
  const loading = state.news.userNews.loading;
  return (
    loading.fetchingUserArticles ||
    loading.creatingArticle ||
    loading.updatingArticle ||
    loading.deletingArticle
  );
};

// Sidebar Selectors
export const selectNewsSidebarData = (state: { news: NewsState }) => state.news.sidebarData;
export const selectNewsSidebarLoading = (state: { news: NewsState }) => state.news.sidebarLoading;
export const selectNewsSidebarError = (state: { news: NewsState }) => state.news.sidebarError;

// Export reducer
export default newsSlice.reducer;
