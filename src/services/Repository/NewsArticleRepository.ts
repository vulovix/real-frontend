/**
 * News Article Repository
 * Manages user-created news articles in IndexedDB
 */

import { UserNewsArticle } from '../../features/News/types';
import { BaseRepository, DATABASE_CONFIG, databaseConnection } from '../Database';

export class NewsArticleRepository extends BaseRepository<UserNewsArticle> {
  constructor() {
    super(DATABASE_CONFIG.STORES.USER_NEWS_ARTICLES, databaseConnection);
  }

  /**
   * Find articles by author ID
   */
  async findByAuthorId(authorId: string): Promise<UserNewsArticle[]> {
    try {
      // Use the safer approach: get all articles and filter in memory
      const allArticles = await this.findAll();
      return allArticles
        .filter((article) => article.authorId === authorId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      throw this.handleError('findByAuthorId', error);
    }
  }

  /**
   * Find published articles only
   */
  async findPublishedArticles(): Promise<UserNewsArticle[]> {
    try {
      // Always use the safer approach: get all articles and filter in memory
      // This avoids IndexedDB key range issues with boolean values
      const allArticles = await this.findAll();
      return allArticles
        .filter((article) => article.isPublished === true)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      throw this.handleError('findPublishedArticles', error);
    }
  }

  /**
   * Find articles by category
   */
  async findByCategory(category: string): Promise<UserNewsArticle[]> {
    try {
      // Use the safer approach: get all articles and filter in memory
      const allArticles = await this.findAll();
      return allArticles
        .filter((article) => article.category === category)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw this.handleError('findByCategory', error);
    }
  }

  /**
   * Search articles by title or intro
   */
  async searchArticles(query: string): Promise<UserNewsArticle[]> {
    try {
      const allArticles = await this.findAll();
      const searchTerm = query.toLowerCase();

      return allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.intro.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      throw this.handleError('searchArticles', error);
    }
  }

  /**
   * Check if user can edit article (ownership check)
   */
  async canUserEditArticle(articleId: string, userId: string): Promise<boolean> {
    try {
      const article = await this.findById(articleId);
      return article ? article.authorId === userId : false;
    } catch (error) {
      throw this.handleError('canUserEditArticle', error);
    }
  }

  /**
   * Get articles with pagination
   */
  async findWithPagination(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    articles: UserNewsArticle[];
    totalCount: number;
    hasMore: boolean;
  }> {
    try {
      const allArticles = await this.findPublishedArticles();
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      return {
        articles: allArticles.slice(startIndex, endIndex),
        totalCount: allArticles.length,
        hasMore: endIndex < allArticles.length,
      };
    } catch (error) {
      throw this.handleError('findWithPagination', error);
    }
  }

  /**
   * Get article count by author
   */
  async getAuthorArticleCount(authorId: string): Promise<number> {
    try {
      const articles = await this.findByAuthorId(authorId);
      return articles.length;
    } catch (error) {
      throw this.handleError('getAuthorArticleCount', error);
    }
  }

  /**
   * Calculate reading time from description content
   */
  calculateReadingTime(description: string): number {
    // Remove HTML tags and count words
    const text = description.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
    // Average reading speed: 200 words per minute
    return Math.max(1, Math.ceil(wordCount / 200));
  }

  /**
   * Update article with automatic updatedAt timestamp
   */
  async update(id: string, updates: Partial<UserNewsArticle>): Promise<UserNewsArticle> {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate reading time if description is updated
    if (updates.description) {
      updatesWithTimestamp.readingTime = this.calculateReadingTime(updates.description);
    }

    return super.update(id, updatesWithTimestamp);
  }

  /**
   * Get recent articles (for sidebar activity)
   */
  async getRecentArticles(limit: number = 5): Promise<UserNewsArticle[]> {
    try {
      const allArticles = await this.findPublishedArticles();
      return allArticles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      throw this.handleError('getRecentArticles', error);
    }
  }

  /**
   * Get recently updated articles (for sidebar activity)
   */
  async getRecentlyUpdatedArticles(limit: number = 5): Promise<UserNewsArticle[]> {
    try {
      const allArticles = await this.findPublishedArticles();
      return allArticles
        .filter((article) => article.updatedAt !== article.createdAt) // Only articles that were actually updated
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    } catch (error) {
      throw this.handleError('getRecentlyUpdatedArticles', error);
    }
  }

  /**
   * Get top authors by article count (for sidebar activity)
   */
  async getTopAuthors(limit: number = 5): Promise<
    Array<{
      authorId: string;
      authorName: string;
      articleCount: number;
      latestArticleDate: string;
    }>
  > {
    try {
      const allArticles = await this.findPublishedArticles();
      const authorMap = new Map<
        string,
        {
          authorName: string;
          articleCount: number;
          latestArticleDate: string;
        }
      >();

      // Group articles by author
      allArticles.forEach((article) => {
        const existing = authorMap.get(article.authorId);
        if (existing) {
          existing.articleCount++;
          if (new Date(article.createdAt) > new Date(existing.latestArticleDate)) {
            existing.latestArticleDate = article.createdAt;
          }
        } else {
          authorMap.set(article.authorId, {
            authorName: article.authorName,
            articleCount: 1,
            latestArticleDate: article.createdAt,
          });
        }
      });

      // Convert to array and sort by article count
      return Array.from(authorMap.entries())
        .map(([authorId, data]) => ({
          authorId,
          ...data,
        }))
        .sort((a, b) => b.articleCount - a.articleCount)
        .slice(0, limit);
    } catch (error) {
      throw this.handleError('getTopAuthors', error);
    }
  }

  /**
   * Get activity stats for sidebar
   */
  async getActivityStats(): Promise<{
    totalArticles: number;
    totalAuthors: number;
    articlesThisWeek: number;
    articlesThisMonth: number;
  }> {
    try {
      const allArticles = await this.findPublishedArticles();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const uniqueAuthors = new Set(allArticles.map((article) => article.authorId));
      const articlesThisWeek = allArticles.filter(
        (article) => new Date(article.createdAt) > oneWeekAgo
      );
      const articlesThisMonth = allArticles.filter(
        (article) => new Date(article.createdAt) > oneMonthAgo
      );

      return {
        totalArticles: allArticles.length,
        totalAuthors: uniqueAuthors.size,
        articlesThisWeek: articlesThisWeek.length,
        articlesThisMonth: articlesThisMonth.length,
      };
    } catch (error) {
      throw this.handleError('getActivityStats', error);
    }
  }
}
