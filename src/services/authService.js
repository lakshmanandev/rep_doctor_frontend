
// authService.js - Service for authentication
import axios from 'axios';
import { getAuthorizationHeader } from '../utils/cookies';
import api from './api';
import log from '../utils/logger';

export const authService = {

  forgotPassword: async (email) => {
    const response = await api.post('/api/admin/forgot-password', email);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/api/admin/reset-password', { data });
    return response.data;
  },


  updateProfile: async (userData) => {
    const response = await api.put('/api/admin/profile', userData);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.post('/api/admin/change-password', passwords);
    return response.data;
  },


  sendVerificationEmail: async () => {
    const response = await api.post('/api/admin/send-verification');
    return response.data;
  },


  // support tickets
  getSupportTickets: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Map frontend filter names to backend API parameter names
      if (params.role) queryParams.append("role", params.role);
      if (params.status && params.status !== "All Tickets") {
        queryParams.append("status", params.status);
      }
      if (params.search) queryParams.append("search", params.search);
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);
      // Add pagination parameters if your API supports it
      if (params.page) {
        queryParams.push(`page=${params.page}`);
      }

      if (params.limit) {
        queryParams.push(`limit=${params.limit}`);
      }

      const response = await api.get(
        `/api/admin/tickets?${queryParams.toString()}`
      );
      return response.data; // Assuming your API returns data directly
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch support tickets",
      };
    }
  },

  getSupportTicketDetails: async (id) => {
    const response = await api.get(`/api/admin/ticket-with-messages/${id}`);
    return response.data;
  },

  postSupportTicketmessage: async (id, payload) => {
    const response = await api.post(`/api/admin/add-ticket-message/`, payload);
    return response.data;
  },


  //faq
  getFAQs: async () => {
    const response = await api.get(`/api/admin/list-faq/`);
    return response.data;
  },

  newFAQ: async (params) => {
    // FIXED: Ensure `params` (with question & answer) is passed as the request body
    const response = await api.post(`/api/admin/add-faq/`, params);
    return response.data;
  },

  updateFAQ: async ({ id, ...params }) => {
    // FIXED: Send updated question & answer to backend
    const response = await api.post(`/api/admin/update-faq/${id}`, params);
    return response.data;
  },

  deleteFAQ: async ({ id }) => {
    const response = await api.delete(`/api/admin/delete-faq/${id}`);
    return response.data;
  },

  contactSupport: async (data) => {
    const response = await api.post(`/api/admin/contact-support/`, data);
    return response.data;
  },

  saveImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("images", imageFile);

    const response = await axios.post(
      "https://adrox.ai/api/image-save",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    log("response", response)

    return response.data;
  },





  //--------   AKC  ----------


  //admin sec

  admin_login: async (credentials) => {
    const response = await api.post('/api/auth/rep-login', credentials);
    return response.data;
  },


  getVendors: async (data = {}) => {
    const response = await api.post(`/api/vendor/list`, data);
    return response.data
  },

  getVendorsName: async () => {
    const response = await api.get(`/api/vendor/vendorfiltername`);
    return response.data;
  },

  fetchVendorByIdEdit: async (id) => {
    const response = await api.post(`/api/vendor/list`, { vendorIds: [id] });
    return response.data;
  },

  fetchVendorByIdDetails: async (data) => {
    const response = await api.post(`/api/vendor/transaction/list`, data);
    return response.data;
  },

  AddVendor: async (data) => {
    const response = await api.post(`/api/vendor/create`, data);
    return response.data;
  },

  updateVendor: async (id, data) => {
    const response = await api.put(`/api/vendor/update/${id}`, data);
    return response.data;
  },

  resetVendorPassword: async (data) => {
    const response = await api.post(`/api/vendor/reset-password`, data);
    return response.data;
  },

  deleteVendor: async (id) => {
    const response = await api.delete(`/api/vendor/delete/${id}`);
    return response.data;
  },

  fetchManageTransactionbyAdmin: async (data) => {
    const response = await api.post(`/api/vendor/unpaid-transaction-history`, data);
    return response.data;
  },

  getAdminEarnings: async (data) => {
    const response = await api.post(`/api/vendor/getAdminEarningsLists`, data);
    return response.data;
  },

  getAdminSendGasfeesEarnings: async (data) => {
    const response = await api.post(`/api/vendor/getAdminEarningsGasLists`, data);
    return response.data;
  },

  getAdminChartData: async (data) => {
    const response = await api.post(`/api/vendor/getAdminEarningsChartData`, data);
    return response.data;
  },

  getAdminBalance: async () => {
    const response = await api.post(`/api/vendor/getAdminBalance`);
    return response.data;
  },



  //employee

  validateEmployee: async (credentials) => {
    const response = await api.post('/api/get_employee_name_validate', credentials);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },


  getEmployees: async (data = {}) => {
    const response = await api.post(`/api/employee/list`, data);
    return response.data;
  },

  getEmployeesName: async () => {
    const response = await api.get(`/api/employee/filtername`);
    return response.data;
  },

  getEmployeeByIdEdit: async (id) => {
    const response = await api.post(`/api/employee/list`, { employeeIds: [id] });
    return response.data;
  },

  getEmployeeByIdDetail: async (data) => {
    const response = await api.post(`/api/employee/transaction/list`, data);
    return response.data;
  },

  AddEmployee: async (data) => {
    const response = await api.post(`/api/employee/create`, data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/api/employee/update/${id}`, data);
    return response.data;
  },

  resetEmployeePassword: async (data) => {
    const response = await api.post(`/api/employee/reset-password`, data);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/api/employee/delete/${id}`);
    return response.data;
  },

  getSiteSettings: async () => {
    const response = await api.get('/api/admin/site-settings');
    return response.data;
  },

  updateSiteSettings: async (data) => {
    const response = await api.post('/api/admin/site-settings', data);
    return response.data;
  },

  getPaymentConfig: async () => {
    const response = await api.get('/api/admin/payment-settings');
    return response.data;
  },

  UpdatePaymentConfig: async (data) => {
    const response = await api.post('/api/admin/payment-settings', data);
    return response.data;
  },

  getAdminProfile: async () => {
    const response = await api.get('/api/admin/profile');
    return response.data;
  },


  UpdateAdminProfile: async (data) => {
    const response = await api.put('/api/admin/profile', data);
    return response.data;
  },

  changePasswordAdmin: async (data) => {
    const response = await api.put('/api/admin/change-password', data);
    return response.data;
  },

  fetchTransactionDetailsbyAdmin: async (data) => {
    const response = await api.post(`/api/vendor/transaction-history`, data);
    return response.data;
  },

  getEmployeesAddress: async (data) => {
    const response = await api.post(`/api/admin/txn-filtered-only-addresses`, data);
    return response.data;
  },

  verifyTwoFactor: async (data) => {
    const response = await api.post(`/api/admin/2favalidate`, data);
    return response.data;
  },

  fetchGetBalancebyAdmin: async (data) => {
    const response = await api.post(`/api/getbalance`, data);
    return response.data;
  },


  // Helper method to set token in local storage and API headers
  setAuthToken: (token) => {
    localStorage.setItem('admin_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Helper method to initialize authentication from stored token
  initAuth: () => {
    const token = getAuthorizationHeader();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  }
};

export default authService;