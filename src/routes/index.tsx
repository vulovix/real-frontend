import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeRoute from './Home';
import NoSidebarRoute from './NoSidebar';
import SagaRoute from './Saga';
import SettingsRoute from './Settings';
import ThunkRoute from './Thunk';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/saga" element={<SagaRoute />} />
      <Route path="/thunk" element={<ThunkRoute />} />
      <Route path="/no-sidebar" element={<NoSidebarRoute />} />
      <Route path="/settings" element={<SettingsRoute />} />
    </Routes>
  );
};

export default AppRoutes;
