import React, { ReactNode } from 'react';
import AppShellLayout from './appshell';

interface SubRoute {
  name: string;
  path: string;
}

interface RouteLayoutProps {
  pageName: string;
  subRoutes?: SubRoute[];
  sidebarContent?: ReactNode;
  children: ReactNode;
}

const RouteLayout: React.FC<RouteLayoutProps> = ({
  pageName,
  subRoutes,
  sidebarContent,
  children,
}) => {
  return (
    <AppShellLayout pageName={pageName} subRoutes={subRoutes} sidebarContent={sidebarContent}>
      {children}
    </AppShellLayout>
  );
};

export default RouteLayout;
