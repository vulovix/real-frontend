/**
 * Editor Page Component
 * Main page for the tabbed article editor system
 */

import React, { useEffect } from 'react';
import { Stack } from '@mantine/core';
import { selectAuth } from '../../../features/Auth/slice';
import { ArticleEditor, TabBar } from '../../../features/Editor/components';
import {
  loadEditorTabsRequest,
  saveArticleRequest,
  selectActiveTab,
} from '../../../features/Editor/slice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export function EditorPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const activeTab = useAppSelector(selectActiveTab);

  // Load existing tabs from database on mount
  useEffect(() => {
    if (auth.currentUser) {
      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('EditorPage: Loading tabs for user', auth.currentUser.id);
      }
      dispatch(loadEditorTabsRequest(auth.currentUser.id));
    } else if (process.env.NODE_ENV === 'development') {
      // Debug logging for development
      // eslint-disable-next-line no-console
      console.log('EditorPage: No current user, skipping tab load');
    }
  }, [dispatch, auth.currentUser]);

  const handleSave = async () => {
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

  const handlePreview = () => {
    // TODO: Implement preview functionality
    // This could open a modal or navigate to a preview page
  };

  const handleCreateArticle = () => {
    // Called when a new tab is created
    // Any additional setup can be done here
  };

  const handleEditArticle = (articleId: string) => {
    // Called when editing an existing article
    // Additional setup for edit mode can be done here
    void articleId; // Avoid unused parameter warning
  };

  return (
    <Stack gap="md">
      {/* Tab Management */}
      <TabBar onCreateArticle={handleCreateArticle} onEditArticle={handleEditArticle} />

      {/* Article Editor */}
      <ArticleEditor onSave={handleSave} onPreview={handlePreview} />
    </Stack>
  );
}
