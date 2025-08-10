// dashboardService.js - Service for dashboard data
import api from './api';

export const dashboardService = {
  getDashboardData: async (data) => {
    const response = await api.post('/api/admin/dashboard',data);
    return response.data;
  },
  getVendorDashboardData: async (data) => {
    const response = await api.post('/api/vendor/dashboard',data);
    return response.data;
  },

  getStatsData: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getIncomeData: async (timeframe) => {
    const response = await api.get(`/dashboard/income?timeframe=${timeframe}`);
    return response.data;
  },

  getTransactions: async (limit) => {
    const response = await api.get(`/transactions?limit=${limit}`);
    return response.data;
  },

  getRecentCustomers: async (limit) => {
    const response = await api.get(`/customers/recent?limit=${limit}`);
    return response.data;
  }
};