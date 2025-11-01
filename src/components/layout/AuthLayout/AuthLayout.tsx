/**
 * Auth Layout Component
 * Google-inspired centered layout for authentication pages
 */

import { ReactNode } from 'react';
import { Anchor, Box, Container, Paper, Stack, Text, Title } from '@mantine/core';
import classes from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className={classes.container}>
      <Container size="xs" className={classes.innerContainer}>
        <Paper className={classes.paper} shadow="md" radius="lg" p="xl">
          {showLogo && (
            <Stack align="center" gap="xs" mb="xl">
              <Title order={2} className={classes.logoText}>
                NewsApp
              </Title>
              <Text size="xs" c="dimmed">
                Professional Demo App
              </Text>
            </Stack>
          )}

          <Stack align="center" gap="xs" mb="xl">
            <Title order={3} className={classes.title}>
              {title}
            </Title>
            {subtitle && (
              <Text size="sm" c="dimmed" ta="center">
                {subtitle}
              </Text>
            )}
          </Stack>

          {children}

          <Box className={classes.footer}>
            <Text size="xs" c="dimmed" ta="center">
              Built with{' '}
              <Anchor href="https://redux-toolkit.js.org/" target="_blank" rel="noopener" size="xs">
                Redux Toolkit
              </Anchor>
              {', '}
              <Anchor href="https://redux-saga.js.org/" target="_blank" rel="noopener" size="xs">
                Redux Saga
              </Anchor>
              {' & '}
              <Anchor href="https://mantine.dev/" target="_blank" rel="noopener" size="xs">
                Mantine
              </Anchor>
            </Text>
            <Text size="xs" c="dimmed" ta="center" mt="xs">
              © 2025 NewsApp Demo. Professional Implementation.
            </Text>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
