/**
 * News Sidebar Component
 * Shows recent activity, stats, and user engagement data
 */

import React, { useEffect } from 'react';
import { IconArticle, IconEdit, IconTrendingUp, IconUsers } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchNewsSidebarData,
  selectNewsSidebarData,
  selectNewsSidebarError,
  selectNewsSidebarLoading,
} from '../slice';
import { UserNewsArticle } from '../types';

export function NewsSidebar() {
  const dispatch = useAppDispatch();
  const sidebarData = useAppSelector(selectNewsSidebarData);
  const isLoading = useAppSelector(selectNewsSidebarLoading);
  const error = useAppSelector(selectNewsSidebarError);

  useEffect(() => {
    dispatch(fetchNewsSidebarData());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }

    if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    }

    return 'Just now';
  };

  const ArticleItem = ({ article }: { article: UserNewsArticle }) => (
    <Paper p="xs" withBorder>
      <Stack gap="xs">
        <Text size="sm" fw={500} lineClamp={2}>
          {article.title}
        </Text>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Avatar size="xs" name={article.authorName} color="initials" />
            <Text size="xs" c="dimmed">
              {article.authorName}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {formatDate(article.createdAt)}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );

  if (isLoading && !sidebarData) {
    return (
      <Card withBorder p="md">
        <Group justify="center">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Loading activity...
          </Text>
        </Group>
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder p="md">
        <Text size="sm" c="red" ta="center">
          Failed to load activity
        </Text>
      </Card>
    );
  }

  if (!sidebarData) {
    return null;
  }

  return (
    <Stack gap="md">
      {/* Activity Stats */}
      <Card withBorder p="md">
        <Title order={4} mb="md">
          <Group gap="xs">
            <IconTrendingUp size={18} />
            Activity Overview
          </Group>
        </Title>

        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">Total Articles</Text>
            <Badge variant="light" color="blue">
              {sidebarData.activityStats.totalArticles}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm">Active Authors</Text>
            <Badge variant="light" color="green">
              {sidebarData.activityStats.totalAuthors}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm">This Week</Text>
            <Badge variant="light" color="orange">
              {sidebarData.activityStats.articlesThisWeek}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm">This Month</Text>
            <Badge variant="light" color="violet">
              {sidebarData.activityStats.articlesThisMonth}
            </Badge>
          </Group>
        </Stack>
      </Card>

      {/* Recent Articles */}
      {sidebarData.recentArticles.length > 0 && (
        <Card withBorder p="md">
          <Title order={4} mb="md">
            <Group gap="xs">
              <IconArticle size={18} />
              Recent Articles
            </Group>
          </Title>

          <Stack gap="sm">
            {sidebarData.recentArticles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </Stack>
        </Card>
      )}

      {/* Recently Updated */}
      {sidebarData.recentlyUpdatedArticles.length > 0 && (
        <Card withBorder p="md">
          <Title order={4} mb="md">
            <Group gap="xs">
              <IconEdit size={18} />
              Recently Updated
            </Group>
          </Title>

          <Stack gap="sm">
            {sidebarData.recentlyUpdatedArticles.map((article) => (
              <Paper key={article.id} p="xs" withBorder>
                <Stack gap="xs">
                  <Text size="sm" fw={500} lineClamp={2}>
                    {article.title}
                  </Text>
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Avatar size="xs" name={article.authorName} color="initials" />
                      <Text size="xs" c="dimmed">
                        {article.authorName}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {formatDate(article.updatedAt)}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Card>
      )}

      {/* Top Authors */}
      {sidebarData.topAuthors.length > 0 && (
        <Card withBorder p="md">
          <Title order={4} mb="md">
            <Group gap="xs">
              <IconUsers size={18} />
              Top Authors
            </Group>
          </Title>

          <Stack gap="sm">
            {sidebarData.topAuthors.map((author, index) => (
              <Paper key={author.authorId} p="xs" withBorder>
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <Badge
                      size="sm"
                      variant="light"
                      color={index === 0 ? 'gold' : index === 1 ? 'gray' : 'bronze'}
                    >
                      #{index + 1}
                    </Badge>
                    <Avatar size="sm" name={author.authorName} color="initials" />
                    <Stack gap={0}>
                      <Text size="sm" fw={500}>
                        {author.authorName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {author.articleCount} article{author.articleCount !== 1 ? 's' : ''}
                      </Text>
                    </Stack>
                  </Group>
                  <Tooltip label={`Latest: ${formatDate(author.latestArticleDate)}`}>
                    <Text size="xs" c="dimmed">
                      {formatDate(author.latestArticleDate)}
                    </Text>
                  </Tooltip>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
