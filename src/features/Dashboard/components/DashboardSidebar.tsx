/**
 * Dashboard Sidebar Component
 * Provides navigation and quick actions for the dashboard
 */

import React from 'react';
import {
  IconActivity,
  IconBell,
  IconChevronRight,
  IconDashboard,
  IconLogout,
  IconNews,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { Badge, Box, Button, Card, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { logoutRequest, selectAuth } from '../../../features/Auth/slice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export function DashboardSidebar() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const user = authState.currentUser;

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const quickActions = [
    {
      icon: IconNews,
      label: 'News Feed',
      description: 'Latest news updates',
      color: 'blue',
      disabled: false,
    },
    {
      icon: IconUsers,
      label: 'User Management',
      description: 'Manage users',
      color: 'green',
      disabled: user?.role !== 'admin',
    },
    {
      icon: IconSettings,
      label: 'Settings',
      description: 'App preferences',
      color: 'gray',
      disabled: true,
    },
  ];

  const recentActivity = [
    { label: 'Profile updated', time: '2 hours ago' },
    { label: 'Dashboard accessed', time: '1 day ago' },
    { label: 'Settings changed', time: '3 days ago' },
  ];

  return (
    <Stack gap="md">
      {/* User Info Card */}
      <Card withBorder p="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Welcome back
            </Text>
            <Badge size="sm" color={user?.role === 'admin' ? 'red' : 'blue'} variant="light">
              {user?.role || 'User'}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed" truncate>
            {user?.email}
          </Text>
        </Stack>
      </Card>

      {/* Quick Actions */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Quick Actions
            </Text>
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconDashboard size={12} />
            </ThemeIcon>
          </Group>

          <Stack gap="xs">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="subtle"
                justify="space-between"
                fullWidth
                leftSection={<action.icon size={16} />}
                rightSection={<IconChevronRight size={12} />}
                disabled={action.disabled}
                size="xs"
                styles={{
                  inner: { justifyContent: 'space-between' },
                  label: { flex: 1, textAlign: 'left' },
                }}
              >
                <Box>
                  <Text size="xs" fw={500}>
                    {action.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {action.description}
                  </Text>
                </Box>
              </Button>
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Recent Activity */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Recent Activity
            </Text>
            <ThemeIcon size="sm" variant="light" color="green">
              <IconActivity size={12} />
            </ThemeIcon>
          </Group>

          <Stack gap="xs">
            {recentActivity.map((activity, index) => (
              <Group key={index} justify="space-between" wrap="nowrap">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="xs" truncate>
                    {activity.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {activity.time}
                  </Text>
                </Box>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Notifications */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Notifications
            </Text>
            <Badge size="sm" color="red" variant="filled">
              3
            </Badge>
          </Group>

          <Stack gap="xs">
            <Group>
              <ThemeIcon size="sm" variant="light" color="orange">
                <IconBell size={12} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text size="xs" fw={500}>
                  System Update
                </Text>
                <Text size="xs" c="dimmed">
                  New features available
                </Text>
              </Box>
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Divider />

      {/* Logout Button */}
      <Button
        variant="light"
        color="red"
        leftSection={<IconLogout size={16} />}
        onClick={handleLogout}
        size="sm"
      >
        Sign Out
      </Button>
    </Stack>
  );
}
