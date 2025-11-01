/**
 * User Management Redux Slice
 * State management for admin user management functionality
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../Auth/types';
import {
  SortDirection,
  UserFilter,
  UserManagementErrorCode,
  UserManagementState,
  UserSortField,
  UserStatistics,
} from './types';

// Initial state
const initialState: UserManagementState = {
  users: [],
  statistics: null,
  filter: {
    role: undefined,
    searchQuery: '',
    sortField: UserSortField.NAME,
    sortDirection: SortDirection.ASC,
  },
  loading: {
    loadingUsers: false,
    updatingRole: false,
    deletingUser: false,
    loadingStatistics: false,
  },
  error: null,
  lastUpdated: null,
};

// User management slice
const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    // Load users actions
    loadUsersStart: (state) => {
      state.loading.loadingUsers = true;
      state.error = null;
    },
    loadUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading.loadingUsers = false;
      state.users = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    loadUsersFailure: (
      state,
      action: PayloadAction<{
        code: UserManagementErrorCode;
        message: string;
      }>
    ) => {
      state.loading.loadingUsers = false;
      state.error = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },

    // Update user role actions
    updateUserRoleStart: (state) => {
      state.loading.updatingRole = true;
      state.error = null;
    },
    updateUserRoleSuccess: (state, action: PayloadAction<User>) => {
      state.loading.updatingRole = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
      state.error = null;
    },
    updateUserRoleFailure: (
      state,
      action: PayloadAction<{
        code: UserManagementErrorCode;
        message: string;
      }>
    ) => {
      state.loading.updatingRole = false;
      state.error = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },

    // Delete user actions
    deleteUserStart: (state) => {
      state.loading.deletingUser = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.loading.deletingUser = false;
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
      state.error = null;
    },
    deleteUserFailure: (
      state,
      action: PayloadAction<{
        code: UserManagementErrorCode;
        message: string;
      }>
    ) => {
      state.loading.deletingUser = false;
      state.error = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },

    // Load statistics actions
    loadStatisticsStart: (state) => {
      state.loading.loadingStatistics = true;
      state.error = null;
    },
    loadStatisticsSuccess: (state, action: PayloadAction<UserStatistics>) => {
      state.loading.loadingStatistics = false;
      state.statistics = action.payload;
      state.error = null;
    },
    loadStatisticsFailure: (
      state,
      action: PayloadAction<{
        code: UserManagementErrorCode;
        message: string;
      }>
    ) => {
      state.loading.loadingStatistics = false;
      state.error = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },

    // Filter actions
    updateFilter: (state, action: PayloadAction<Partial<UserFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetUserManagement: () => initialState,
  },
});

// Export actions
export const {
  loadUsersStart,
  loadUsersSuccess,
  loadUsersFailure,
  updateUserRoleStart,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  loadStatisticsStart,
  loadStatisticsSuccess,
  loadStatisticsFailure,
  updateFilter,
  resetFilter,
  clearError,
  resetUserManagement,
} = userManagementSlice.actions;

// Selectors
export const selectUserManagement = (state: { userManagement: UserManagementState }) =>
  state.userManagement;

export const selectUsers = (state: { userManagement: UserManagementState }) =>
  state.userManagement.users;

export const selectFilteredUsers = (state: { userManagement: UserManagementState }) => {
  const { users, filter } = state.userManagement;

  let filteredUsers = [...users];

  // Apply role filter
  if (filter.role) {
    filteredUsers = filteredUsers.filter((user) => user.role === filter.role);
  }

  // Apply search query
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  filteredUsers.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (filter.sortField) {
      case UserSortField.NAME:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case UserSortField.EMAIL:
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case UserSortField.ROLE:
        aValue = a.role;
        bValue = b.role;
        break;
      case UserSortField.CREATED_AT:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case UserSortField.LAST_LOGIN:
        aValue = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        bValue = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) {
      return filter.sortDirection === SortDirection.ASC ? -1 : 1;
    }
    if (aValue > bValue) {
      return filter.sortDirection === SortDirection.ASC ? 1 : -1;
    }
    return 0;
  });

  return filteredUsers;
};

export const selectUserStatistics = (state: { userManagement: UserManagementState }) =>
  state.userManagement.statistics;

export const selectUserFilter = (state: { userManagement: UserManagementState }) =>
  state.userManagement.filter;

export const selectUserManagementLoading = (state: { userManagement: UserManagementState }) =>
  state.userManagement.loading;

export const selectUserManagementError = (state: { userManagement: UserManagementState }) =>
  state.userManagement.error;

export const selectIsLoadingAny = (state: { userManagement: UserManagementState }) => {
  const loading = state.userManagement.loading;
  return (
    loading.loadingUsers ||
    loading.updatingRole ||
    loading.deletingUser ||
    loading.loadingStatistics
  );
};

export const selectAdminUsers = (state: { userManagement: UserManagementState }) =>
  state.userManagement.users.filter((user) => user.role === UserRole.ADMIN);

export const selectRegularUsers = (state: { userManagement: UserManagementState }) =>
  state.userManagement.users.filter((user) => user.role === UserRole.USER);

export const selectUserById =
  (userId: string) => (state: { userManagement: UserManagementState }) =>
    state.userManagement.users.find((user) => user.id === userId);

// Export reducer
export default userManagementSlice.reducer;
