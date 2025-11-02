/**
 * Article Editor Component
 * Rich text editor for creating and editing articles
 */

import React, { useEffect, useRef } from 'react';
import { IconDeviceFloppy, IconEye } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Button,
  Card,
  Checkbox,
  Group,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../Auth/slice';
import { NewsCategory } from '../../News/types';
import {
  loadArticleForEditRequest,
  saveDraftRequest,
  selectActiveTab,
  selectActiveTabData,
  selectEditor,
  updateTabData,
} from '../slice';

interface ArticleEditorProps {
  onSave?: () => void;
  onPreview?: () => void;
}

export function ArticleEditor({ onSave, onPreview }: ArticleEditorProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const activeTab = useAppSelector(selectActiveTab);
  const tabData = useAppSelector(selectActiveTabData);
  const editorState = useAppSelector(selectEditor);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserUpdateRef = useRef<number>(0);
  const loadedArticlesRef = useRef<Set<string>>(new Set());

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: tabData?.description || '',
    editable: true,
    onUpdate: ({ editor }) => {
      if (activeTab) {
        lastUserUpdateRef.current = Date.now(); // Track user update time
        const content = editor.getHTML();
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            'TipTap: Content updated for tab',
            activeTab.id,
            'content length:',
            content.length
          );
        }
        dispatch(
          updateTabData({
            tabId: activeTab.id,
            data: { description: content },
          })
        );
        triggerAutoSave();
      }
    },
  });

  // Debug: Check if editor is initialized
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('TipTap Editor initialized:', !!editor, 'for tab:', activeTab?.id);
    }
  }, [editor, activeTab?.id]);

  // Load article data if editing - only once per article and only if we don't have data
  useEffect(() => {
    if (activeTab?.type === 'edit' && activeTab.articleId) {
      const hasTabData = tabData && Object.keys(tabData).length > 0 && tabData.title !== '';
      const alreadyLoaded = loadedArticlesRef.current.has(activeTab.articleId);

      if (!hasTabData && !alreadyLoaded) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`ArticleEditor: Loading article data for ${activeTab.articleId.slice(-8)}`);
        }
        // Mark as loaded before dispatching to prevent duplicate loads
        loadedArticlesRef.current.add(activeTab.articleId);
        dispatch(loadArticleForEditRequest(activeTab.articleId));
      } else if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`ArticleEditor: Skipping load for ${activeTab.articleId.slice(-8)}`, {
          hasTabData,
          alreadyLoaded,
        });
      }
    }
  }, [activeTab?.id, activeTab?.articleId, activeTab?.type, tabData, dispatch]);

  // Track previous loading state to detect save completion
  const prevLoadingRef = useRef(editorState.isLoading);
  
  // Show feedback when save operations complete
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const isLoading = editorState.isLoading;
    
    // Save just completed
    if (wasLoading && !isLoading) {
      if (editorState.error) {
        // Show error notification
        notifications.show({
          title: 'Save Failed',
          message: editorState.error || 'Failed to save article',
          color: 'red',
        });
        
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Save failed:', editorState.error);
        }
      } else {
        // Show success notification
        notifications.show({
          title: 'Article Saved',
          message: 'Your article has been saved successfully',
          color: 'green',
        });
      }
    }
    
    // Update previous loading state
    prevLoadingRef.current = isLoading;
  }, [editorState.isLoading, editorState.error]);

  // Update editor content when tab data changes
  useEffect(() => {
    if (editor && tabData?.description !== undefined) {
      const currentContent = editor.getHTML();
      const newContent = tabData.description || '';

      // Only update if content is actually different and editor is not focused
      // Also check if enough time has passed since last user update to avoid race conditions
      const timeSinceLastUserUpdate = Date.now() - lastUserUpdateRef.current;
      const shouldUpdate =
        currentContent !== newContent && !editor.isFocused && timeSinceLastUserUpdate > 1000; // 1 second buffer

      if (shouldUpdate) {
        editor.commands.setContent(newContent);
      }
    }
  }, [editor, tabData?.description]);

  // Note: Removed immediate auto-save on tab creation to prevent issues with empty content
  // Auto-save will be triggered when user starts typing

  // Cleanup auto-save timeout on unmount and when activeTab changes
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = null;
      }
    };
  }, [activeTab?.id]); // Clear timeout when activeTab changes

  // Auto-save functionality - simplified and more reliable
  const triggerAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (activeTab && auth.currentUser && activeTab.isDirty && tabData) {
        // Only auto-save if there's meaningful content
        const hasTitle = tabData.title && tabData.title.trim().length > 0;
        const hasDescription =
          tabData.description &&
          tabData.description.trim().length > 0 &&
          tabData.description !== '<p></p>' &&
          tabData.description !== '<p><br></p>';

        if (hasTitle || hasDescription) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`ArticleEditor: Auto-saving tab ${activeTab.id.slice(-8)}`);
          }
          dispatch(
            saveDraftRequest({
              tabId: activeTab.id,
              authorId: auth.currentUser.id,
              authorName: auth.currentUser.email,
            })
          );
        }
      }
    }, 5000); // Increased back to 5 seconds for better UX
  };

  const handleFieldChange = (field: string, value: any) => {
    if (activeTab) {
      // Enhanced debugging to understand the re-render issue
      if (process.env.NODE_ENV === 'development' && (field === 'title' || field === 'intro')) {
        // eslint-disable-next-line no-console
        console.log(`ArticleEditor: Field change - ${field} for tab ${activeTab.id.slice(-8)}`, {
          newValue: String(value),
          currentTabData: tabData?.[field],
          tabDataKeys: Object.keys(tabData || {}),
          isDirty: activeTab.isDirty,
        });
      }
      
      // Special logging for description field to debug content validation
      if (process.env.NODE_ENV === 'development' && field === 'description') {
        // eslint-disable-next-line no-console
        console.log('TipTap content change:', {
          htmlContent: String(value),
          contentLength: String(value).length,
          trimmedLength: String(value).trim().length,
          isEmptyAfterTrim: !String(value).trim(),
        });
      }
      dispatch(
        updateTabData({
          tabId: activeTab.id,
          data: { [field]: value },
        })
      );
      triggerAutoSave();
    }
  };

  const categoryOptions = Object.values(NewsCategory).map((category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  // Debug logging for loaded tab data
  if (process.env.NODE_ENV === 'development' && activeTab && tabData) {
    // eslint-disable-next-line no-console
    console.log(`ArticleEditor: Rendering tab ${activeTab.id.slice(-8)}`, {
      title: tabData.title,
      intro: tabData.intro,
      isDirty: activeTab.isDirty,
      type: activeTab.type,
    });
  }

  if (!activeTab || !tabData) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('ArticleEditor: No active tab or tab data', {
        activeTab: !!activeTab,
        tabData: !!tabData,
      });
    }
    return (
      <Card p="xl">
        <Stack align="center" gap="md">
          <Title order={3} c="dimmed">
            No article selected
          </Title>
          <p>Create a new article or select an existing tab to start editing.</p>
        </Stack>
      </Card>
    );
  }

  return (
    <Card p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Title order={2}>{activeTab.type === 'create' ? 'Create Article' : 'Edit Article'}</Title>

          <Group gap="sm">
            <Button leftSection={<IconEye size={16} />} variant="light" onClick={onPreview}>
              Preview
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={onSave}
              disabled={!activeTab.isDirty || editorState.isLoading}
              loading={editorState.isLoading}
            >
              {editorState.isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Group>
        </Group>

        {/* Basic Information */}
        <Card withBorder p="md">
          <Stack gap="md">
            <Title order={4}>Basic Information</Title>

            {/* Title */}
            <TextInput
              label="Title"
              placeholder="Enter article title..."
              value={tabData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              required
            />

            {/* Intro */}
            <Textarea
              label="Introduction"
              placeholder="Brief introduction or summary..."
              value={tabData.intro}
              onChange={(e) => handleFieldChange('intro', e.target.value)}
              minRows={3}
              required
            />

            {/* Category and Settings */}
            <Group grow>
              <Select
                label="Category"
                placeholder="Select category"
                data={categoryOptions}
                value={tabData.category}
                onChange={(value) => handleFieldChange('category', value)}
                required
              />

              <div>
                <Checkbox
                  label="Published"
                  description="Make this article visible to readers"
                  checked={tabData.isPublished}
                  onChange={(e) => handleFieldChange('isPublished', e.target.checked)}
                  mt="md"
                />
              </div>
            </Group>

            {/* Image URL */}
            <TextInput
              label="Image URL (Optional)"
              placeholder="https://example.com/image.jpg"
              value={tabData.imageUrl || ''}
              onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
            />

            {/* Tags */}
            <TagsInput
              label="Tags"
              placeholder="Add tags..."
              value={tabData.tags}
              onChange={(tags) => handleFieldChange('tags', tags)}
              splitChars={[',', ' ', '|']}
            />
          </Stack>
        </Card>

        {/* Rich Text Editor */}
        <Card withBorder p="md">
          <Stack gap="md">
            <Title order={4}>Content</Title>

            {editor ? (
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content style={{ minHeight: '400px' }} />
              </RichTextEditor>
            ) : (
              <div style={{ minHeight: '400px', border: '1px solid #ccc', padding: '16px' }}>
                <p>Loading editor...</p>
              </div>
            )}
          </Stack>
        </Card>

        {/* Tab Status */}
        <Card withBorder p="xs">
          <Group justify="space-between">
            <Group gap="xs">
              <strong>Status:</strong>
              {activeTab.isDirty ? (
                <span style={{ color: 'var(--mantine-color-orange-6)' }}>Unsaved changes</span>
              ) : (
                <span style={{ color: 'var(--mantine-color-green-6)' }}>Saved</span>
              )}
            </Group>

            <Group gap="xs">
              <strong>Last modified:</strong>
              <span>{new Date(activeTab.lastModified).toLocaleString()}</span>
            </Group>
          </Group>
        </Card>
      </Stack>
    </Card>
  );
}
