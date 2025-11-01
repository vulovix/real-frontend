import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import SettingsPage from '../../components/Pages/SettingsPage';
import { SettingsSidebar } from '../../components/UI/Sidebars';

const SettingsRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Settings" sidebarContent={<SettingsSidebar />}>
      <SettingsPage />
    </RouteLayout>
  );
};

export default SettingsRoute;
