//#region Imports
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
//#endregion

//#region Component
interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  if (!token) {
    // 如果没有 Token，重定向到登录页，并记录来源地址
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
//#endregion

export default AuthRoute;
