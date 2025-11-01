import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Code, Group, Stack, Text, Title } from '@mantine/core';

const NoSidebarPage: React.FC = () => {
  return (
    <Stack gap="md">
      <Title order={2}>Route Without Sidebar</Title>

      <Card>
        <Text mb="md">
          This page demonstrates a route that doesn't have a sidebar. Notice how the layout
          automatically adapts and the sidebar toggle button is not shown.
        </Text>

        <Text mb="md">
          This is useful for pages that don't need additional contextual information or when you
          want to maximize the content area.
        </Text>
      </Card>

      <Card>
        <Text fw={500} mb="md">
          Route Configuration:
        </Text>
        <Code block>
          {`<Route 
  path="/no-sidebar" 
  element={
    <RouteLayout pageName="No Sidebar Example">
      <NoSidebarPage />
    </RouteLayout>
  } 
/>`}
        </Code>
        <Text size="sm" c="dimmed" mt="sm">
          Notice that we don't pass a <Code>sidebarContent</Code> prop, so it defaults to null.
        </Text>
      </Card>

      <Card>
        <Text fw={500} mb="md">
          Navigation:
        </Text>
        <Group>
          <Button component={Link} to="/" variant="outline">
            Back to Home
          </Button>
          <Button component={Link} to="/saga">
            Saga (with sidebar)
          </Button>
          <Button component={Link} to="/thunk">
            Thunk (with sidebar)
          </Button>
        </Group>
      </Card>
    </Stack>
  );
};

export default NoSidebarPage;
