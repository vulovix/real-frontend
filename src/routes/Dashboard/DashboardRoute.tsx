/**
 * Dashboard Route Page
 * Only accessible when authenticated
 * Displays Dashboard feature in main layout with sidebar
 */

import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { DashboardSidebar } from '../../features/Dashboard/components';
import { Dashboard } from '../../features/Dashboard/Dashboard';

export function DashboardRoute() {
  return (
    <RouteLayout pageName="Dashboard" sidebarContent={<DashboardSidebar />}>
      <Dashboard />
    </RouteLayout>
  );
}
