import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { AppOverviewSidebar } from '../../components/UI/Sidebars';
import HomePage from './HomePage';

const HomeRoute: React.FC = () => {
  return (
    <RouteLayout pageName="Home" sidebarContent={<AppOverviewSidebar />}>
      <HomePage />
    </RouteLayout>
  );
};

export default HomeRoute;
