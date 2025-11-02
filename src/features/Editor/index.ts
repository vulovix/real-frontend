/**
 * Editor Feature Index
 * Main exports for the Editor feature
 */

// Components
export * from './components';

// Redux slice
export {
  createTab,
  setActiveTab,
  closeTab,
  reorderTabs,
  updateTabData,
  markTabClean,
  toggleAutoSave,
  clearError,
  // Saga-based actions
  loadArticleForEditRequest,
  loadArticleForEditSuccess,
  loadArticleForEditFailure,
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
  // Selectors
  selectEditor,
  selectEditorTabs,
  selectActiveTab,
  selectActiveTabData,
  selectTabData,
  selectHasDirtyTabs,
} from './slice';

// Types
export type {
  EditorTab,
  EditorFormData,
  EditorState,
  CreateTabRequest,
  UpdateTabDataRequest,
  SaveTabRequest,
  CloseTabRequest,
  ReorderTabsRequest,
  DraftSaveData,
  EditorError,
  AutoSaveConfig,
} from './types';
export { EditorErrorCode } from './types';
