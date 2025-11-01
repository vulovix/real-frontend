import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { SettingsSidebar } from '../../components/UI/Sidebars';
import SettingsPage from './SettingsPage';

const SettingsRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Settings" sidebarContent={<SettingsSidebar />}>
      <SettingsPage />
    </RouteLayout>
  );
};

export default SettingsRoute;
