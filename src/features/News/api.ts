/**
 * News API Service
 * Professional implementation for news fetching with caching and error handling
 */

import { RepositoryFactory } from '../../services/Repository/RepositoryFactory';
import {
  NewsAnalytics,
  NewsApiResponse,
  NewsArticle,
  NewsCategory,
  NewsErrorCode,
  NewsPreferences,
  NewsSearchParams,
  NewsSortBy,
  NewsSource,
  NewsSourceId,
  NewsSourcesResponse,
} from './types';

// Mock news data generator for demonstration
class MockNewsGenerator {
  private static readonly SAMPLE_ARTICLES: Partial<NewsArticle>[] = [
    {
      title: 'Revolutionary AI Breakthrough Changes Everything',
      description:
        'Scientists have developed a new AI system that can understand and generate human-level content with unprecedented accuracy.',
      author: 'Dr. Sarah Chen',
      category: NewsCategory.TECHNOLOGY,
      readingTime: 4,
    },
    {
      title: 'Global Climate Summit Reaches Historic Agreement',
      description:
        'World leaders unite on ambitious climate action plan with binding commitments for carbon neutrality by 2050.',
      author: 'Michael Rodriguez',
      category: NewsCategory.SCIENCE,
      readingTime: 6,
    },
    {
      title: 'Stock Markets Rally on Economic Recovery News',
      description:
        'Major indices surge as unemployment drops to lowest levels in decades, signaling strong economic recovery.',
      author: 'Emma Thompson',
      category: NewsCategory.BUSINESS,
      readingTime: 3,
    },
    {
      title: 'Breakthrough in Cancer Research Offers New Hope',
      description:
        'Researchers discover novel treatment approach that shows remarkable success in clinical trials for aggressive cancers.',
      author: 'Prof. David Kim',
      category: NewsCategory.HEALTH,
      readingTime: 5,
    },
    {
      title: 'Championship Game Breaks Viewership Records',
      description:
        'Historic matchup draws largest audience in sports broadcasting history as underdog team claims victory.',
      author: 'Sports Desk',
      category: NewsCategory.SPORTS,
      readingTime: 2,
    },
    {
      title: 'New Streaming Platform Disrupts Entertainment Industry',
      description:
        'Innovative content delivery service challenges established players with unique creator revenue sharing model.',
      author: 'Alex Johnson',
      category: NewsCategory.ENTERTAINMENT,
      readingTime: 4,
    },
  ];

  static readonly SOURCES: NewsSource[] = [
    {
      id: NewsSourceId.BBC_NEWS,
      name: 'BBC News',
      description: "The BBC is the world's largest broadcasting corporation",
      url: 'https://www.bbc.com',
      category: NewsCategory.GENERAL,
      language: 'en',
      country: 'gb',
    },
    {
      id: NewsSourceId.CNN,
      name: 'CNN',
      description: 'View the latest news and breaking news today',
      url: 'https://www.cnn.com',
      category: NewsCategory.GENERAL,
      language: 'en',
      country: 'us',
    },
    {
      id: NewsSourceId.TECHCRUNCH,
      name: 'TechCrunch',
      description: 'TechCrunch is a leading technology media property',
      url: 'https://techcrunch.com',
      category: NewsCategory.TECHNOLOGY,
      language: 'en',
      country: 'us',
    },
    {
      id: NewsSourceId.ESPN,
      name: 'ESPN',
      description: 'ESPN.com provides comprehensive sports coverage',
      url: 'https://www.espn.com',
      category: NewsCategory.SPORTS,
      language: 'en',
      country: 'us',
    },
  ];

  static generateArticle(template: Partial<NewsArticle>, index: number): NewsArticle {
    const now = new Date();
    const publishedAt = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const source = this.SOURCES[Math.floor(Math.random() * this.SOURCES.length)];

    return {
      id: `article-${Date.now()}-${index}`,
      title: template.title || `Sample Article ${index}`,
      description: template.description || `This is a sample description for article ${index}`,
      content: `${template.description || 'Sample content'} This is the full content of the article with much more detail and information that would typically be found in a real news article.`,
      url: `https://example.com/article/${index}`,
      urlToImage: Math.random() > 0.3 ? `https://picsum.photos/800/400?random=${index}` : null,
      publishedAt: publishedAt.toISOString(),
      author: template.author || null,
      source: {
        id: source.id,
        name: source.name,
      },
      category: template.category || NewsCategory.GENERAL,
      readingTime: template.readingTime || Math.ceil(Math.random() * 8) + 1,
    };
  }

