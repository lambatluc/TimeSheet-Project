import React, { ReactElement } from 'react';
import { useRoutes, Navigate, RouteObject } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { protectedRoutes } from './privateRouters';
import { publicRoutes } from './publicRoutes';
import { LOGIN } from '@/constants';

const PrivateRoute: React.FC<{ element: ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to={LOGIN}/>;
};
const PublicRoute: React.FC<{ element: ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/projects"/> : element;
};
const wrapProtectedRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => {
    if (route.children !== undefined && Array.isArray(route.children)) {
      return {
        ...route,
        element: route.element !== undefined ? <PrivateRoute element={route.element as ReactElement} /> : undefined,
        children: wrapProtectedRoutes(route.children)
      };
    }
    return {
      ...route,
      element: route.element !== undefined ? <PrivateRoute element={route.element as ReactElement} /> : undefined
    };
  });
};
const wrapPublicRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => {
    if (route.children !== undefined && Array.isArray(route.children)) {
      return {
        ...route,
        element: route.element !== undefined ? <PublicRoute element={route.element as ReactElement} /> : undefined,
        children: wrapPublicRoutes(route.children)
      };
    }
    return {
      ...route,
      element: route.element !== undefined ? <PublicRoute element={route.element as ReactElement} /> : undefined
    };
  });
};

export const Router: React.FC = (): React.ReactElement | null => {
  const protectedRoutesWrapped = wrapProtectedRoutes(protectedRoutes);
  const publicRoutesWrapped = wrapPublicRoutes(publicRoutes);
  const routes = [...publicRoutesWrapped, ...protectedRoutesWrapped];
  const element = useRoutes(routes);
  return element;
};
