import React from 'react';
import { Card, Stack, Text } from '@mantine/core';

const AppOverviewSidebar: React.FC = () => {
  return (
    <Stack gap="md">
      <Text fw={500} size="sm">
        App Overview
      </Text>

      <Card p="sm" bg="blue.0">
        <Text size="xs" fw={500} mb="xs" c="blue.8">
          Technologies Used:
        </Text>
        <Text size="xs" c="blue.7">
          • React 19+ with hooks
        </Text>
        <Text size="xs" c="blue.7">
          • Redux Toolkit
        </Text>
        <Text size="xs" c="blue.7">
          • Redux-Saga
        </Text>
        <Text size="xs" c="blue.7">
          • Redux Thunk
        </Text>
        <Text size="xs" c="blue.7">
          • React Router v6
        </Text>
        <Text size="xs" c="blue.7">
          • Mantine UI
        </Text>
        <Text size="xs" c="blue.7">
          • TypeScript
        </Text>
      </Card>

      <Card p="sm" bg="gray.0">
        <Text size="xs" fw={500} mb="xs">
          Navigation:
        </Text>
        <Text size="xs" c="dimmed">
          Use the header links to navigate between different features that demonstrate Redux-Saga
          and Redux Thunk implementations.
        </Text>
      </Card>

      <Card p="sm" bg="orange.0">
        <Text size="xs" fw={500} mb="xs" c="orange.8">
          Quick Tips:
        </Text>
        <Text size="xs" c="orange.7">
          • Each page has its own sidebar content
        </Text>
        <Text size="xs" c="orange.7">
          • Use the toggle button to show/hide sidebar
        </Text>
        <Text size="xs" c="orange.7">
          • State is preserved between routes
        </Text>
      </Card>
    </Stack>
  );
};

export default AppOverviewSidebar;
