/**
 * NotFound Route Page (404)
 * Displays when user navigates to non-existent route
 * Uses RouteLayout for consistency
 */

import React from 'react';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import RouteLayout from '../../components/Layout/RouteLayout';

export function NotFoundRoute() {
  return (
    <RouteLayout pageName="Page Not Found">
      <Stack gap="xl" align="center" style={{ minHeight: '60vh', justifyContent: 'center' }}>
        {/* Large 404 Display */}
        <Stack align="center" gap="xs">
          <Title
            order={1}
            size="8rem"
            style={{
              fontSize: '8rem',
              fontWeight: 900,
              color: 'var(--mantine-color-gray-3)',
              lineHeight: 1,
            }}
          >
            404
          </Title>
          <Title order={2} ta="center">
            Page Not Found
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={400}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </Stack>

        {/* Helpful Actions */}
        <Card withBorder p="xl" radius="md" maw={500} w="100%">
          <Stack gap="md">
            <Text fw={500} ta="center">
              What would you like to do?
            </Text>

            <Group justify="center" gap="md">
              <Button
                component={Link}
                to="/"
                leftSection={<IconHome size={16} />}
                variant="filled"
                size="md"
              >
                Go Home
              </Button>

              <Button
                onClick={() => window.history.back()}
                leftSection={<IconArrowLeft size={16} />}
                variant="outline"
                size="md"
              >
                Go Back
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Additional Help */}
        <Card withBorder p="md" radius="md" maw={500} w="100%">
          <Text size="sm" c="dimmed" ta="center">
            If you believe this is an error, please check the URL or contact support.
          </Text>
        </Card>
      </Stack>
    </RouteLayout>
  );
}
