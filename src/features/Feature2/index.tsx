import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { AppDispatch, RootState } from '../../store';
import { clearPosts, Feature2State } from './slice';
import { fetchPosts } from './thunk';

const Feature2Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.feature2
  ) as Feature2State;

  const handleFetchData = () => {
    dispatch(fetchPosts());
  };

  const handleClearData = () => {
    dispatch(clearPosts());
  };

  return (
    <Stack gap="md">
      <Title order={2}>Feature 2 - Redux Thunk</Title>

      <Group>
        <Button onClick={handleFetchData} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Data via Thunk'}
        </Button>
        <Button variant="outline" onClick={handleClearData} disabled={loading}>
          Clear Data
        </Button>
      </Group>

      {loading && (
        <Card>
          <Group>
            <Loader size="sm" />
            <Text>Loading data via Redux Thunk...</Text>
          </Group>
        </Card>
      )}

      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      {posts.length > 0 && (
        <Card>
          <Text fw={500} mb="xs">
            Posts from API:
          </Text>
          <Stack gap="xs">
            {posts.slice(0, 5).map((post) => (
              <Card key={post.id} withBorder p="sm">
                <Title order={6} mb="xs">
                  {post.title}
                </Title>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {post.body}
                </Text>
                <Text size="xs" mt="xs" c="gray">
                  Post ID: {post.id} | User ID: {post.userId}
                </Text>
              </Card>
            ))}
            {posts.length > 5 && (
              <Text size="xs" c="dimmed">
                Showing first 5 of {posts.length} posts...
              </Text>
            )}
          </Stack>
        </Card>
      )}

      <Card>
        <Text size="sm" c="dimmed">
          This page demonstrates Redux Thunk for handling asynchronous operations. Click "Fetch Data
          via Thunk" to load real posts from JSONPlaceholder API.
        </Text>
      </Card>
    </Stack>
  );
};

export default Feature2Page;
