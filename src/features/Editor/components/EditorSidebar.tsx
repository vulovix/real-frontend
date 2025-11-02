/**
 * Editor Sidebar Component
 * Displays editor-related information and quick actions
 */

import React from 'react';
import {
  IconDeviceFloppy,
  IconFileText,
  IconHistory,
  IconPlus,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../Auth/slice';
import {
  closeTab,
  createTab,
  saveArticleRequest,
  selectActiveTab,
  selectEditorTabs,
  selectHasDirtyTabs,
  setActiveTab,
} from '../slice';

export function EditorSidebar() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const tabs = useAppSelector(selectEditorTabs);
  const activeTab = useAppSelector(selectActiveTab);
  const hasDirtyTabs = useAppSelector(selectHasDirtyTabs);

  const handleCreateNew = () => {
    dispatch(createTab({ type: 'create', title: 'New Article' }));
  };

  const handleSaveAll = () => {
    if (!auth.currentUser) {
      return;
    }

    // Save all dirty tabs
    const dirtyTabs = tabs.filter((tab) => tab.isDirty);
    for (const tab of dirtyTabs) {
      dispatch(
        saveArticleRequest({
          tabId: tab.id,
          authorId: auth.currentUser.id,
          authorName: auth.currentUser.email,
        })
      );
    }
  };

  const handleTabClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(closeTab({ tabId }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Stack gap="md">
      {/* Quick Actions */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Title order={4}>Quick Actions</Title>

          <Button
            leftSection={<IconPlus size={16} />}
            variant="light"
            fullWidth
            onClick={handleCreateNew}
          >
            New Article
          </Button>

          {hasDirtyTabs && (
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              variant="outline"
              fullWidth
              onClick={handleSaveAll}
            >
              Save All
            </Button>
          )}
        </Stack>
      </Card>

      {/* Active Tabs */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4}>Open Tabs</Title>
            <Badge variant="light" size="sm">
              {tabs.length}
            </Badge>
          </Group>

          <ScrollArea.Autosize mah={300}>
            <Stack gap="xs">
              {tabs.length === 0 ? (
                <Text c="dimmed" size="sm" ta="center" py="md">
                  No tabs open
                </Text>
              ) : (
                tabs.map((tab) => (
                  <Card
                    key={tab.id}
                    p="xs"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: tab.isActive ? 'var(--mantine-color-blue-0)' : undefined,
                    }}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Group justify="space-between" gap="xs">
                      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="xs">
                          <IconFileText size={14} />
                          <Text size="sm" fw={tab.isActive ? 600 : 400} truncate>
                            {tab.title}
                          </Text>
                          {tab.isDirty && (
                            <Badge color="orange" size="xs" variant="dot">
                              Unsaved
                            </Badge>
                          )}
                        </Group>

                        <Group gap="xs">
                          <Badge
                            color={tab.type === 'create' ? 'green' : 'blue'}
                            variant="light"
                            size="xs"
                          >
                            {tab.type === 'create' ? 'New' : 'Edit'}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {formatDate(tab.lastModified)}
                          </Text>
                        </Group>
                      </Stack>

                      <Tooltip label="Close tab">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="gray"
                          onClick={(e) => handleCloseTab(tab.id, e)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Card>

      {/* Editor Stats */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Title order={4}>Session Stats</Title>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm">Open tabs:</Text>
              <Text size="sm" fw={600}>
                {tabs.length}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm">Unsaved changes:</Text>
              <Text size="sm" fw={600} c={hasDirtyTabs ? 'orange' : 'green'}>
                {tabs.filter((tab) => tab.isDirty).length}
              </Text>
            </Group>

            {activeTab && (
              <>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm">Active tab:</Text>
                  <Text size="sm" fw={600} truncate style={{ maxWidth: '60%' }}>
                    {activeTab.title}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">Last modified:</Text>
                  <Text size="sm" c="dimmed">
                    {formatDate(activeTab.lastModified)}
                  </Text>
                </Group>
              </>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Editor Settings */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group>
            <IconSettings size={16} />
            <Title order={4}>Settings</Title>
          </Group>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm">Auto-save:</Text>
              <Badge color="green" variant="light" size="sm">
                Enabled
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text size="sm">Word wrap:</Text>
              <Badge color="blue" variant="light" size="sm">
                On
              </Badge>
            </Group>
          </Stack>
        </Stack>
      </Card>

      {/* Recent Actions */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group>
            <IconHistory size={16} />
            <Title order={4}>Recent</Title>
          </Group>

          <Text size="sm" c="dimmed" ta="center">
            Recent actions will appear here
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
