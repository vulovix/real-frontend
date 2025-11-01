import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../components/HomePage';
import RouteLayout from '../components/layout/RouteLayout';
import NoSidebarPage from '../components/NoSidebarPage';
import SettingsPage from '../components/SettingsPage';
import {
  AppOverviewSidebar,
  SagaSidebar,
  SettingsSidebar,
  ThunkSidebar,
} from '../components/sidebars';
import Feature1Page from '../features/feature-1';
import Feature2Page from '../features/feature-2';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteLayout pageName="Home" sidebarContent={<AppOverviewSidebar />}>
            <HomePage />
          </RouteLayout>
        }
      />
      <Route
        path="/saga"
        element={
          <RouteLayout
            pageName="Saga Feature"
            subRoutes={[
              { name: 'Advanced Saga', path: '/saga/advanced' },
              { name: 'Saga Testing', path: '/saga/testing' },
            ]}
            sidebarContent={<SagaSidebar />}
          >
            <Feature1Page />
          </RouteLayout>
        }
      />
      <Route
        path="/thunk"
        element={
          <RouteLayout
            pageName="Thunk Feature"
            subRoutes={[
              { name: 'Async Thunks', path: '/thunk/async' },
              { name: 'Error Handling', path: '/thunk/errors' },
            ]}
            sidebarContent={<ThunkSidebar />}
          >
            <Feature2Page />
          </RouteLayout>
        }
      />
      <Route
        path="/no-sidebar"
        element={
          <RouteLayout pageName="No Sidebar Example">
            <NoSidebarPage />
          </RouteLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteLayout pageName="Settings" sidebarContent={<SettingsSidebar />}>
            <SettingsPage />
          </RouteLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
