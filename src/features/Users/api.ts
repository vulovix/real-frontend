/**
 * User Management API Service
 * Professional implementation for admin user management
 */

import { RepositoryFactory } from '../../services/repositories';
import { StoredUser, User, UserRole } from '../Auth/types';
import {
  DeleteUserRequest,
  SortDirection,
  UpdateUserRoleRequest,
  UserFilter,
  UserManagementErrorCode,
  UserOperationResponse,
  UserSortField,
  UserStatistics,
} from './types';

// User management error class
export class UserManagementError extends Error {
  constructor(
    public readonly code: UserManagementErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'UserManagementError';
  }
}

// User management service
export class UserManagementService {
  private static instance: UserManagementService | null = null;

  private constructor() {}

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  /**
   * Simulate network delay for realistic UX
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 600 + 200; // 200-800ms
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Convert StoredUser to public User interface
   */
  private mapToPublicUser(storedUser: StoredUser): User {
    const { passwordHash, salt, ...publicUser } = storedUser;
    return publicUser;
  }

  /**
   * Load all users (admin only)
   */
  async loadUsers(requestingUserId: string): Promise<User[]> {
    await this.simulateNetworkDelay();

    const userRepo = await RepositoryFactory.getUserRepository();

    // Verify requesting user is admin
    const requestingUser = await userRepo.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== UserRole.ADMIN) {
      throw new UserManagementError(
        UserManagementErrorCode.UNAUTHORIZED,
        'Only administrators can view user list'
      );
    }

    // Get all users
    const users = await userRepo.findAll();
    return users.map((user) => this.mapToPublicUser(user));
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    requestingUserId: string,
    request: UpdateUserRoleRequest
  ): Promise<UserOperationResponse> {
    await this.simulateNetworkDelay();

    const userRepo = await RepositoryFactory.getUserRepository();

    // Verify requesting user is admin
    const requestingUser = await userRepo.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== UserRole.ADMIN) {
      throw new UserManagementError(
        UserManagementErrorCode.UNAUTHORIZED,
        'Only administrators can modify user roles'
      );
    }

    // Cannot modify own role
    if (requestingUserId === request.userId) {
      throw new UserManagementError(
        UserManagementErrorCode.CANNOT_MODIFY_SELF,
        'You cannot modify your own role'
      );
    }

    // Find target user
    const targetUser = await userRepo.findById(request.userId);
    if (!targetUser) {
      throw new UserManagementError(UserManagementErrorCode.USER_NOT_FOUND, 'User not found');
    }

    // If demoting from admin, ensure at least one admin remains
    if (targetUser.role === UserRole.ADMIN && request.newRole === UserRole.USER) {
      const adminUsers = await userRepo.findByRole(UserRole.ADMIN);
      if (adminUsers.length <= 1) {
        throw new UserManagementError(
          UserManagementErrorCode.CANNOT_DELETE_LAST_ADMIN,
          'Cannot demote the last administrator'
        );
      }
    }

    // Update user role
    const updatedUser = await userRepo.update(request.userId, {
      role: request.newRole,
    });

    return {
      success: true,
      user: this.mapToPublicUser(updatedUser),
      message: `User role updated to ${request.newRole}`,
    };
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(
    requestingUserId: string,
    request: DeleteUserRequest
  ): Promise<UserOperationResponse> {
    await this.simulateNetworkDelay();

    const userRepo = await RepositoryFactory.getUserRepository();
    const sessionRepo = await RepositoryFactory.getSessionRepository();

    // Verify requesting user is admin
    const requestingUser = await userRepo.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== UserRole.ADMIN) {
      throw new UserManagementError(
        UserManagementErrorCode.UNAUTHORIZED,
        'Only administrators can delete users'
      );
    }

    // Cannot delete self
    if (requestingUserId === request.userId) {
      throw new UserManagementError(
        UserManagementErrorCode.CANNOT_MODIFY_SELF,
        'You cannot delete your own account'
      );
    }

    // Find target user
    const targetUser = await userRepo.findById(request.userId);
    if (!targetUser) {
      throw new UserManagementError(UserManagementErrorCode.USER_NOT_FOUND, 'User not found');
    }

    // If deleting admin, ensure at least one admin remains
    if (targetUser.role === UserRole.ADMIN) {
      const adminUsers = await userRepo.findByRole(UserRole.ADMIN);
      if (adminUsers.length <= 1) {
        throw new UserManagementError(
          UserManagementErrorCode.CANNOT_DELETE_LAST_ADMIN,
          'Cannot delete the last administrator'
        );
      }
    }

    // Delete user sessions first
    await sessionRepo.invalidateUserSessions(request.userId);

    // Delete user
    await userRepo.delete(request.userId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStatistics(requestingUserId: string): Promise<UserStatistics> {
    await this.simulateNetworkDelay();

    const userRepo = await RepositoryFactory.getUserRepository();

    // Verify requesting user is admin
    const requestingUser = await userRepo.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== UserRole.ADMIN) {
      throw new UserManagementError(
        UserManagementErrorCode.UNAUTHORIZED,
        'Only administrators can view user statistics'
      );
    }

    const allUsers = await userRepo.findAll();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const statistics: UserStatistics = {
      totalUsers: allUsers.length,
      adminUsers: allUsers.filter((user) => user.role === UserRole.ADMIN).length,
      regularUsers: allUsers.filter((user) => user.role === UserRole.USER).length,
      recentSignups: allUsers.filter((user) => new Date(user.createdAt) > sevenDaysAgo).length,
      activeUsers: allUsers.filter(
        (user) => user.lastLoginAt && new Date(user.lastLoginAt) > thirtyDaysAgo
      ).length,
    };

    return statistics;
  }

  /**
   * Filter and sort users
   */
  filterAndSortUsers(users: User[], filter: UserFilter): User[] {
    let filteredUsers = [...users];

    // Apply role filter
    if (filter.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === filter.role);
    }

    // Apply search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
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
  }
}

// Export singleton instance
export const userManagementService = UserManagementService.getInstance();
