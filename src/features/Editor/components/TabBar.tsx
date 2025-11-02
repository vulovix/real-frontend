/**
 * Editor Tab Bar Component
 * Manages the tabbed interface for article editing
 */

import React from 'react';
import {
  IconCircleX,
  IconDeviceFloppy,
  IconDotsVertical,
  IconFileText,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../Auth/slice';
import {
  closeTab,
  createTab,
  deleteTabRequest,
  reorderTabs,
  saveArticleRequest,
  selectActiveTab,
  selectEditorTabs,
  selectHasDirtyTabs,
  setActiveTab,
} from '../slice';
import classes from './TabBar.module.css';

interface TabBarProps {
  onCreateArticle?: () => void;
  onEditArticle?: (articleId: string) => void;
}

export function TabBar({ onCreateArticle, onEditArticle: _onEditArticle }: TabBarProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const tabs = useAppSelector(selectEditorTabs);
  const activeTab = useAppSelector(selectActiveTab);
  const hasDirtyTabs = useAppSelector(selectHasDirtyTabs);

  const handleCreateNewTab = () => {
    dispatch(createTab({ type: 'create', title: 'New Article' }));
    onCreateArticle?.();

    // Auto-save will be handled by the ArticleEditor component when content changes
    // or we can implement auto-save logic elsewhere
  };

  const handleTabClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(closeTab({ tabId }));
  };

  const handleDeleteTab = (tabId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteTabRequest({ tabId, deleteArticle: true }));
  };

  const handleSaveActiveTab = () => {
    if (!activeTab || !auth.currentUser) {
      return;
    }

    dispatch(
      saveArticleRequest({
        tabId: activeTab.id,
        authorId: auth.currentUser.id,
        authorName: auth.currentUser.email,
      })
    );
  };

  // Drag and drop functionality for tab reordering
  const handleDragStart = (event: React.DragEvent, tabId: string) => {
    event.dataTransfer.setData('text/plain', tabId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent, targetTabId: string) => {
    event.preventDefault();
    const draggedTabId = event.dataTransfer.getData('text/plain');

    if (draggedTabId !== targetTabId) {
      const currentTabIds = tabs.map((tab) => tab.id);
      const draggedIndex = currentTabIds.indexOf(draggedTabId);
      const targetIndex = currentTabIds.indexOf(targetTabId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTabIds = [...currentTabIds];
        newTabIds.splice(draggedIndex, 1);
        newTabIds.splice(targetIndex, 0, draggedTabId);

        dispatch(reorderTabs({ tabIds: newTabIds }));
      }
    }
  };

  const getTabIcon = (type: 'create' | 'edit') => {
    return type === 'create' ? <IconPlus size={14} /> : <IconFileText size={14} />;
  };

  const formatTabTitle = (title: string, maxLength = 15) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (tabs.length === 0) {
    return (
      <Paper p="md" withBorder>
        <Group justify="center">
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateNewTab} variant="light">
            Create New Article
          </Button>
        </Group>
      </Paper>
    );
  }

  return (
    <Stack gap="xs">
      {/* Tab Bar */}
      <Paper withBorder>
        <Group gap={0} wrap="nowrap">
          {/* Scrollable tabs area */}
          <ScrollArea style={{ flex: 1 }} scrollbarSize={8}>
            <Group gap={0} wrap="nowrap" p="xs">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`${classes.tab} ${tab.isActive ? classes.tabActive : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTabClick(tab.id);
                    }
                  }}
                  role="tab"
                  tabIndex={0}
                  aria-selected={tab.isActive}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tab.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tab.id)}
                >
                  <Group gap="xs" wrap="nowrap">
                    {/* Drag handle */}
                    <IconGripVertical size={12} className={classes.dragHandle} />

                    {/* Tab icon */}
                    {getTabIcon(tab.type)}

                    {/* Tab title */}
                    <Text size="sm" className={classes.tabTitle}>
                      {formatTabTitle(tab.title)}
                    </Text>

                    {/* Dirty indicator */}
                    {tab.isDirty && (
                      <Badge size="xs" variant="filled" color="orange" p={0} w={8} h={8}>
                        •
                      </Badge>
                    )}

                    {/* Tab actions menu */}
                    <Menu position="bottom-end" withArrow>
                      <Menu.Target>
                        <Tooltip label="Tab options">
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="gray"
                            className={classes.closeButton}
                          >
                            <IconDotsVertical size={12} />
                          </ActionIcon>
                        </Tooltip>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconCircleX size={14} />}
                          onClick={(e) => handleCloseTab(tab.id, e)}
                        >
                          Close Tab
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={(e) => handleDeleteTab(tab.id, e)}
                        >
                          Delete Tab & Article
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </div>
              ))}
            </Group>
          </ScrollArea>

          {/* Action buttons */}
          <Group gap="xs" p="xs">
            {/* Save button */}
            {activeTab && (
              <Tooltip label="Save article">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={handleSaveActiveTab}
                  disabled={!activeTab.isDirty}
                >
                  <IconDeviceFloppy size={16} />
                </ActionIcon>
              </Tooltip>
            )}

            {/* New tab button */}
            <Tooltip label="New article">
              <ActionIcon variant="light" onClick={handleCreateNewTab}>
                <IconPlus size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Tab info bar */}
      {tabs.length > 0 && (
        <Group justify="space-between" p="xs">
          <Text size="xs" c="dimmed">
            {tabs.length} tab{tabs.length !== 1 ? 's' : ''} open
            {hasDirtyTabs && ' • Unsaved changes'}
          </Text>

          {activeTab && (
            <Text size="xs" c="dimmed">
              {activeTab.type === 'create' ? 'Creating' : 'Editing'}: {activeTab.title}
            </Text>
          )}
        </Group>
      )}
    </Stack>
  );
}
