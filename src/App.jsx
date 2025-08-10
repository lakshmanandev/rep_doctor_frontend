import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './components/auth/PublicRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import LoadingScreen from './components/common/LoadingScreen';

// Common
const Login = lazy(() => import('./pages/adminPage/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin
const Dashboard = lazy(() => import('./pages/adminPage/Dashboard'));
const Vendors = lazy(() => import('./pages/adminPage/vendor/Vendors'));
const VendorDetailPage = lazy(() => import('./pages/adminPage/vendor/VendorDetail'));
const VendorAddEdit = lazy(() => import('./pages/adminPage/vendor/VendorAddEdit'));
const Employees = lazy(() => import('./pages/adminPage/employee/Employees'));
const EmployeeAddEdit = lazy(() => import('./pages/adminPage/employee/EmployeeAddEdit'));
const Payments = lazy(() => import('./pages/adminPage/Payments'));
const TwoFactorAuth = lazy(() => import('./pages/adminPage/TwoFactorAuth'));
const ResetPassword = lazy(() => import('./pages/adminPage/Reset_Password'));
const ContactSupport = lazy(() => import('./pages/adminPage/ContactSupport'));
const ChangePassword = lazy(() => import('./pages/adminPage/ChangePassword'));
const AdminEarnings = lazy(() => import('./pages/adminPage/AdminEarnings'));
const SiteSettings = lazy(() => import('./pages/adminPage/SiteSettings'));
const AdminProfile = lazy(() => import('./pages/adminPage/AdminProfile'));
const EmployeeDetail = lazy(() => import('./pages/adminPage/employee/EmployeeDetail'));
const ManageTransaction = lazy(() => import('./pages/adminPage/ManageTransaction'));
const ManageTransactionDetail = lazy(() => import('./pages/adminPage/ManageTransactionDetail'));
const AdminDashboardTransactionDetailPage = lazy(() => import('./pages/adminPage/AdminDashboardTransactionDetailPage'));

// Optional
const TransactionsPage = lazy(() => import('./pages/adminPage/TransactionsPage'));
const SupportTicket = lazy(() => import('./pages/adminPage/supportTicket/SupportTicket'));
const SupportTicketDetails = lazy(() => import('./pages/adminPage/supportTicket/SupportTicketDetails'));
const FAQ = lazy(() => import('./pages/adminPage/FAQ'));
const ForgotPassword = lazy(() => import('./pages/adminPage/Forgot_Password'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/add" element={<VendorAddEdit />} />
        <Route path="/vendors/edit/:id" element={<VendorAddEdit />} />
        <Route path="/vendors/:id" element={<VendorDetailPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<EmployeeAddEdit />} />
        <Route path="/employees/edit/:id" element={<EmployeeAddEdit />} />
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/site-setting" element={<SiteSettings />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/earnings" element={<AdminEarnings />} />
        <Route path="/manage-transaction" element={<ManageTransaction />} />
        <Route path="/manage-transaction/detail/:id" element={<ManageTransactionDetail />} />
        <Route path="/two-factor" element={<TwoFactorAuth />} />
        <Route path="/transactions/:transactionId" element={<AdminDashboardTransactionDetailPage />} />
      </Route>

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Extra pages (if needed, move to correct route group) */}
      <Route path="/support-tickets" element={<SupportTicket />} />
      <Route path="/support-tickets/:id" element={<SupportTicketDetails />} />
      <Route path="/faqs" element={<FAQ />} />
      <Route path="/transactions" element={<TransactionsPage />} />

      {/* Fallback */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
