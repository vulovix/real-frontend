/**
 * News Seeder Hook
 * React hook for managing news article seeding
 */

import { useCallback, useState } from 'react';
import { fetchNewsSidebarData, fetchUserArticles } from '../features/News/slice';
import { useAppDispatch } from '../store/hooks';
import { NewsArticleSeeder } from '../utils/NewsArticleSeeder';

interface UseNewsSeederReturn {
  isSeeding: boolean;
  isClearing: boolean;
  seedStatus: {
    hasArticles: boolean;
    articleCount: number;
    sampleCount: number;
  } | null;
  seedArticles: () => Promise<number>;
  clearArticles: () => Promise<void>;
  checkSeedStatus: () => Promise<void>;
  refreshNews: () => void;
}

export function useNewsSeeder(): UseNewsSeederReturn {
  const dispatch = useAppDispatch();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{
    hasArticles: boolean;
    articleCount: number;
    sampleCount: number;
  } | null>(null);

  const seedArticles = useCallback(async (): Promise<number> => {
    setIsSeeding(true);
    try {
      const count = await NewsArticleSeeder.seedArticles();

      // Refresh the news data after seeding
      dispatch(fetchUserArticles({ isPublished: true }));
      dispatch(fetchNewsSidebarData());

      // Update status
      await checkSeedStatus();

      return count;
    } finally {
      setIsSeeding(false);
    }
  }, [dispatch]);

  const clearArticles = useCallback(async (): Promise<void> => {
    setIsClearing(true);
    try {
      await NewsArticleSeeder.clearArticles();

      // Refresh the news data after clearing
      dispatch(fetchUserArticles({ isPublished: true }));
      dispatch(fetchNewsSidebarData());

      // Update status
      await checkSeedStatus();
    } finally {
      setIsClearing(false);
    }
  }, [dispatch]);

  const checkSeedStatus = useCallback(async (): Promise<void> => {
    const status = await NewsArticleSeeder.getSeedStatus();
    setSeedStatus(status);
  }, []);

  const refreshNews = useCallback(() => {
    dispatch(fetchUserArticles({ isPublished: true }));
    dispatch(fetchNewsSidebarData());
  }, [dispatch]);

  return {
    isSeeding,
    isClearing,
    seedStatus,
    seedArticles,
    clearArticles,
    checkSeedStatus,
    refreshNews,
  };
}
