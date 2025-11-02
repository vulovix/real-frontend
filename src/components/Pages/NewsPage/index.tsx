/**
 * News Page Component
 * Main page for displaying and managing user news articles
 */

import React, { useEffect, useState } from 'react';
import { IconBug, IconDatabase, IconPlus, IconTrash } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { NewsArticleList } from '../../../features/News/components';
import { useNewsSeeder } from '../../../hooks/useNewsSeeder';

export function NewsPage() {
  const { isSeeding, isClearing, seedStatus, seedArticles, clearArticles, checkSeedStatus } =
    useNewsSeeder();
  const [showSeedModal, setShowSeedModal] = useState(false);

  useEffect(() => {
    // Check seed status on component mount
    checkSeedStatus();
  }, [checkSeedStatus]);

  const handleCreateArticle = () => {
    // TODO: This will be implemented when the create article form is ready
    // For now, do nothing - this will open a modal or navigate to a form
  };

  const handleEditArticle = (articleId: string) => {
    // TODO: This will be implemented when the edit article form is ready
    // For now, do nothing - this will open an edit modal or navigate to edit form
    void articleId; // Avoid unused parameter warning
  };

  const handleDeleteArticle = (articleId: string) => {
    // TODO: This will be implemented with proper confirmation dialog
    // For now, do nothing - this will show a confirmation dialog
    void articleId; // Avoid unused parameter warning
  };

  const handleSeedDatabase = async () => {
    try {
      await seedArticles();
      setShowSeedModal(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleClearDatabase = async () => {
    try {
      await clearArticles();
      setShowSeedModal(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDebugRepository = async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('=== News Repository Debug Test ===');

      // Import repository
      const { RepositoryFactory } = await import('../../../services/Repository');
      const newsRepo = await RepositoryFactory.getNewsArticleRepository();
      // eslint-disable-next-line no-console
      console.log('✓ Repository initialized');

      // Test findAll method
      // eslint-disable-next-line no-console
      console.log('\n--- Testing findAll() ---');
      const allArticles = await newsRepo.findAll();
      // eslint-disable-next-line no-console
      console.log(`Found ${allArticles.length} total articles:`, allArticles);

      // Test findPublishedArticles method
      // eslint-disable-next-line no-console
      console.log('\n--- Testing findPublishedArticles() ---');
      const publishedArticles = await newsRepo.findPublishedArticles();
      // eslint-disable-next-line no-console
      console.log(`Found ${publishedArticles.length} published articles:`, publishedArticles);

      alert(
        `Debug complete! Found ${allArticles.length} total articles, ${publishedArticles.length} published. Check console for details.`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Debug test failed:', error);
      alert(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>News Articles</Title>
            {seedStatus && (
              <Group gap="xs" mt="xs">
                <Text size="sm" c="dimmed">
                  {seedStatus.articleCount} articles in database
                </Text>
              </Group>
            )}
          </div>

          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconBug size={16} />}
              onClick={handleDebugRepository}
              color="orange"
            >
              Debug
            </Button>
            <Button
              variant="light"
              leftSection={<IconDatabase size={16} />}
              onClick={() => setShowSeedModal(true)}
            >
              Database
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={handleCreateArticle}>
              Create Article
            </Button>
          </Group>
        </Group>

        {/* News Articles List */}
        <NewsArticleList onEditArticle={handleEditArticle} onDeleteArticle={handleDeleteArticle} />
      </Stack>

      {/* Seed Database Modal */}
      <Modal
        opened={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        title="Database Management"
        size="md"
      >
        <Stack gap="md">
          <Card withBorder p="md">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={500}>Current Status</Text>
                <Badge color={seedStatus?.hasArticles ? 'green' : 'gray'} variant="light">
                  {seedStatus?.articleCount || 0} articles
                </Badge>
              </Group>

              {seedStatus && !seedStatus.hasArticles && (
                <Text size="sm" c="dimmed">
                  No articles found. You can seed the database with sample articles to get started.
                </Text>
              )}
            </Stack>
          </Card>

          <Group justify="flex-end" gap="sm">
            {seedStatus?.hasArticles && (
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={16} />}
                loading={isClearing}
                onClick={handleClearDatabase}
              >
                Clear All Articles
              </Button>
            )}

            <Button
              leftSection={<IconDatabase size={16} />}
              loading={isSeeding}
              onClick={handleSeedDatabase}
              disabled={seedStatus?.hasArticles}
            >
              {seedStatus?.hasArticles
                ? 'Already Seeded'
                : `Seed ${seedStatus?.sampleCount || 8} Sample Articles`}
            </Button>
          </Group>

          <Text size="xs" c="dimmed" ta="center">
            Sample articles include various categories and realistic content for testing.
          </Text>
        </Stack>
      </Modal>
    </>
  );
}
