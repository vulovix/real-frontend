import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, Stack, Text } from '@mantine/core';

interface MobileNavigationProps {
  onLinkClick: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onLinkClick }) => {
  const location = useLocation();

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

      <Anchor
        component={Link}
        to="/saga"
        fw={location.pathname === '/saga' ? 700 : 400}
        c={location.pathname === '/saga' ? 'blue' : 'dark'}
        underline="never"
        onClick={onLinkClick}
      >
        Saga Feature
      </Anchor>

      <Anchor
        component={Link}
        to="/thunk"
        fw={location.pathname === '/thunk' ? 700 : 400}
        c={location.pathname === '/thunk' ? 'blue' : 'dark'}
        underline="never"
        onClick={onLinkClick}
      >
        Thunk Feature
      </Anchor>

      <Anchor
        component={Link}
        to="/no-sidebar"
        fw={location.pathname === '/no-sidebar' ? 700 : 400}
        c={location.pathname === '/no-sidebar' ? 'blue' : 'dark'}
        underline="never"
        onClick={onLinkClick}
      >
        No Sidebar
      </Anchor>
    </Stack>
  );
};

export default MobileNavigation;
