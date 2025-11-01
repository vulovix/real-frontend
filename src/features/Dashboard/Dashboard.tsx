/**
 * Dashboard Feature Component
 * Main dashboard with user info and features
 */

import React from 'react';
import { IconLogout, IconNews, IconSettings, IconUsers } from '@tabler/icons-react';
import { Badge, Button, Card, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutRequest, selectAuth } from '../Auth/slice';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const user = authState.currentUser;

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  if (!user) {
    return (
      <div>
        <Text>Loading user information...</Text>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'red';
      case 'editor':
        return 'blue';
      case 'user':
      default:
        return 'green';
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={1}>Dashboard</Title>
          <Group gap="xs" mt="xs">
            <Text size="lg" c="dimmed">
              Welcome back, {user.name}
            </Text>
            <Badge color={getRoleBadgeColor(user.role)} variant="light">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </Group>
        </div>
        <Button variant="outline" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
          Logout
        </Button>
      </Group>

      {/* User Info Card */}
      <Card withBorder>
        <Title order={3} mb="md">
          Account Information
        </Title>
        <Stack gap="sm">
          <Group>
            <Text fw={500} w={100}>
              Name:
            </Text>
            <Text>{user.name}</Text>
          </Group>
          <Group>
            <Text fw={500} w={100}>
              Email:
            </Text>
            <Text>{user.email}</Text>
          </Group>
          <Group>
            <Text fw={500} w={100}>
              Role:
            </Text>
            <Badge color={getRoleBadgeColor(user.role)} variant="light">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </Group>
          <Group>
            <Text fw={500} w={100}>
              Member since:
            </Text>
            <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
          </Group>
        </Stack>
      </Card>

      {/* Feature Cards */}
      <Title order={2}>Available Features</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder h="100%">
            <Stack align="center" gap="md">
              <IconNews size={48} stroke={1.5} />
              <Title order={4}>News Management</Title>
              <Text ta="center" c="dimmed" size="sm">
                Create, edit, and manage news articles
              </Text>
              <Button variant="light" fullWidth disabled>
                Coming Soon
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder h="100%">
            <Stack align="center" gap="md">
              <IconUsers size={48} stroke={1.5} />
              <Title order={4}>User Management</Title>
              <Text ta="center" c="dimmed" size="sm">
                Manage user accounts and permissions
              </Text>
              <Button variant="light" fullWidth disabled={user.role !== 'admin'}>
                {user.role === 'admin' ? 'Coming Soon' : 'Admin Only'}
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder h="100%">
            <Stack align="center" gap="md">
              <IconSettings size={48} stroke={1.5} />
              <Title order={4}>Settings</Title>
              <Text ta="center" c="dimmed" size="sm">
                Configure your account preferences
              </Text>
              <Button variant="light" fullWidth disabled>
                Coming Soon
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
