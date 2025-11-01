import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Card, Loader, Stack, Text } from '@mantine/core';
import { Feature1State } from '../../../features/Feature1/slice';
import { RootState } from '../../../store';

const SagaSidebar: React.FC = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.feature1
  ) as Feature1State;

  return (
    <Stack gap="md">
      <Text fw={500} size="sm">
        Saga Feature Info
      </Text>

      <Card p="sm" bg="blue.0">
        <Text size="xs" fw={500} mb="xs" c="blue.8">
          Redux-Saga State:
        </Text>
        <Stack gap="xs">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="xs" c="blue.7">
              Status:
            </Text>
            {loading ? (
              <Badge color="yellow" size="xs" leftSection={<Loader size={10} />}>
                Loading
              </Badge>
            ) : error ? (
              <Badge color="red" size="xs">
                Error
              </Badge>
            ) : data.length > 0 ? (
              <Badge color="green" size="xs">
                Success
              </Badge>
            ) : (
              <Badge color="gray" size="xs">
                Idle
              </Badge>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text size="xs" c="blue.7">
              Items:
            </Text>
            <Text size="xs" c="blue.8" fw={500}>
              {data.length}
            </Text>
          </div>
          {error && (
            <Text size="xs" c="red" style={{ wordBreak: 'break-word' }}>
              {error}
            </Text>
          )}
        </Stack>
      </Card>

      <Card p="sm" bg="gray.0">
        <Text size="xs" fw={500} mb="xs">
          About Redux-Saga:
        </Text>
        <Text size="xs" c="dimmed">
          • Uses generator functions for async flow control
        </Text>
        <Text size="xs" c="dimmed">
          • Handles complex async operations with ease
        </Text>
        <Text size="xs" c="dimmed">
          • Great for testing and cancellation
        </Text>
        <Text size="xs" c="dimmed">
          • Perfect for complex side effects
        </Text>
      </Card>
    </Stack>
  );
};

export default SagaSidebar;
