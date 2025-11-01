/**
 * User Management Types
 * For admin user management functionality
 */

import { User, UserRole } from '../Auth/types';

// User management specific enums
export enum UserManagementActionType {
  LOAD_USERS_REQUEST = 'users/loadUsersRequest',
  LOAD_USERS_SUCCESS = 'users/loadUsersSuccess',
  LOAD_USERS_FAILURE = 'users/loadUsersFailure',
  UPDATE_USER_ROLE_REQUEST = 'users/updateUserRoleRequest',
  UPDATE_USER_ROLE_SUCCESS = 'users/updateUserRoleSuccess',
  UPDATE_USER_ROLE_FAILURE = 'users/updateUserRoleFailure',
  DELETE_USER_REQUEST = 'users/deleteUserRequest',
  DELETE_USER_SUCCESS = 'users/deleteUserSuccess',
  DELETE_USER_FAILURE = 'users/deleteUserFailure',
  CLEAR_USERS_ERROR = 'users/clearError',
}

export enum UserManagementErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CANNOT_MODIFY_SELF = 'CANNOT_MODIFY_SELF',
  CANNOT_DELETE_LAST_ADMIN = 'CANNOT_DELETE_LAST_ADMIN',
  INVALID_ROLE = 'INVALID_ROLE',
  OPERATION_FAILED = 'OPERATION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// User management state
// Loading state interface
export interface UserManagementLoadingState {
  loadingUsers: boolean;
  updatingRole: boolean;
  deletingUser: boolean;
  loadingStatistics: boolean;
}

// State interfaces
export interface UserManagementState {
  users: User[];
  statistics: UserStatistics | null;
  filter: UserFilter;
  loading: UserManagementLoadingState;
  error: UserManagementError | null;
  lastUpdated: string | null;
}

// Error type
export interface UserManagementError {
  readonly code: UserManagementErrorCode;
  readonly message: string;
  readonly timestamp: string;
  readonly details?: Record<string, unknown>;
}

// Request types
export interface UpdateUserRoleRequest {
  readonly userId: string;
  readonly newRole: UserRole;
}

export interface DeleteUserRequest {
  readonly userId: string;
}

// Response types
export interface UserOperationResponse {
  readonly success: boolean;
  readonly user?: User;
  readonly message?: string;
}

// User statistics for admin dashboard
export interface UserStatistics {
  readonly totalUsers: number;
  readonly adminUsers: number;
  readonly regularUsers: number;
  readonly recentSignups: number; // Last 7 days
  readonly activeUsers: number; // Users who logged in within last 30 days
}

// User filter and sort options
export enum UserSortField {
  NAME = 'name',
  EMAIL = 'email',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  LAST_LOGIN = 'lastLoginAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface UserFilter {
  readonly role?: UserRole;
  readonly searchQuery?: string;
  readonly sortField: UserSortField;
  readonly sortDirection: SortDirection;
}

export const DEFAULT_USER_FILTER: UserFilter = {
  sortField: UserSortField.CREATED_AT,
  sortDirection: SortDirection.DESC,
};
