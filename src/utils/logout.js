// // utils/logout.js
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// export const logoutHandler = () => {
//   const token = Cookies.get('admin_token');
//   let role = null;

//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       role = decoded?.role;
//     } catch (error) {
//       console.error('Failed to decode token:', error);
//     }
//   }

//   Cookies.remove('admin_token');

//   // Redirect based on role
//   if (role === 1) {
//     // Admin
//     window.location.href = '/admin/login';
//   } else if (role === 2) {
//     // Vendor
//     window.location.href = '/vendor/login';
//   } else if (role === 3) {
//     // Employee
//     window.location.href = '/login';
//   } else {
//     // Fallback
//     window.location.href = '/login';
//   }
// };




// utils/logout.js
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const logoutHandler = () => {
  const token = Cookies.get('admin_token');
  let role = null;

  // Try decoding token
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  Cookies.remove('admin_token');

  // Get current path parts
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const vendorSlug = pathParts[0];        // e.g., 'akc'
  const employeeSlug = pathParts[1];      // e.g., 'john' (for /akc/john/dashboard)

  // Role-based redirection
  if (role === 1) {
    // Admin
    window.location.href = '/admin/login';
  } else if (role === 2) {
    // Vendor
    if (vendorSlug) {
      window.location.href = `/${vendorSlug}/login`;
    } else {
      window.location.href = '/vendor/login';
    }
  } else if (role === 3) {
    // Employee
    if (vendorSlug && employeeSlug) {
      window.location.href = `/${vendorSlug}/${employeeSlug}/login`;
    } else {
      window.location.href = '/login';
    }
  } else {
    // Fallback
    window.location.href = '/login';
  }
};
