import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { SagaSidebar } from '../../components/UI/Sidebars';
import { Button, Container, Group, Paper, Text, Title } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
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
