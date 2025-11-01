import React from 'react';
import RouteLayout from '../../components/Layout/RouteLayout';
import { ThunkSidebar } from '../../components/UI/Sidebars';
import { Button, Container, Group, Paper, Text, Title } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import Feature2Page from '../../features/Feature2';

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
