import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, Burger, Container, Group, Text } from '@mantine/core';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ opened, toggle }) => {
  const location = useLocation();

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
          <Anchor
            component={Link}
            to="/saga"
            fw={location.pathname === '/saga' ? 700 : 400}
            c={location.pathname === '/saga' ? 'blue' : 'dark'}
            underline="never"
          >
            Saga Feature
          </Anchor>
          <Anchor
            component={Link}
            to="/thunk"
            fw={location.pathname === '/thunk' ? 700 : 400}
            c={location.pathname === '/thunk' ? 'blue' : 'dark'}
            underline="never"
          >
            Thunk Feature
          </Anchor>
          <Anchor
            component={Link}
            to="/no-sidebar"
            fw={location.pathname === '/no-sidebar' ? 700 : 400}
            c={location.pathname === '/no-sidebar' ? 'blue' : 'dark'}
            underline="never"
          >
            No Sidebar
          </Anchor>
          <Anchor
            component={Link}
            to="/settings"
            fw={location.pathname === '/settings' ? 700 : 400}
            c={location.pathname === '/settings' ? 'blue' : 'dark'}
            underline="never"
          >
            Settings
          </Anchor>
        </Group>
      </Group>
    </Container>
  );
};

export default Header;
