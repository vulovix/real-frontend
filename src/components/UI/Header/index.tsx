import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, Burger, Container, Group, Text } from '@mantine/core';
import { selectIsAuthenticated } from '../../../features/Auth/slice';
import { useAppSelector } from '../../../store/hooks';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ opened, toggle }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Container size="lg" h="100%">
      <Group h="100%" justify="space-between">
        {/* Logo on the left */}
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text
            component={Link}
            to="/"
            size="lg"
            fw={700}
            c="blue"
            style={{ textDecoration: 'none' }}
          >
            Redux App
          </Text>
        </Group>

        {/* Navigation links on the right - hidden on small screens */}
        <Group gap="lg" visibleFrom="sm">
          <Anchor
            component={Link}
            to="/"
            fw={location.pathname === '/' ? 700 : 400}
            c={location.pathname === '/' ? 'blue' : 'dark'}
            underline="never"
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
              >
                Login
              </Anchor>
              <Anchor
                component={Link}
                to="/signup"
                fw={location.pathname === '/signup' ? 700 : 400}
                c={location.pathname === '/signup' ? 'blue' : 'dark'}
                underline="never"
              >
                Sign Up
              </Anchor>
            </>
          )}
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
