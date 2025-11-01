import React, { useState } from 'react';
import { IconAlertTriangle, IconInfoCircle, IconPalette, IconTrash } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';
import { storageService } from '../../services/storage';

const SettingsPage: React.FC = () => {
  const { theme, setTheme, colorScheme, toggleColorScheme } = useTheme();
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleClearStorage = () => {
    storageService.clear();
    setClearModalOpen(false);
    // Reload to reset all settings
    window.location.reload();
  };

  const getThemeDescription = (selectedTheme: string) => {
    switch (selectedTheme) {
      case 'light':
        return 'Always use light theme';
      case 'dark':
        return 'Always use dark theme';
      case 'auto':
        return 'Follow system preference';
      default:
        return '';
    }
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Settings</Title>
        <Text c="dimmed" size="sm">
          Customize your app experience and manage your preferences
        </Text>
      </div>

      {/* Theme Settings */}
      <Card>
        <Stack gap="md">
          <Group>
            <IconPalette size={20} color="var(--mantine-color-blue-6)" />
            <Title order={3}>Theme</Title>
          </Group>

          <Text size="sm" c="dimmed">
            Choose your preferred color scheme for the application
          </Text>

          <SegmentedControl
            value={theme}
            onChange={(value) => setTheme(value as 'light' | 'dark' | 'auto')}
            data={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'Auto', value: 'auto' },
            ]}
            fullWidth
          />

          <Text size="xs" c="dimmed">
            {getThemeDescription(theme)}
          </Text>

          <Alert color="yellow" icon={<IconInfoCircle size={16} />}>
            <Text size="xs">
              Current theme: <strong>{theme}</strong> | Mantine color scheme:{' '}
              <strong>{colorScheme}</strong>
            </Text>
          </Alert>

          <Group>
            <Button variant="outline" onClick={toggleColorScheme} size="xs">
              Toggle Theme (Test)
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Storage Information */}
      <Card>
        <Stack gap="md">
          <Group>
            <IconInfoCircle size={20} color="var(--mantine-color-green-6)" />
            <Title order={3}>Storage</Title>
          </Group>

          <Text size="sm" c="dimmed">
            Manage your locally stored preferences and data
          </Text>

          <Alert color="blue" icon={<IconInfoCircle size={16} />}>
            <Text size="sm">
              Your preferences are stored locally in your browser and will persist between sessions.
            </Text>
          </Alert>

          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="sm" fw={500}>
                Storage Status
              </Text>
              <Text size="xs" c="dimmed">
                Local storage availability
              </Text>
            </div>
            <Badge color={storageService.isAvailable() ? 'green' : 'red'} variant="light">
              {storageService.isAvailable() ? 'Available' : 'Unavailable'}
            </Badge>
          </Group>

          <Divider />

          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="sm" fw={500}>
                Clear All Settings
              </Text>
              <Text size="xs" c="dimmed">
                Reset all preferences to their default values
              </Text>
            </div>
            <Button
              variant="outline"
              color="red"
              size="sm"
              leftSection={<IconTrash size={16} />}
              onClick={() => setClearModalOpen(true)}
            >
              Clear Storage
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* App Information */}
      <Card>
        <Stack gap="md">
          <Title order={3}>App Information</Title>

          <Group justify="space-between" wrap="nowrap">
            <Text size="sm">Version</Text>
            <Badge variant="light">1.0.0</Badge>
          </Group>

          <Group justify="space-between" wrap="nowrap">
            <Text size="sm">Build</Text>
            <Badge variant="light">Development</Badge>
          </Group>

          <Group justify="space-between" wrap="nowrap">
            <Text size="sm">Technologies</Text>
            <Group gap="xs">
              <Badge size="xs" variant="outline">
                React
              </Badge>
              <Badge size="xs" variant="outline">
                Redux Toolkit
              </Badge>
              <Badge size="xs" variant="outline">
                Mantine
              </Badge>
            </Group>
          </Group>
        </Stack>
      </Card>

      {/* Clear Storage Confirmation Modal */}
      <Modal
        opened={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear All Settings"
        centered
      >
        <Stack gap="md">
          <Group>
            <IconAlertTriangle size={24} color="var(--mantine-color-orange-6)" />
            <Text fw={500}>Are you sure?</Text>
          </Group>

          <Text size="sm" c="dimmed">
            This will permanently delete all your saved preferences including:
          </Text>

          <Stack gap="xs" pl="md">
            <Text size="sm">• Theme preference</Text>
            <Text size="sm">• All locally stored settings</Text>
            <Text size="sm">• Application preferences</Text>
          </Stack>

          <Text size="sm" c="red">
            This action cannot be undone and will reload the application.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleClearStorage} leftSection={<IconTrash size={16} />}>
              Clear All Settings
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default SettingsPage;
