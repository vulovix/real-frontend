import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { AppDispatch, RootState } from '../../store';
import { clearData, Feature1State, fetchDataStart } from './slice';

const Feature1Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.feature1
  ) as Feature1State;

  const handleFetchData = () => {
    dispatch(fetchDataStart());
  };

  const handleClearData = () => {
    dispatch(clearData());
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
          This page demonstrates Redux-Saga for handling asynchronous operations. Click "Fetch Data
          via Saga" to trigger a saga that simulates an API call.
        </Text>
      </Card>
    </Stack>
  );
};

export default Feature1Page;
