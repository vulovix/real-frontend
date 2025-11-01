import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { SagaSidebar } from '../../components/UI/Sidebars';
import Feature1Page from '../../features/Feature1';

const SagaRoute: React.FC = () => {
  return (
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
  );
};

export default SagaRoute;
