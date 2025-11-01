import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { ThunkSidebar } from '../../components/UI/Sidebars';
import Feature2Page from '../../features/feature-2';

const ThunkRoute: React.FC = () => {
  return (
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
  );
};

export default ThunkRoute;
