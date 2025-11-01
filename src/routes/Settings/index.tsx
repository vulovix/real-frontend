import React from 'react';
import RouteLayout from '../../components/layout/RouteLayout';
import SettingsPage from '../../components/SettingsPage';
import { SettingsSidebar } from '../../components/sidebars';

const SettingsRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Settings" sidebarContent={<SettingsSidebar />}>
      <SettingsPage />
    </RouteLayout>
  );
};

export default SettingsRoute;
