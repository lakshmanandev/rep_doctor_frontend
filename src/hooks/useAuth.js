import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import log from '../utils/logger';

const useAuth = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      setIsAuthenticated(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };


  const admin_login = async (credentials) => {
    try {
      const response = await authService.admin_login(credentials);
      return response;
    } catch (err) {
      setIsAuthenticated(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };


  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const changePassword = async (passwords) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.changePassword(passwords);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      throw err;
    }
  };


  const resetPassword = async (resetData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(resetData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      const { token } = response;

      // Update stored token
      authService.setAuthToken(token);
      return response;
    } catch (err) {
      // If refresh fails, log the user out
      console.error('Token refresh failed:', err);
      throw err;
    }
  };




  const getDriverDetails = async (id) => {
    try {
      const response = await authService.getDriverDetails(id);
      log("responseresponse", response)
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'kycVerify failed');
      throw err;
    }
  }


  const adminVerification = async (data) => {
    try {
      const response = await authService.adminVerification(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'adminVerification failed');
      throw err;
    }
  }

  const AddLocation = async (data) => {
    try {
      const response = await authService.addLocations(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'location failed');
      throw err;
    }
  }

  const getLocations = async (params = {}) => {
    try {
      const response = await authService.getLocations(params);
      return response?.data;
    } catch (err) {
      setError(err.response?.data?.message || 'location failed');
      throw err;
    }
  }


  const GetLocationById = async (id) => {
    try {
      const response = await authService.GetLocationById(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'location failed');
      throw err;
    }
  }

  const UpdateLocation = async (id, data) => {
    try {
      const response = await authService.UpdateLocation(id, data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'location failed');
      throw err;
    }
  }

  const deleteLocation = async (id) => {
    try {
      const response = await authService.DeleteLocation(id);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'location failed');
      throw error;
    }
  }
  


  // support ticket
  const getSupportTickets = async (params) => {
    try {
      const data = await authService.getSupportTickets(params);
      return data;
    } catch (err) {
      log("Failed to fetch tickets:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to fetch tickets",
      };
    }
  };



  const getSupportTicketDetails = async (id) => {
    try {
      const data = await authService.getSupportTicketDetails(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ticket details");
      throw err;
    }
  };

  const postSupportTicketmessage = async (id, payload) => {
    try {
      const data = await authService.postSupportTicketmessage(id, payload);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch send message ");
      throw err;
    }
  };


  //faq
  const getFAQs = async () => {
    try {
      const data = await authService.getFAQs();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch FAQ's");
      throw err;
    }
  };

  const newFAQ = async (params) => {
    try {
      const data = await authService.newFAQ(params);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add FAQ");
    }
  };

  const updateFAQ = async ({ id, ...params }) => {
    try {
      const data = await authService.updateFAQ({ id, ...params });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update FAQ");
    }
  };

  const deleteFAQ = async (id) => {
    try {
      const data = await authService.deleteFAQ({ id });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete FAQ");
    }
  };

  const contactSupport = async (data) => {
    try {
      const response = await authService.contactSupport(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'contact support failed');
      throw err;
    }
  }

  const saveImage = async (imageFile) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.saveImage(imageFile);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };






  // ----------  AKC   -------------

  const getVendors = async (data = {}) => {
    try {
      const response = await authService.getVendors(data);
      return response;
    } catch (err) {
      console.error('Error in getVendors hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getVendors failed'
      };
    }
  }


  const getVendorsName = async () => {
    try {
      const response = await authService.getVendorsName();
      return response;
    } catch (err) {
      console.error('Error in getVendorName hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getVendorName failed'
      };
    }
  }

  const fetchVendorByIdEdit = async (id) => {
    try {
      const response = await authService.fetchVendorByIdEdit(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }

  const fetchVendorByIdDetails = async (data) => {
    try {
      const response = await authService.fetchVendorByIdDetails(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }

  const AddVendor = async (data) => {
    try {
      const response = await authService.AddVendor(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'AddVendor failed');
      throw err;
    }
  }

  const updateVendor = async (id, data) => {
    try {
      const response = await authService.updateVendor(id, data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'updateVendor failed');
      throw err;
    }
  }

  const resetVendorPassword = async (data) => {
    try {
      const response = await authService.resetVendorPassword(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'updateVendor failed');
      throw err;
    }
  }


  const deleteVendor = async (id) => {
    try {
      const response = await authService.deleteVendor(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }


  const getEmployees = async (data = {}) => {
    try {
      const response = await authService.getEmployees(data);
      return response;
    } catch (err) {
      console.error('Error in getEmployees hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getEmployees failed'
      };
    }
  }


  const getEmployeesName = async () => {
    try {
      const response = await authService.getEmployeesName();
      return response;
    } catch (err) {
      console.error('Error in getEmployeeName hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getEmployeeName failed'
      };
    }
  }

  const AddEmployee = async (data) => {
    try {
      const response = await authService.AddEmployee(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'AddVendor failed');
      throw err;
    }
  }

  const updateEmployee = async (id, data) => {
    try {
      const response = await authService.updateEmployee(id, data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'updateEmployee failed');
      throw err;
    }
  }

  const getEmployeeByIdEdit = async (id) => {
    try {
      const response = await authService.getEmployeeByIdEdit(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }

  const getEmployeeByIdDetail = async (data) => {
    try {
      const response = await authService.getEmployeeByIdDetail(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }

  const resetEmployeePassword = async (data) => {
    try {
      const response = await authService.resetVendorPassword(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'updateVendor failed');
      throw err;
    }
  }


  const deleteEmployee = async (id) => {
    try {
      const response = await authService.deleteEmployee(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getvendor failed');
      throw err;
    }
  }


  const getSiteSettings = async () => {
    try {
      const response = await authService.getSiteSettings();
      return response;
    } catch (err) {
      console.error('Error in getSiteSettings hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getSiteSetting failed'
      };
    }
  }

  const updateSiteSettings = async (data) => {
    try {
      const response = await authService.updateSiteSettings(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'updateSiteSetting failed');
      throw err;
    }
  }

  const getPaymentConfig = async () => {
    try {
      const response = await authService.getPaymentConfig();
      return response;
    } catch (err) {
      console.error('Error in getPaymentConfig hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getPaymentConfig failed'
      };
    }
  }

  const UpdatePaymentConfig = async (data) => {
    try {
      const response = await authService.UpdatePaymentConfig(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'UpdatePaymentConfig failed');
      throw err;
    }
  }



  const getAdminProfile = async () => {
    try {
      const response = await authService.getAdminProfile();
      return response;
    } catch (err) {
      console.error('Error in getAdminProfile hook:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'getAdminProfile failed'
      };
    }
  }

  const UpdateAdminProfile = async (data) => {
    try {
      const response = await authService.UpdateAdminProfile(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'UpdateAdminProfile failed');
      throw err;
    }
  }

  const changePasswordAdmin = async (data) => {
    try {
      const response = await authService.changePasswordAdmin(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'changePasswordAdmin failed');
      throw err;
    }
  }

  const fetchTransactionDetailsbyAdmin = async (data) => {
    try {
      const response = await authService.fetchTransactionDetailsbyAdmin(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'fetchTransactionDetailsbyAdmin failed');
      throw err;
    }
  }

  const getEmployeesAddress = async (data) => {
    try {
      const response = await authService.getEmployeesAddress(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getEmployeesAddress failed');
      throw err;
    }
  }

  const fetchManageTransactionbyAdmin = async (data) => {
    try {
      const response = await authService.fetchManageTransactionbyAdmin(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'fetchManageTransactionbyAdmin failed');
      throw err;
    }
  }

  const verifyTwoFactor = async (data) => {
    try {
      const response = await authService.verifyTwoFactor(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'verifyTwoFactor failed');
      throw err;
    }
  }

  const fetchGetBalancebyAdmin = async (data) => {
    try {
      const response = await authService.fetchGetBalancebyAdmin(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'fetchGetBalancebyAdmin failed');
      throw err;
    }
  }

  const getAdminSendGasfeesEarnings = async (data) => {
    try {
      const response = await authService.getAdminSendGasfeesEarnings(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getAdminSendGasfeesEarnings failed');
      throw err;
    }
  }


  const getAdminEarnings = async (data) => {
    try {
      const response = await authService.getAdminEarnings(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getAdminEarnings failed');
      throw err;
    }
  }

  const getAdminChartData = async (data) => {
    try {
      const response = await authService.getAdminChartData(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getAdminChartData failed');
      throw err;
    }
  }

  const getAdminBalance = async () => {
    try {
      const response = await authService.getAdminBalance();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'getAdminBalance failed');
      throw err;
    }
  }


  return {
    user,
    isAuthenticated,
    loading,
    error,
    admin_login,
    login,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    getDriverDetails,
    adminVerification,
    getLocations,
    AddLocation,
    GetLocationById,
    UpdateLocation,
    deleteLocation,
    getSupportTickets,
    getSupportTicketDetails,
    postSupportTicketmessage,
    getFAQs,
    newFAQ,
    updateFAQ,
    deleteFAQ,
    contactSupport,
    saveImage,


    //admin
    getVendorsName,
    getVendors,
    getEmployees,
    getEmployeesName,
    fetchVendorByIdEdit,
    fetchVendorByIdDetails,
    AddVendor,
    updateVendor,
    resetVendorPassword,
    deleteVendor,

    getEmployeeByIdEdit,
    getEmployeeByIdDetail,
    AddEmployee,
    updateEmployee,
    resetEmployeePassword,
    deleteEmployee,

    getSiteSettings,
    updateSiteSettings,
    getPaymentConfig,
    UpdatePaymentConfig,
    getAdminProfile,
    UpdateAdminProfile,
    changePasswordAdmin,
    fetchTransactionDetailsbyAdmin,
    getEmployeesAddress,
    fetchManageTransactionbyAdmin,
    verifyTwoFactor,
    fetchGetBalancebyAdmin,
    getAdminEarnings,
    getAdminSendGasfeesEarnings,
    getAdminChartData,
    getAdminBalance,
  };
};

export default useAuth;