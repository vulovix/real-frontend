import React from 'react';
import HomePage from '../../components/HomePage';
import RouteLayout from '../../components/layout/RouteLayout';
import { AppOverviewSidebar } from '../../components/sidebars';

const HomeRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Home" sidebarContent={<AppOverviewSidebar />}>
      <HomePage />
    </RouteLayout>
  );
};

export default HomeRoute;
