import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { AppDispatch, RootState } from '../../store';
import { clearData, Feature2State } from './slice';
import { fetchThunkData } from './thunk';

const Feature2Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.feature2
  ) as Feature2State;

  const handleFetchData = () => {
    dispatch(fetchThunkData());
  };

  const handleClearData = () => {
    dispatch(clearData());
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

      {data.length > 0 && (
        <Card>
          <Text fw={500} mb="xs">
            Fetched Data:
          </Text>
          <Stack gap="xs">
            {data.map((item: string, index: number) => (
              <Text key={index} size="sm">
                • {item}
              </Text>
            ))}
          </Stack>
        </Card>
      )}

      <Card>
        <Text size="sm" c="dimmed">
          This page demonstrates Redux Thunk for handling asynchronous operations. Click "Fetch Data
          via Thunk" to trigger a thunk that simulates an API call.
        </Text>
      </Card>
    </Stack>
  );
};

export default Feature2Page;
