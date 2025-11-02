/**
 * News Article List Component
 * Displays a list of user news articles with filtering and loading states
 */

import React, { useEffect } from 'react';
import { IconGrid3x3, IconList, IconRefresh } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../Auth/slice';
import {
  fetchUserArticles,
  selectFilteredUserArticles,
  selectIsUserNewsLoading,
  selectUserNewsError,
  selectUserNewsFilters,
  updateUserNewsFilters,
} from '../slice';
import { NewsCategory } from '../types';
import { NewsArticleCard } from './NewsArticleCard';

interface NewsArticleListProps {
  onEditArticle?: (articleId: string) => void;
  onDeleteArticle?: (articleId: string) => void;
}

export function NewsArticleList({ onEditArticle, onDeleteArticle }: NewsArticleListProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const currentUser = auth.currentUser;

  const filters = useAppSelector(selectUserNewsFilters);
  const filteredArticles = useAppSelector(selectFilteredUserArticles(currentUser?.id));
  const isLoading = useAppSelector(selectIsUserNewsLoading);
  const error = useAppSelector(selectUserNewsError);

  // Load articles on component mount
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('NewsArticleList: Dispatching fetchUserArticles with isPublished: true');
    dispatch(fetchUserArticles({ isPublished: true }))
      .unwrap()
      .then((articles) => {
        // eslint-disable-next-line no-console
        console.log('NewsArticleList: Successfully fetched articles:', articles);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('NewsArticleList: Failed to fetch articles:', error);
      });
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUserArticles({ isPublished: true }));
  };

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    dispatch(updateUserNewsFilters({ [key]: value }));
  };

  const canEditArticle = (article: any) => {
    return Boolean(currentUser && article.authorId === currentUser.id);
  };

  const canDeleteArticle = (article: any) => {
    return Boolean(
      currentUser && (article.authorId === currentUser.id || currentUser.role === 'admin')
    );
  };

  const handleEditClick = (article: any) => {
    if (onEditArticle) {
      onEditArticle(article.id);
    }
  };

  const handleDeleteClick = (article: any) => {
    if (onDeleteArticle) {
      onDeleteArticle(article.id);
    }
  };

  if (error) {
    return (
      <Center p="xl">
        <Stack align="center" gap="md">
          <Text c="red" size="lg">
            Error loading articles
          </Text>
          <Text c="dimmed" ta="center">
            {error.message}
          </Text>
          <Button leftSection={<IconRefresh size={16} />} onClick={handleRefresh}>
            Try Again
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      {/* Filters */}
      <Group justify="space-between" align="flex-end">
        <Group gap="md">
          <Switch
            label="Show only my articles"
            checked={filters.showOnlyMyArticles}
            onChange={(event) =>
              handleFilterChange('showOnlyMyArticles', event.currentTarget.checked)
            }
            disabled={!currentUser}
          />

          <Select
            label="Category"
            placeholder="All categories"
            data={[
              { value: '', label: 'All categories' },
              ...Object.values(NewsCategory).map((category) => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1),
              })),
            ]}
            value={filters.category || ''}
            onChange={(value) => handleFilterChange('category', value as NewsCategory | undefined)}
            clearable
            w={200}
          />

          <Select
            label="Sort by"
            data={[
              { value: 'updatedAt', label: 'Last updated' },
              { value: 'createdAt', label: 'Date created' },
              { value: 'title', label: 'Title' },
            ]}
            value={filters.sortBy}
            onChange={(value) =>
              handleFilterChange('sortBy', value as 'updatedAt' | 'createdAt' | 'title')
            }
            w={150}
          />

          <Select
            label="Order"
            data={[
              { value: 'desc', label: 'Newest first' },
              { value: 'asc', label: 'Oldest first' },
            ]}
            value={filters.sortOrder}
            onChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
            w={120}
          />
        </Group>

        <Group gap="xs">
          {/* View Mode Toggle */}
          <Group gap={2}>
            <Tooltip label="Grid view">
              <ActionIcon
                variant={filters.viewMode === 'grid' ? 'filled' : 'light'}
                onClick={() => handleFilterChange('viewMode', 'grid')}
                size="md"
              >
                <IconGrid3x3 size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="List view">
              <ActionIcon
                variant={filters.viewMode === 'list' ? 'filled' : 'light'}
                onClick={() => handleFilterChange('viewMode', 'list')}
                size="md"
              >
                <IconList size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={handleRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Articles Grid */}
      {isLoading && filteredArticles.length === 0 ? (
        <Center p="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading articles...</Text>
          </Stack>
        </Center>
      ) : filteredArticles.length === 0 ? (
        <Center p="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              No articles found
            </Text>
            <Text c="dimmed" ta="center">
              {filters.showOnlyMyArticles
                ? "You haven't created any articles yet"
                : 'No articles have been published yet'}
            </Text>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={filters.viewMode === 'grid' ? { base: 1, md: 2, lg: 3 } : 1} spacing="lg">
          {filteredArticles.map((article) => (
            <NewsArticleCard
              key={article.id}
              article={article}
              showAuthor={!filters.showOnlyMyArticles}
              canEdit={canEditArticle(article)}
              canDelete={canDeleteArticle(article)}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              viewMode={filters.viewMode}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Article count */}
      {filteredArticles.length > 0 && (
        <Group justify="center">
          <Text c="dimmed" size="sm">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            {filters.showOnlyMyArticles && ' (your articles)'}
          </Text>
        </Group>
      )}
    </Stack>
  );
}
