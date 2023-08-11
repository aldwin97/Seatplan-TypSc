import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
  allowedUserTypes: number[];
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedUserTypes,
  element,
  ...rest
}) => {
  const usertypeId = Number(window.sessionStorage.getItem('usertype_id'));

  if (!usertypeId || !allowedUserTypes.includes(usertypeId)) {
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
