import React from 'react';
import RouteLayout from '../../components/layout/RouteLayout';
import NoSidebarPage from '../../components/NoSidebarPage';

const NoSidebarRoute: React.FC = () => {
  return (
    <RouteLayout pageName="No Sidebar Example">
      <NoSidebarPage />
    </RouteLayout>
  );
};

export default NoSidebarRoute;
