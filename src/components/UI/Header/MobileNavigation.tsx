import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, Stack, Text } from '@mantine/core';
import { selectIsAuthenticated } from '../../../features/Auth/slice';
import { useAppSelector } from '../../../store/hooks';

interface MobileNavigationProps {
  onLinkClick: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onLinkClick }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Stack gap="md" p="md">
      <Text size="lg" fw={600} mb="md">
        Navigation
      </Text>

      <Anchor
        component={Link}
        to="/"
        fw={location.pathname === '/' ? 700 : 400}
        c={location.pathname === '/' ? 'blue' : 'dark'}
        underline="never"
        onClick={onLinkClick}
      >
        Home
      </Anchor>

      {/* Dashboard link - only show when authenticated */}
      {isAuthenticated && (
        <Anchor
          component={Link}
          to="/dashboard"
          fw={location.pathname === '/dashboard' ? 700 : 400}
          c={location.pathname === '/dashboard' ? 'blue' : 'dark'}
          underline="never"
          onClick={onLinkClick}
        >
          Dashboard
        </Anchor>
      )}

      {/* News link - only show when authenticated */}
      {isAuthenticated && (
        <Anchor
          component={Link}
          to="/news"
          fw={location.pathname === '/news' ? 700 : 400}
          c={location.pathname === '/news' ? 'blue' : 'dark'}
          underline="never"
          onClick={onLinkClick}
        >
          News
        </Anchor>
      )}

      {/* Editor link - only show when authenticated */}
      {isAuthenticated && (
        <Anchor
          component={Link}
          to="/editor"
          fw={location.pathname === '/editor' ? 700 : 400}
          c={location.pathname === '/editor' ? 'blue' : 'dark'}
          underline="never"
          onClick={onLinkClick}
        >
          Editor
        </Anchor>
      )}

      {/* Auth links - show when not authenticated */}
      {!isAuthenticated && (
        <>
          <Anchor
            component={Link}
            to="/login"
            fw={location.pathname === '/login' ? 700 : 400}
            c={location.pathname === '/login' ? 'blue' : 'dark'}
            underline="never"
            onClick={onLinkClick}
          >
            Login
          </Anchor>
          <Anchor
            component={Link}
            to="/signup"
            fw={location.pathname === '/signup' ? 700 : 400}
            c={location.pathname === '/signup' ? 'blue' : 'dark'}
            underline="never"
            onClick={onLinkClick}
          >
            Sign Up
          </Anchor>
        </>
      )}
    </Stack>
  );
};

export default MobileNavigation;
