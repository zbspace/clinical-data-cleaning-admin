//#region Imports
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
//#endregion

//#region Component
interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // if (!token) {
  //   // 如果没有 Token，重定向到登录页，并记录来源地址
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};
//#endregion

export default AuthRoute;