  static generateArticles(count: number, category?: NewsCategory): NewsArticle[] {
    const articles: NewsArticle[] = [];
    const templates = category
      ? this.SAMPLE_ARTICLES.filter((a) => a.category === category)
      : this.SAMPLE_ARTICLES;

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      articles.push(this.generateArticle(template, i));
    }

    return articles;
  }
}

// News service error class
export class NewsServiceError extends Error {
  constructor(
    public readonly code: NewsErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NewsServiceError';
  }
}

// Main news service
export class NewsService {
  private static instance: NewsService | null = null;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly API_DELAY_MIN = 300; // Minimum API delay
  private readonly API_DELAY_MAX = 800; // Maximum API delay

  private constructor() {}

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  /**
   * Simulate realistic API delay
   */
  private async simulateApiDelay(): Promise<void> {
    const delay = Math.random() * (this.API_DELAY_MAX - this.API_DELAY_MIN) + this.API_DELAY_MIN;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generate cache key for request
   */
  private generateCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = params[key];
          return result;
        },
        {} as Record<string, any>
      );

    return `${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(entry: any): boolean {
    return new Date(entry.expiresAt) > new Date();
  }

  /**
   * Get data from cache or fetch new data
   */
  private async getCachedOrFetch<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
    const cacheRepo = await RepositoryFactory.getNewsCacheRepository();

    // Try to get from cache first
    const cached = await cacheRepo.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      // For this demo, we store the actual data in cached format
      return JSON.parse(cached.content) as T;
    }

    // Fetch new data
    const data = await fetchFn();

    // Create cache entry using the CachedNewsItem format
    const cacheItem = {
      id: cacheKey,
      title: `Cache: ${cacheKey}`,
      content: JSON.stringify(data),
      sourceUrl: 'internal-cache',
      publishedAt: new Date().toISOString(),
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.CACHE_DURATION).toISOString(),
    };

    await cacheRepo.set(cacheKey, cacheItem);
    return data;
  }

  /**
   * Fetch news articles
   */
  async fetchArticles(params: NewsSearchParams = {}): Promise<NewsApiResponse> {
    await this.simulateApiDelay();

    const cacheKey = this.generateCacheKey('articles', params);

    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        // Simulate API parameters validation
        if (params.pageSize && params.pageSize > 100) {
          throw new NewsServiceError(
            NewsErrorCode.PARAMETER_INVALID,
            'Page size cannot exceed 100'
          );
        }

        // Generate mock articles based on parameters
        const pageSize = params.pageSize || 20;
        const totalResults = 500; // Simulate total available articles

        let articles = MockNewsGenerator.generateArticles(pageSize, params.category);

        // Apply search filtering
        if (params.query) {
          const query = params.query.toLowerCase();
          articles = articles.filter(
            (article) =>
              article.title.toLowerCase().includes(query) ||
              article.description.toLowerCase().includes(query)
          );
        }

        // Apply source filtering
        if (params.sources && params.sources.length > 0) {
          articles = articles.filter((article) => params.sources!.includes(article.source.id));
        }

        // Apply sorting
        switch (params.sortBy) {
          case NewsSortBy.PUBLISHED_AT:
            articles.sort(
              (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
            break;
          case NewsSortBy.POPULARITY:
            articles.sort((_a, _b) => Math.random() - 0.5); // Random for demo
            break;
          case NewsSortBy.RELEVANCY:
          default:
            // Keep original order for relevancy
            break;
        }

        return {
          status: 'ok' as const,
          totalResults: Math.min(totalResults, articles.length * 10), // Simulate more results
          articles,
        };
      } catch (error) {
        if (error instanceof NewsServiceError) {
          throw error;
        }

        throw new NewsServiceError(NewsErrorCode.UNKNOWN_ERROR, 'Failed to fetch articles');
      }
    });
  }

  /**
   * Fetch news sources
   */
  async fetchSources(category?: NewsCategory): Promise<NewsSourcesResponse> {
    await this.simulateApiDelay();

    const cacheKey = this.generateCacheKey('sources', { category });

    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        let sources = [...MockNewsGenerator.SOURCES];

        if (category) {
          sources = sources.filter(
            (source) => source.category === category || source.category === NewsCategory.GENERAL
          );
        }

        return {
          status: 'ok' as const,
          sources,
        };
      } catch (error) {
        throw new NewsServiceError(NewsErrorCode.UNKNOWN_ERROR, 'Failed to fetch sources');
      }
    });
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<NewsPreferences | null> {
    const prefsRepo = await RepositoryFactory.getUserPreferencesRepository();
    return prefsRepo.getNewsPreferences(userId);
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    updates: Partial<Omit<NewsPreferences, 'userId' | 'updatedAt'>>
  ): Promise<NewsPreferences> {
    const prefsRepo = await RepositoryFactory.getUserPreferencesRepository();

    const existing = await prefsRepo.getNewsPreferences(userId);
    const updated: NewsPreferences = {
      userId,
      favoriteCategories: existing?.favoriteCategories || [],
      favoriteSources: existing?.favoriteSources || [],
      defaultSortBy: existing?.defaultSortBy || NewsSortBy.PUBLISHED_AT,
      articlesPerPage: existing?.articlesPerPage || 20,
      autoRefreshInterval: existing?.autoRefreshInterval || 30,
      readArticles: existing?.readArticles || [],
      bookmarkedArticles: existing?.bookmarkedArticles || [],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await prefsRepo.setNewsPreferences(userId, updated);
    return updated;
  }

  /**
   * Mark article as read
   */
  async markAsRead(userId: string, articleId: string): Promise<void> {
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) {
      return;
    }

    if (!preferences.readArticles.includes(articleId)) {
      preferences.readArticles.push(articleId);
      await this.updateUserPreferences(userId, { readArticles: preferences.readArticles });
    }
  }

  /**
   * Toggle bookmark on article
   */
  async toggleBookmark(userId: string, articleId: string): Promise<boolean> {
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) {
      return false;
    }

    const isBookmarked = preferences.bookmarkedArticles.includes(articleId);
    let bookmarkedArticles: string[];

    if (isBookmarked) {
      bookmarkedArticles = preferences.bookmarkedArticles.filter((id) => id !== articleId);
    } else {
      bookmarkedArticles = [...preferences.bookmarkedArticles, articleId];
    }

    await this.updateUserPreferences(userId, { bookmarkedArticles });
    return !isBookmarked;
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId: string): Promise<NewsAnalytics> {
    const preferences = await this.getUserPreferences(userId);

    if (!preferences) {
      return {
        totalArticlesRead: 0,
        totalBookmarks: 0,
        favoriteCategory: null,
        readingStreak: 0,
        avgReadingTime: 0,
        lastActiveDate: new Date().toISOString(),
      };
    }

    // Calculate favorite category
    const categoryCounts: Record<NewsCategory, number> = {} as any;
    preferences.favoriteCategories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const favoriteCategory =
      Object.keys(categoryCounts).length > 0
        ? (Object.keys(categoryCounts).reduce((a, b) =>
            categoryCounts[a as NewsCategory] > categoryCounts[b as NewsCategory] ? a : b
          ) as NewsCategory)
        : null;

    return {
      totalArticlesRead: preferences.readArticles.length,
      totalBookmarks: preferences.bookmarkedArticles.length,
      favoriteCategory,
      readingStreak: Math.floor(Math.random() * 30) + 1, // Mock streak
      avgReadingTime: Math.floor(Math.random() * 45) + 15, // Mock average
      lastActiveDate: preferences.updatedAt,
    };
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    const cacheRepo = await RepositoryFactory.getNewsCacheRepository();
    await cacheRepo.clear();
  }
}

// Export singleton instance
export const newsService = NewsService.getInstance();
