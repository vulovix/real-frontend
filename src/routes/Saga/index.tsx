import React from 'react';
import RouteLayout from '../../components/layout/RouteLayout';
import { SagaSidebar } from '../../components/sidebars';
import Feature1Page from '../../features/feature-1';

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
