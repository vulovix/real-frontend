import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import NoSidebarPage from '../../components/Pages/NoSidebarPage';

const NoSidebarRoute: React.FC = () => {
  return (
    <RouteLayout pageName="No Sidebar Example">
      <NoSidebarPage />
    </RouteLayout>
  );
};

export default NoSidebarRoute;
