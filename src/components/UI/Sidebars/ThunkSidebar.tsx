import React from 'react';
import { useSelector } from 'react-redux';
import { Badge, Card, Loader, Stack, Text } from '@mantine/core';
import { Feature2State } from '../../features/feature-2/slice';
import { RootState } from '../../store';

const ThunkSidebar: React.FC = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.feature2
  ) as Feature2State;

  return (
    <Stack gap="md">
      <Text fw={500} size="sm">
        Thunk Feature Info
      </Text>

      <Card p="sm" bg="green.0">
        <Text size="xs" fw={500} mb="xs" c="green.8">
          Redux Thunk State:
        </Text>
        <Stack gap="xs">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="xs" c="green.7">
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
            <Text size="xs" c="green.7">
              Items:
            </Text>
            <Text size="xs" c="green.8" fw={500}>
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
          About Redux Thunk:
        </Text>
        <Text size="xs" c="dimmed">
          • Simple async action creators
        </Text>
        <Text size="xs" c="dimmed">
          • Built into Redux Toolkit
        </Text>
        <Text size="xs" c="dimmed">
          • Great for simple async operations
        </Text>
        <Text size="xs" c="dimmed">
          • Easy to understand and use
        </Text>
      </Card>
    </Stack>
  );
};

export default ThunkSidebar;
