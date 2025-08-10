// // PrivateRoute.js
// import React from 'react';
// import { Navigate, Outlet } from "react-router-dom";
// import useAuth from '../../hooks/useAuth';
// import LoadingScreen from '../common/LoadingScreen';
// import log from '../../utils/logger';

// const PrivateRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
//   log("isAuthenticated", isAuthenticated);

//   if (loading) return <LoadingScreen />;

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;


import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // If logged in → show protected page, else → go to admin login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
