/**
 * Editor Feature Types
 * Types for the tabbed article editor system
 */

import { NewsCategory } from '../News/types';

export interface EditorTab {
  id: string;
  title: string;
  type: 'create' | 'edit';
  articleId?: string; // Article ID (draft or published) - undefined for new tabs until first save
  isDirty: boolean; // Has unsaved changes
  isActive: boolean;
  createdAt: string;
  lastModified: string;
  lastSaved?: string; // When the tab was last auto-saved
}

export interface EditorFormData {
  title: string;
  intro: string;
  description: string;
  category: NewsCategory;
  imageUrl?: string;
  isPublished: boolean;
  tags: string[];
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  tabData: Record<string, EditorFormData>; // Tab ID -> Form data
  isLoading: boolean;
  error: string | null;
  autoSaveEnabled: boolean;
  lastAutoSave: string | null;
}

export interface CreateTabRequest {
  type: 'create' | 'edit';
  articleId?: string;
  title?: string;
}

export interface UpdateTabDataRequest {
  tabId: string;
  data: Partial<EditorFormData>;
}

export interface SaveTabRequest {
  tabId: string;
  authorId: string;
  authorName: string;
}

export interface CloseTabRequest {
  tabId: string;
  force?: boolean; // Force close without save prompt
  deleteArticle?: boolean; // Also delete the article from storage
}

export interface DeleteTabRequest {
  tabId: string;
  force?: boolean; // Force delete without confirmation
  deleteArticle?: boolean; // Also delete the article from storage
}

export interface ReorderTabsRequest {
  tabIds: string[];
}

export interface DraftSaveData {
  tabId: string;
  formData: EditorFormData;
  lastSaved: string;
}

export interface EditorError {
  code: EditorErrorCode;
  message: string;
  timestamp: string;
  tabId?: string;
}

export enum EditorErrorCode {
  SAVE_FAILED = 'SAVE_FAILED',
  SAVE_ERROR = 'SAVE_ERROR',
  LOAD_FAILED = 'LOAD_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TAB_NOT_FOUND = 'TAB_NOT_FOUND',
}

export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // milliseconds
  maxDrafts: number;
}
