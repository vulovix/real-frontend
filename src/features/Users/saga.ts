/**
 * User Management Redux Saga
 * Handles complex async operations for admin user management
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { selectCurrentUser } from '../Auth/slice';
import { User, UserRole } from '../Auth/types';
import { UserManagementError, userManagementService } from './api';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  loadStatisticsFailure,
  loadStatisticsStart,
  loadStatisticsSuccess,
  loadUsersFailure,
  loadUsersStart,
  loadUsersSuccess,
  updateUserRoleFailure,
  updateUserRoleStart,
  updateUserRoleSuccess,
} from './slice';
import {
  DeleteUserRequest,
  UpdateUserRoleRequest,
  UserManagementErrorCode,
  UserOperationResponse,
  UserStatistics,
} from './types';

// Action type constants for saga actions
export const USER_MANAGEMENT_SAGA_ACTIONS = {
  LOAD_USERS: 'userManagement/saga/loadUsers',
  UPDATE_USER_ROLE: 'userManagement/saga/updateUserRole',
  DELETE_USER: 'userManagement/saga/deleteUser',
  LOAD_STATISTICS: 'userManagement/saga/loadStatistics',
  REFRESH_DATA: 'userManagement/saga/refreshData',
} as const;

// Saga action creators
export const loadUsersSaga = () => ({
  type: USER_MANAGEMENT_SAGA_ACTIONS.LOAD_USERS,
});

export const updateUserRoleSaga = (payload: UpdateUserRoleRequest) => ({
  type: USER_MANAGEMENT_SAGA_ACTIONS.UPDATE_USER_ROLE,
  payload,
});

export const deleteUserSaga = (payload: DeleteUserRequest) => ({
  type: USER_MANAGEMENT_SAGA_ACTIONS.DELETE_USER,
  payload,
});

export const loadStatisticsSaga = () => ({
  type: USER_MANAGEMENT_SAGA_ACTIONS.LOAD_STATISTICS,
});

export const refreshUserManagementDataSaga = () => ({
  type: USER_MANAGEMENT_SAGA_ACTIONS.REFRESH_DATA,
});

// Helper function to get current user ID
function* getCurrentUserId(): Generator<any, string, any> {
  const currentUser: User | null = yield select(selectCurrentUser);

  if (!currentUser) {
    throw new UserManagementError(UserManagementErrorCode.UNAUTHORIZED, 'User not authenticated');
  }

  if (currentUser.role !== UserRole.ADMIN) {
    throw new UserManagementError(UserManagementErrorCode.UNAUTHORIZED, 'Admin access required');
  }

  return currentUser.id;
}

// Load users saga
function* handleLoadUsers(): Generator<any, void, any> {
  try {
    yield put(loadUsersStart());

    const currentUserId: string = yield call(getCurrentUserId);
    const users: User[] = yield call(
      userManagementService.loadUsers.bind(userManagementService),
      currentUserId
    );

    yield put(loadUsersSuccess(users));
  } catch (error) {
    if (error instanceof UserManagementError) {
      yield put(
        loadUsersFailure({
          code: error.code,
          message: error.message,
        })
      );
    } else {
      yield put(
        loadUsersFailure({
          code: UserManagementErrorCode.UNKNOWN_ERROR,
          message: 'Failed to load users',
        })
      );
    }
  }
}

// Update user role saga
function* handleUpdateUserRole(
  action: PayloadAction<UpdateUserRoleRequest>
): Generator<any, void, any> {
  try {
    yield put(updateUserRoleStart());

    const currentUserId: string = yield call(getCurrentUserId);
    const response: UserOperationResponse = yield call(
      userManagementService.updateUserRole.bind(userManagementService),
      currentUserId,
      action.payload
    );

    if (response.success && response.user) {
      yield put(updateUserRoleSuccess(response.user));

      // Show success notification (if you have a notification system)
      // yield put(showNotification({ type: 'success', message: response.message }));
    }
  } catch (error) {
    if (error instanceof UserManagementError) {
      yield put(
        updateUserRoleFailure({
          code: error.code,
          message: error.message,
        })
      );

      // Show error notification
      // yield put(showNotification({ type: 'error', message: error.message }));
    } else {
      yield put(
        updateUserRoleFailure({
          code: UserManagementErrorCode.UNKNOWN_ERROR,
          message: 'Failed to update user role',
        })
      );
    }
  }
}

// Delete user saga
function* handleDeleteUser(action: PayloadAction<DeleteUserRequest>): Generator<any, void, any> {
  try {
    yield put(deleteUserStart());

    const currentUserId: string = yield call(getCurrentUserId);
    const response: UserOperationResponse = yield call(
      userManagementService.deleteUser.bind(userManagementService),
      currentUserId,
      action.payload
    );

    if (response.success) {
      yield put(deleteUserSuccess(action.payload.userId));

      // Show success notification
      // yield put(showNotification({ type: 'success', message: response.message }));

      // Refresh statistics after deletion
      yield delay(100); // Small delay to ensure UI updates
      yield put({ type: USER_MANAGEMENT_SAGA_ACTIONS.LOAD_STATISTICS });
    }
  } catch (error) {
    if (error instanceof UserManagementError) {
      yield put(
        deleteUserFailure({
          code: error.code,
          message: error.message,
        })
      );

      // Show error notification
      // yield put(showNotification({ type: 'error', message: error.message }));
    } else {
      yield put(
        deleteUserFailure({
          code: UserManagementErrorCode.UNKNOWN_ERROR,
          message: 'Failed to delete user',
        })
      );
    }
  }
}

// Load statistics saga
function* handleLoadStatistics(): Generator<any, void, any> {
  try {
    yield put(loadStatisticsStart());

    const currentUserId: string = yield call(getCurrentUserId);
    const statistics: UserStatistics = yield call(
      userManagementService.getUserStatistics.bind(userManagementService),
      currentUserId
    );

    yield put(loadStatisticsSuccess(statistics));
  } catch (error) {
    if (error instanceof UserManagementError) {
      yield put(
        loadStatisticsFailure({
          code: error.code,
          message: error.message,
        })
      );
    } else {
      yield put(
        loadStatisticsFailure({
          code: UserManagementErrorCode.UNKNOWN_ERROR,
          message: 'Failed to load statistics',
        })
      );
    }
  }
}

// Refresh all user management data saga
function* handleRefreshData(): Generator<any, void, any> {
  try {
    // Load users and statistics in parallel
    yield put({ type: USER_MANAGEMENT_SAGA_ACTIONS.LOAD_USERS });
    yield put({ type: USER_MANAGEMENT_SAGA_ACTIONS.LOAD_STATISTICS });
  } catch (error) {
    // Individual sagas will handle their own errors
  }
}

// Root user management saga
export function* userManagementSaga(): Generator<any, void, any> {
  yield takeLatest(USER_MANAGEMENT_SAGA_ACTIONS.LOAD_USERS, handleLoadUsers);
  yield takeEvery(USER_MANAGEMENT_SAGA_ACTIONS.UPDATE_USER_ROLE, handleUpdateUserRole);
  yield takeEvery(USER_MANAGEMENT_SAGA_ACTIONS.DELETE_USER, handleDeleteUser);
  yield takeLatest(USER_MANAGEMENT_SAGA_ACTIONS.LOAD_STATISTICS, handleLoadStatistics);
  yield takeLatest(USER_MANAGEMENT_SAGA_ACTIONS.REFRESH_DATA, handleRefreshData);
}

// Export default
export default userManagementSaga;
