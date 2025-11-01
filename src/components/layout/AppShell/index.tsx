import React, { ReactNode, useState } from 'react';
import styles from './AppShell.module.scss';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Anchor, AppShell, Button, Container, Group, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../../UI/Header';
import MobileNavigation from '../../UI/Header/MobileNavigation';

interface SubRoute {
  name: string;
  path: string;
}

interface AppShellLayoutProps {
  pageName: string;
  subRoutes?: SubRoute[];
  sidebarContent?: ReactNode;
  children: ReactNode;
}

const AppShellLayout: React.FC<AppShellLayoutProps> = ({
  pageName,
  subRoutes = [],
  sidebarContent,
  children,
}) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding={0}
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md" hiddenFrom="sm">
        <MobileNavigation onLinkClick={close} />
      </AppShell.Navbar>

      <AppShell.Main py="md">
        <Container size="lg">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              marginTop: 'var(--app-shell-header-height)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Text size="xl" fw={600}>
                {pageName}
              </Text>

              {subRoutes.length > 0 && (
                <Group gap="sm">
                  {subRoutes.map((route) => (
                    <Anchor key={route.path} component={Link} to={route.path} size="sm" c="blue">
                      {route.name}
                    </Anchor>
                  ))}
                </Group>
              )}
            </div>

            {sidebarContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                leftSection={isSidebarOpen ? <IconX size={16} /> : <IconMenu2 size={16} />}
              >
                {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
              </Button>
            )}
          </div>

          <div className={styles.mainContentWrapper}>
            <div style={{ flex: 1, minWidth: 0 }}>{children}</div>

            {sidebarContent && isSidebarOpen && (
              <div className={styles.sidebarWrapper}>
                <Paper p="md" withBorder>
                  {sidebarContent}
                </Paper>
              </div>
            )}
          </div>
        </Container>
      </AppShell.Main>

      <AppShell.Footer p="md" style={{ textAlign: 'center' }}>
        <Text size="sm" c="dimmed">
          Redux + Saga + Thunk Demo App - Built with Mantine & React Router
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
};

export default AppShellLayout;
