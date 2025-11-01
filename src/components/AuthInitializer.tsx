/**
 * AuthInitializer Component
 * Initializes authentication state on app start
 * Shows loading screen until auth state is resolved (delay handled in saga)
 */

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Center, Loader, Stack, Text } from '@mantine/core';
import { initializeSessionRequest, selectAuth } from '../features/Auth/slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);

  useEffect(() => {
    // Initialize auth session on app start (delay is handled in saga)
    dispatch(initializeSessionRequest());
  }, [dispatch]);

  // Show loading screen until auth state is initialized
  if (!authState.isInitialized) {
    return (
      <Center style={{ height: '100vh' }}>
        <Stack align="center" gap="md">
          <Loader size="sm" />
          <Text size="xs" c="dimmed">
            Loading application...
          </Text>
        </Stack>
      </Center>
    );
  }

  return <Outlet />;
}
