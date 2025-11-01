import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { AppDispatch, RootState } from '../../store';
import { clearTodos, Feature1State, fetchTodosStart } from './slice';

const Feature1Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.feature1
  ) as Feature1State;

  const handleFetchData = () => {
    dispatch(fetchTodosStart());
  };

  const handleClearData = () => {
    dispatch(clearTodos());
  };

  return (
    <Stack gap="md">
      <Title order={2}>Feature 1 - Redux-Saga</Title>

      <Group>
        <Button onClick={handleFetchData} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Data via Saga'}
        </Button>
        <Button variant="outline" onClick={handleClearData} disabled={loading}>
          Clear Data
        </Button>
      </Group>

      {loading && (
        <Card>
          <Group>
            <Loader size="sm" />
            <Text>Loading data via Redux-Saga...</Text>
          </Group>
        </Card>
      )}

      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      {todos.length > 0 && (
        <Card>
          <Text fw={500} mb="xs">
            Todos from API:
          </Text>
          <Stack gap="xs">
            {todos.slice(0, 10).map((todo) => (
              <Card key={todo.id} withBorder p="xs">
                <Group justify="space-between">
                  <Text size="sm" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.title}
                  </Text>
                  <Text size="xs" c={todo.completed ? 'green' : 'orange'}>
                    {todo.completed ? 'Done' : 'Pending'}
                  </Text>
                </Group>
              </Card>
            ))}
            {todos.length > 10 && (
              <Text size="xs" c="dimmed">
                Showing first 10 of {todos.length} todos...
              </Text>
            )}
          </Stack>
        </Card>
      )}

      <Card>
        <Text size="sm" c="dimmed">
          This page demonstrates Redux-Saga for handling asynchronous operations. Click "Fetch Data
          via Saga" to load real todos from JSONPlaceholder API.
        </Text>
      </Card>
    </Stack>
  );
};

export default Feature1Page;
