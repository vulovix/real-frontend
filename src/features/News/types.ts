/**
 * News Feature Types
 * Type definitions for news management with Redux Thunk
 */

// News API response types (simulating real news API)
export enum NewsCategory {
  GENERAL = 'general',
  BUSINESS = 'business',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  SCIENCE = 'science',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
}

export enum NewsSourceId {
  BBC_NEWS = 'bbc-news',
  CNN = 'cnn',
  REUTERS = 'reuters',
  ASSOCIATED_PRESS = 'associated-press',
  THE_GUARDIAN = 'the-guardian',
  TECHCRUNCH = 'techcrunch',
  ESPN = 'espn',
}

export enum NewsSortBy {
  PUBLISHED_AT = 'publishedAt',
  RELEVANCY = 'relevancy',
  POPULARITY = 'popularity',
}

// Core news types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  author: string | null;
  source: {
    id: string;
    name: string;
  };
  category: NewsCategory;
  readingTime: number; // estimated reading time in minutes
}

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: NewsCategory;
  language: string;
  country: string;
}

// News API request types
export interface NewsSearchParams {
  query?: string;
  category?: NewsCategory;
  sources?: string[];
  sortBy?: NewsSortBy;
  page?: number;
  pageSize?: number;
  from?: string; // date string
  to?: string; // date string
}

export interface NewsApiResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsArticle[];
  message?: string;
}

export interface NewsSourcesResponse {
  status: 'ok' | 'error';
  sources: NewsSource[];
  message?: string;
}

// Error handling
export enum NewsErrorCode {
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_KEY_DISABLED = 'API_KEY_DISABLED',
  API_KEY_EXHAUSTED = 'API_KEY_EXHAUSTED',
  PARAMETER_INVALID = 'PARAMETER_INVALID',
  PARAMETER_MISSING = 'PARAMETER_MISSING',
  TOO_MANY_SOURCES = 'TOO_MANY_SOURCES',
  SOURCE_TOO_LARGE = 'SOURCE_TOO_LARGE',
  SOURCE_DOES_NOT_EXIST = 'SOURCE_DOES_NOT_EXIST',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface NewsError {
  code: NewsErrorCode;
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Cache and preferences
export interface NewsPreferences {
  userId: string;
  favoriteCategories: NewsCategory[];
  favoriteSources: string[];
  defaultSortBy: NewsSortBy;
  articlesPerPage: number;
  autoRefreshInterval: number; // minutes
  readArticles: string[]; // article IDs
  bookmarkedArticles: string[]; // article IDs
  updatedAt: string;
}

export interface NewsCacheEntry {
  key: string;
  data: NewsApiResponse | NewsSourcesResponse;
  timestamp: string;
  expiresAt: string;
}

// State management
export interface NewsLoadingState {
  fetchingArticles: boolean;
  fetchingSources: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  updatingPreferences: boolean;
}

export interface NewsPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  hasMore: boolean;
}

export interface NewsState {
  articles: NewsArticle[];
  sources: NewsSource[];
  preferences: NewsPreferences | null;
  searchParams: NewsSearchParams;
  pagination: NewsPagination;
  loading: NewsLoadingState;
  error: NewsError | null;
  lastUpdated: string | null;
}

// User interaction types
export interface BookmarkArticleRequest {
  articleId: string;
}

export interface MarkAsReadRequest {
  articleId: string;
}

export interface UpdatePreferencesRequest {
  preferences: Partial<Omit<NewsPreferences, 'userId' | 'updatedAt'>>;
}

// Statistics and analytics
export interface NewsAnalytics {
  totalArticlesRead: number;
  totalBookmarks: number;
  favoriteCategory: NewsCategory | null;
  readingStreak: number; // days
  avgReadingTime: number; // minutes per day
  lastActiveDate: string;
}

// Admin-only types for news management
export interface NewsManagementStats {
  totalUsers: number;
  activeUsers: number; // users who read news in last 7 days
  popularCategories: Array<{
    category: NewsCategory;
    userCount: number;
    percentage: number;
  }>;
  popularSources: Array<{
    sourceId: string;
    sourceName: string;
    userCount: number;
    percentage: number;
  }>;
  cacheStats: {
    totalEntries: number;
    sizeInMB: number;
    hitRate: number;
    oldestEntry: string;
    newestEntry: string;
  };
}

// Filter and search utilities
export interface NewsFilter {
  categories: NewsCategory[];
  sources: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  hasImage: boolean | null;
  readStatus: 'all' | 'read' | 'unread';
  bookmarkStatus: 'all' | 'bookmarked' | 'not-bookmarked';
}

// Thunk action types (for type safety with createAsyncThunk)
export interface FetchArticlesThunkArg {
  params: NewsSearchParams;
  replace?: boolean; // whether to replace existing articles or append
}

export interface FetchSourcesThunkArg {
  category?: NewsCategory;
  language?: string;
  country?: string;
}

export interface SearchArticlesThunkArg {
  query: string;
  filters?: Partial<NewsFilter>;
  params?: Partial<NewsSearchParams>;
}
