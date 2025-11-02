/**
 * Editor Redux Slice
 * Manages tabbed editor state and operations (Saga-based)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsCategory } from '../News/types';
import {
  CloseTabRequest,
  CreateTabRequest,
  DeleteTabRequest,
  EditorError,
  EditorFormData,
  EditorState,
  EditorTab,
  ReorderTabsRequest,
  SaveTabRequest,
  UpdateTabDataRequest,
} from './types';

// Initial state
const initialState: EditorState = {
  tabs: [],
  activeTabId: null,
  tabData: {},
  isLoading: false,
  error: null,
  autoSaveEnabled: true,
  lastAutoSave: null,
};

// Editor slice
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Tab management
    createTab: (state, action: PayloadAction<CreateTabRequest>) => {
      const { type, articleId, title } = action.payload;
      const tabId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Redux: Creating new tab', { type, articleId, title, tabId });
      }

      const newTab: EditorTab = {
        id: tabId,
        title: title || (type === 'create' ? 'New Article' : 'Edit Article'),
        type,
        articleId,
        isDirty: false,
        isActive: false,
        createdAt: now,
        lastModified: now,
      };

      // Deactivate all tabs
      state.tabs.forEach((tab) => {
        tab.isActive = false;
      });

      // Add new tab
      state.tabs.push(newTab);
      state.activeTabId = tabId;
      newTab.isActive = true;

      // Initialize form data
      state.tabData[tabId] = {
        title: '',
        intro: '',
        description: '',
        category: NewsCategory.GENERAL,
        imageUrl: '',
        isPublished: false,
        tags: [],
      };
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          'Redux: Setting active tab to',
          tabId,
          'available tabs:',
          state.tabs.map((t) => t.id)
        );
      }

      // Check if tab exists first
      const targetTab = state.tabs.find((t) => t.id === tabId);
      if (!targetTab) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Redux: Attempted to set active tab that does not exist:', tabId);
        }
        return;
      }

      // Deactivate all tabs
      state.tabs.forEach((tab) => {
        tab.isActive = false;
      });

      // Activate selected tab
      targetTab.isActive = true;
      state.activeTabId = tabId;
    },

    closeTab: (state, action: PayloadAction<CloseTabRequest>) => {
      const { tabId, force } = action.payload;
      const tabIndex = state.tabs.findIndex((t) => t.id === tabId);

      if (tabIndex === -1) {
        return;
      }

      const tab = state.tabs[tabIndex];

      // Check if tab has unsaved changes (unless forced)
      if (!force && tab.isDirty) {
        // In a real app, you'd show a confirmation dialog here
        // For now, we'll just not close the tab
        return;
      }

      // Remove tab and its data
      state.tabs.splice(tabIndex, 1);
      delete state.tabData[tabId];

      // If this was the active tab, activate another one
      if (state.activeTabId === tabId) {
        if (state.tabs.length > 0) {
          // Activate the previous tab, or the next one if this was the first
          const newActiveIndex = Math.max(0, tabIndex - 1);
          const newActiveTab = state.tabs[newActiveIndex];
          if (newActiveTab) {
            newActiveTab.isActive = true;
            state.activeTabId = newActiveTab.id;
          }
        } else {
          state.activeTabId = null;
        }
      }

      // Clean up draft
      try {
        localStorage.removeItem(`editor-draft-${tabId}`);
      } catch (error) {
        // Log localStorage errors for debugging
        // eslint-disable-next-line no-console
        console.warn('Failed to remove draft from localStorage:', error);
      }
    },

    reorderTabs: (state, action: PayloadAction<ReorderTabsRequest>) => {
      const { tabIds } = action.payload;
      const reorderedTabs: EditorTab[] = [];

      // Reorder tabs according to the new order
      tabIds.forEach((tabId) => {
        const tab = state.tabs.find((t) => t.id === tabId);
        if (tab) {
          reorderedTabs.push(tab);
        }
      });

      state.tabs = reorderedTabs;
    },

    updateTabData: (state, action: PayloadAction<UpdateTabDataRequest>) => {
      const { tabId, data } = action.payload;

      // Reduced logging - only for significant updates
      if (process.env.NODE_ENV === 'development' && (data.title || data.intro)) {
        // eslint-disable-next-line no-console
        console.log(`Redux: Updated ${Object.keys(data)[0]} for tab ${tabId.slice(-8)}`);
      }

      if (state.tabData[tabId]) {
        state.tabData[tabId] = { ...state.tabData[tabId], ...data };

        // Mark tab as dirty
        const tab = state.tabs.find((t) => t.id === tabId);
        if (tab) {
          tab.isDirty = true;
          tab.lastModified = new Date().toISOString();

          // Update tab title if title changed and it's meaningful content
          if (data.title && data.title.trim() && data.title.trim().length >= 3) {
            const newTitle =
              data.title.length > 20 ? `${data.title.substring(0, 20)}...` : data.title;
            // Only update if title actually changed to prevent unnecessary re-renders
            if (tab.title !== newTitle) {
              tab.title = newTitle;
            }
          }
        }
      }
    },

    markTabClean: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.isDirty = false;
      }
    },

    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Action request creators (for sagas)
    saveArticleRequest: (state, _action: PayloadAction<SaveTabRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    saveArticleSuccess: (state, action: PayloadAction<{ tabId: string; articleId: string }>) => {
      state.isLoading = false;
      const { tabId, articleId } = action.payload;

      // Update tab with articleId and mark as clean
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.articleId = articleId;
        tab.isDirty = false;
        tab.type = 'edit'; // Convert from 'create' to 'edit'
      }
    },

    saveArticleFailure: (state, action: PayloadAction<EditorError>) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },

    saveDraftRequest: (
      _state,
      _action: PayloadAction<{ tabId: string; authorId: string; authorName: string }>
    ) => {
      // No loading state for drafts to avoid UI flicker
    },

    saveDraftSuccess: (state, action: PayloadAction<{ tabId: string; articleId: string }>) => {
      state.lastAutoSave = new Date().toISOString();

      // Update the specific tab that was saved
      const { tabId, articleId } = action.payload;
      const tab = state.tabs.find((t) => t.id === tabId);

      if (tab) {
        tab.articleId = articleId;
        tab.lastSaved = new Date().toISOString();
        // Only mark as clean if there have been no recent modifications
        // This prevents marking as clean when user is actively typing
        const timeSinceLastModified = tab.lastModified
          ? Date.now() - new Date(tab.lastModified).getTime()
          : Infinity;

        if (timeSinceLastModified > 1000) {
          // 1 second buffer
          tab.isDirty = false;
        }
      }
    },

    saveDraftFailure: (state, action: PayloadAction<EditorError>) => {
      state.error = action.payload.message;
    },

    loadEditorTabsRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    loadEditorTabsSuccess: (
      state,
      action: PayloadAction<{ tabs: EditorTab[]; tabData: Record<string, EditorFormData> }>
    ) => {
      state.isLoading = false;
      const { tabs, tabData } = action.payload;

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `Redux: Loading ${tabs.length} tabs into state`,
          tabs.map((t) => t.title)
        );
      }

      // Replace current tabs and data
      state.tabs = tabs;
      state.tabData = { ...state.tabData, ...tabData };

      // Set active tab to the first loaded tab if any
      if (tabs.length > 0) {
        const activeTab = tabs.find((tab) => tab.isActive) || tabs[0];
        state.activeTabId = activeTab.id;
        activeTab.isActive = true;

        // Debug logging for development
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`Redux: Set active tab to ${activeTab.id} (${activeTab.title})`);
        }
      }
    },

    loadEditorTabsFailure: (state, action: PayloadAction<EditorError>) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },

    deleteTabRequest: (state, _action: PayloadAction<DeleteTabRequest>) => {
      // Mark as loading for this specific operation
      state.error = null;
    },

    deleteTabSuccess: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tabIndex = state.tabs.findIndex((t) => t.id === tabId);

      if (tabIndex !== -1) {
        // Remove tab and its data
        state.tabs.splice(tabIndex, 1);
        delete state.tabData[tabId];

        // If this was the active tab, activate another one
        if (state.activeTabId === tabId) {
          if (state.tabs.length > 0) {
            // Activate the previous tab, or the next one if this was the first
            const newActiveIndex = Math.max(0, tabIndex - 1);
            const newActiveTab = state.tabs[newActiveIndex];
            state.activeTabId = newActiveTab.id;
            newActiveTab.isActive = true;
          } else {
            state.activeTabId = null;
          }
        }
      }
    },

    deleteTabFailure: (state, action: PayloadAction<EditorError>) => {
      state.error = action.payload.message;
    },

    loadArticleForEditRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    loadArticleForEditSuccess: (state, action: PayloadAction<EditorFormData>) => {
      state.isLoading = false;
      // Update the active tab's data
      if (state.activeTabId) {
        state.tabData[state.activeTabId] = action.payload;
      }
    },

    loadArticleForEditFailure: (state, action: PayloadAction<EditorError>) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  createTab,
  setActiveTab,
  closeTab,
  reorderTabs,
  updateTabData,
  markTabClean,
  toggleAutoSave,
  clearError,
  // Action request creators (for sagas)
  saveArticleRequest,
  saveArticleSuccess,
  saveArticleFailure,
  saveDraftRequest,
  saveDraftSuccess,
  saveDraftFailure,
  loadEditorTabsRequest,
  loadEditorTabsSuccess,
  loadEditorTabsFailure,
  deleteTabRequest,
  deleteTabSuccess,
  deleteTabFailure,
  loadArticleForEditRequest,
  loadArticleForEditSuccess,
  loadArticleForEditFailure,
} = editorSlice.actions;

// Selectors
export const selectEditor = (state: { editor: EditorState }) => state.editor;
export const selectEditorTabs = (state: { editor: EditorState }) => state.editor.tabs;
export const selectActiveTab = (state: { editor: EditorState }) =>
  state.editor.tabs.find((tab: EditorTab) => tab.id === state.editor.activeTabId);
export const selectActiveTabData = (state: { editor: EditorState }) => {
  const activeTabId = state.editor.activeTabId;
  return activeTabId ? state.editor.tabData[activeTabId] : null;
};
export const selectTabData = (tabId: string) => (state: { editor: EditorState }) =>
  state.editor.tabData[tabId];
export const selectHasDirtyTabs = (state: { editor: EditorState }) =>
  state.editor.tabs.some((tab: EditorTab) => tab.isDirty);

export default editorSlice.reducer;
