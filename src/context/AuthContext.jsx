// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { clearCookies, getAuthorizationHeader } from '../utils/cookies';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [vendorDetail, setVendorDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);


  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthorizationHeader();
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearCookies();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const stored = sessionStorage.getItem("employeeDetail");
    if (stored) setEmployeeDetail(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setIsAuthenticated,
        setUser,
        initAuth,
        employeeDetail,
        setEmployeeDetail,
        vendorDetails,
        setVendorDetails,
        employeeDetails,
        setEmployeeDetails,
        vendorDetail,
        setVendorDetail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};