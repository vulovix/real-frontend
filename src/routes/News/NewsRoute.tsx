/**
 * News Route Component
 * Wrapper component for the News page with layout and sidebar
 */

import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { NewsPage } from '../../components/Pages/NewsPage';
import { NewsSidebar } from '../../features/News/components';

export function NewsRoute() {
  return (
    <RouteLayout pageName="News" sidebarContent={<NewsSidebar />}>
      <NewsPage />
    </RouteLayout>
  );
}
