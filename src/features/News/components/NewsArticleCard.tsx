/**
 * News Article Card Component
 * Displays a user-created news article in card format
 */

import React from 'react';
import { IconCalendar, IconClock, IconEdit, IconTrash, IconUser } from '@tabler/icons-react';
import { ActionIcon, Badge, Card, Group, Image, Stack, Text, Title, Tooltip } from '@mantine/core';
import { UserNewsArticle } from '../types';

interface NewsArticleCardProps {
  article: UserNewsArticle;
  showAuthor?: boolean;
  onEdit?: (article: UserNewsArticle) => void;
  onDelete?: (article: UserNewsArticle) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  viewMode?: 'grid' | 'list';
}

export function NewsArticleCard({
  article,
  showAuthor = true,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  viewMode = 'grid',
}: NewsArticleCardProps) {
  // Strip HTML tags from description for preview
  const getTextPreview = (html: string, maxLength: number = 150) => {
    const textContent = html.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength
      ? `${textContent.substring(0, maxLength)}...`
      : textContent;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'blue',
      business: 'green',
      entertainment: 'pink',
      health: 'teal',
      science: 'violet',
      sports: 'orange',
      technology: 'indigo',
    };
    return colors[category.toLowerCase()] || 'gray';
  };

  if (viewMode === 'list') {
    // List view - horizontal layout
    return (
      <Card withBorder shadow="sm" radius="md" p="md">
        <Group align="flex-start" gap="md">
          {/* Image */}
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              width={120}
              height={80}
              alt={article.title}
              fallbackSrc="https://via.placeholder.com/120x80?text=No+Image"
              radius="sm"
            />
          )}

          {/* Content */}
          <Stack gap="xs" style={{ flex: 1 }}>
            {/* Header with category and status */}
            <Group gap="xs">
              <Badge color={getCategoryColor(article.category)} variant="light" size="sm">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Badge>
              {!article.isPublished && (
                <Badge color="yellow" variant="light" size="sm">
                  Draft
                </Badge>
              )}
            </Group>

            {/* Title */}
            <Title order={4} lineClamp={1}>
              {article.title}
            </Title>

            {/* Intro */}
            <Text size="sm" c="dimmed" lineClamp={1}>
              {article.intro}
            </Text>

            {/* Description preview */}
            <Text size="sm" lineClamp={2}>
              {getTextPreview(article.description, 200)}
            </Text>

            {/* Metadata */}
            <Group gap="sm">
              {showAuthor && (
                <Group gap="xs">
                  <IconUser size={14} />
                  <Text size="xs" c="dimmed">
                    {article.authorName}
                  </Text>
                </Group>
              )}
              <Group gap="xs">
                <IconCalendar size={14} />
                <Text size="xs" c="dimmed">
                  {formatDate(article.updatedAt)}
                </Text>
              </Group>
              <Group gap="xs">
                <IconClock size={14} />
                <Text size="xs" c="dimmed">
                  {article.readingTime} min read
                </Text>
              </Group>
            </Group>
          </Stack>

          {/* Action buttons */}
          {(canEdit || canDelete) && (
            <Group gap="xs">
              {canEdit && onEdit && (
                <Tooltip label="Edit article">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="sm"
                    onClick={() => onEdit(article)}
                  >
                    <IconEdit size={14} />
                  </ActionIcon>
                </Tooltip>
              )}

              {canDelete && onDelete && (
                <Tooltip label="Delete article">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={() => onDelete(article)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          )}
        </Group>
      </Card>
    );
  }

  // Grid view - vertical layout (original)
  return (
    <Card withBorder shadow="sm" radius="md" p="md" h="100%">
      <Card.Section>
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            height={200}
            alt={article.title}
            fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
          />
        )}
      </Card.Section>

      <Stack gap="sm" mt="md">
        {/* Header with category and status */}
        <Group justify="space-between" align="flex-start">
          <Badge color={getCategoryColor(article.category)} variant="light" size="sm">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>

          {!article.isPublished && (
            <Badge color="yellow" variant="light" size="sm">
              Draft
            </Badge>
          )}
        </Group>

        {/* Title */}
        <Title order={3} lineClamp={2}>
          {article.title}
        </Title>

        {/* Intro */}
        <Text size="sm" c="dimmed" lineClamp={2}>
          {article.intro}
        </Text>

        {/* Description preview */}
        <Text size="sm" lineClamp={3}>
          {getTextPreview(article.description)}
        </Text>

        {/* Footer with metadata */}
        <Group justify="space-between" align="center" mt="auto">
          <Stack gap="xs">
            {showAuthor && (
              <Group gap="xs">
                <IconUser size={14} />
                <Text size="xs" c="dimmed">
                  {article.authorName}
                </Text>
              </Group>
            )}

            <Group gap="sm">
              <Group gap="xs">
                <IconCalendar size={14} />
                <Text size="xs" c="dimmed">
                  {formatDate(article.updatedAt)}
                </Text>
              </Group>

              <Group gap="xs">
                <IconClock size={14} />
                <Text size="xs" c="dimmed">
                  {article.readingTime} min read
                </Text>
              </Group>
            </Group>
          </Stack>

          {/* Action buttons */}
          {(canEdit || canDelete) && (
            <Group gap="xs">
              {canEdit && onEdit && (
                <Tooltip label="Edit article">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="sm"
                    onClick={() => onEdit(article)}
                  >
                    <IconEdit size={14} />
                  </ActionIcon>
                </Tooltip>
              )}

              {canDelete && onDelete && (
                <Tooltip label="Delete article">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={() => onDelete(article)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
