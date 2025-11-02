/**
 * Editor Route Component
 * Wrapper component for the Editor page with layout and sidebar
 */

import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { EditorPage } from '../../components/Pages/EditorPage';
import { EditorSidebar } from '../../features/Editor/components';

export function EditorRoute() {
  return (
    <RouteLayout pageName="Editor" sidebarContent={<EditorSidebar />}>
      <EditorPage />
    </RouteLayout>
  );
}
