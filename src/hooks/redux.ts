/**
 * Typed Redux Hooks
 * Professional implementation of typed useSelector and useDispatch hooks
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience hook for common auth state
export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return {
    ...authState,
    dispatch,
  };
};

// Convenience hook for user management state
export const useUserManagement = () => {
  const userManagementState = useAppSelector((state) => state.userManagement);
  const dispatch = useAppDispatch();

  return {
    ...userManagementState,
    dispatch,
  };
};

// Convenience hook for news state
export const useNews = () => {
  const newsState = useAppSelector((state) => state.news);
  const dispatch = useAppDispatch();

  return {
    ...newsState,
    dispatch,
  };
};
