/**
 * Application routing configuration
 * Routes are flattened, access control declared in route configuration
 */

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthInitializer } from '../components/AuthInitializer';
import { OnlyPublicRoute } from '../components/Guards/OnlyPublicRoute';
import { ProtectedRoute } from '../components/Guards/ProtectedRoute';
import { DashboardRoute } from './Dashboard';
// All routes - each in its own folder
import { HomeRoute } from './Home';
import { LoginRoute } from './Login';
import { NotFoundRoute } from './NotFound';
import { SignupRoute } from './Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthInitializer />,
    children: [
      // PUBLIC ROUTES (accessible regardless of auth status)
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomeRoute />
          </ProtectedRoute>
        ),
      },

      // ONLY PUBLIC ROUTES (only when NOT authenticated)
      {
        path: 'login',
        element: (
          <OnlyPublicRoute>
            <LoginRoute />
          </OnlyPublicRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <OnlyPublicRoute>
            <SignupRoute />
          </OnlyPublicRoute>
        ),
      },

      // PROTECTED ROUTES (only when authenticated)
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        ),
      },

      // 404 CATCH-ALL ROUTE (must be last)
      {
        path: '*',
        element: <NotFoundRoute />,
      },
    ],
  },
]);
