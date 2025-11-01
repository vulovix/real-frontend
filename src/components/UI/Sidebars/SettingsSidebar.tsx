import React from 'react';
import { Badge, Card, Stack, Text } from '@mantine/core';
import { useTheme } from '../../../providers/Theme/ThemeContext';
import { storageService } from '../../../services/storage';

const SettingsSidebar: React.FC = () => {
  const { theme } = useTheme();

  const getThemeIcon = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '❓';
    }
  };

  return (
    <Stack gap="md">
      <Text fw={500} size="sm">
        Settings Info
      </Text>

      <Card p="sm" bg="blue.0">
        <Text size="xs" fw={500} mb="xs" c="blue.8">
          Current Theme:
        </Text>
        <Stack gap="xs">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="xs" c="blue.7">
              Mode:
            </Text>
            <Badge color="blue" size="xs">
              {getThemeIcon(theme)} {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Badge>
          </div>
          <Text size="xs" c="blue.7">
            Theme preferences are automatically saved and will persist between sessions.
          </Text>
        </Stack>
      </Card>

      <Card p="sm" bg="green.0">
        <Text size="xs" fw={500} mb="xs" c="green.8">
          Storage Status:
        </Text>
        <Stack gap="xs">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="xs" c="green.7">
              Browser Storage:
            </Text>
            <Badge color={storageService.isAvailable() ? 'green' : 'red'} size="xs">
              {storageService.isAvailable() ? '✅ Available' : '❌ Unavailable'}
            </Badge>
          </div>
          <Text size="xs" c="green.7">
            Local storage is used to persist your settings across browser sessions.
          </Text>
        </Stack>
      </Card>

      <Card p="sm" bg="gray.0">
        <Text size="xs" fw={500} mb="xs">
          Quick Actions:
        </Text>
        <Text size="xs" c="dimmed">
          • Change theme preference
        </Text>
        <Text size="xs" c="dimmed">
          • Clear all stored settings
        </Text>
        <Text size="xs" c="dimmed">
          • View app information
        </Text>
      </Card>
    </Stack>
  );
};

export default SettingsSidebar;
