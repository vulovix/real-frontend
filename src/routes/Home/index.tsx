import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import HomePage from '../../components/Pages/HomePage';
import { AppOverviewSidebar } from '../../components/UI/Sidebars';

const HomeRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Home" sidebarContent={<AppOverviewSidebar />}>
      <HomePage />
    </RouteLayout>
  );
};

export default HomeRoute;
