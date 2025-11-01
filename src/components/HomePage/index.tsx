import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';

const HomePage: React.FC = () => {
  return (
    <Stack gap="md">
      <Title order={2}>Welcome to Redux Demo</Title>

      <Card>
        <Text mb="md">
          This application demonstrates the integration of Redux Toolkit with both Redux-Saga and
          Redux Thunk for handling asynchronous operations in a React application.
        </Text>

        <Stack gap="xs">
          <Text fw={500}>Features:</Text>
          <Text size="sm">• Redux Toolkit for state management</Text>
          <Text size="sm">• Redux-Saga for complex async flows</Text>
          <Text size="sm">• Redux Thunk for simple async operations</Text>
          <Text size="sm">• React Router v6 for navigation</Text>
          <Text size="sm">• Mantine UI components</Text>
          <Text size="sm">• TypeScript for type safety</Text>
          <Text size="sm">• Feature-based folder structure</Text>
        </Stack>
      </Card>

      <Card>
        <Text fw={500} mb="md">
          Try the Demo Features:
        </Text>
        <Group>
          <Button component={Link} to="/saga">
            Saga Feature
          </Button>
          <Button component={Link} to="/thunk" variant="outline">
            Thunk Feature
          </Button>
        </Group>
      </Card>

      <Card>
        <Text size="sm" c="dimmed">
          Navigate using the header links or the buttons above to see Redux-Saga and Redux Thunk in
          action. Each feature demonstrates different approaches to handling asynchronous state
          management.
        </Text>
      </Card>
    </Stack>
  );
};

export default HomePage;
