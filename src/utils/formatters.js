import { formatDistanceToNow } from 'date-fns';

// formatters.js - Utility functions for formatting data

/**
 * Format a date to a readable string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format a date to include time
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date and time
 */
// export const formatDateTime = (date) => {
//   if (!date) return '';

//   const dateObj = date instanceof Date ? date : new Date(date);
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric'
//   }).format(dateObj);
// };

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
// export const formatCurrency = (amount, currency = 'USD') => {
//   if (amount === null || amount === undefined) return '';

//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: currency,
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(amount);
// };

/**
 * Format a number with thousand separators and decimal places
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format a percentage
 * @param {number} value - Value to format as percentage (e.g., 0.25 for 25%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis if it exceeds maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

/**
 * Convert string to title case
 * @param {string} text - Text to convert
 * @returns {string} Title cased text
 */
export const toTitleCase = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a phone number to (XXX) XXX-XXXX
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Strip all non-numeric characters
  const cleaned = ('' + phone).replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }

  return phone; // Return original if not 10 digits
};

/**
 * Format a URL to remove protocol
 * @param {string} url - URL to format
 * @returns {string} Formatted URL
 */
export const formatUrl = (url) => {
  if (!url) return '';

  return url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
};

/**
 * Format a duration in seconds to mm:ss or hh:mm:ss
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return '';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a name (first + last)
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Formatted full name
 */
export const formatName = (firstName, lastName) => {
  const first = firstName || '';
  const last = lastName || '';

  if (first && last) {
    return `${first} ${last}`;
  }

  return first || last || '';
};

/**
 * Format an address
 * @param {Object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address = {}) => {
  const {
    street1,
    street2,
    city,
    state,
    zipCode,
    country
  } = address;

  let formattedAddress = '';

  if (street1) formattedAddress += street1;
  if (street2) formattedAddress += formattedAddress ? `, ${street2}` : street2;
  if (city) formattedAddress += formattedAddress ? `, ${city}` : city;
  if (state) formattedAddress += city ? ` ${state}` : state;
  if (zipCode) formattedAddress += state ? ` ${zipCode}` : zipCode;
  if (country) formattedAddress += formattedAddress ? `, ${country}` : country;

  return formattedAddress;
};

export const formtadob = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const day = date.getDate(); // returns 1-31
  const month = date.toLocaleString('default', { month: 'long' }); // 'March'
  const year = date.getFullYear(); // 1988

  return `${day} ${month} ${year}`;
};

export const getTimeAgo = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (value) => {
  return `${parseFloat(value).toFixed(6)}`;
};

export const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (`0${now.getMonth() + 1}`).slice(-2);
  const day = (`0${now.getDate()}`).slice(-2);
  const hours = (`0${now.getHours()}`).slice(-2);
  const minutes = (`0${now.getMinutes()}`).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export default {
  formatDate,
  formatDateTime,
  // formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  toTitleCase,
  formatPhone,
  formatUrl,
  formatDuration,
  formatName,
  formatAddress,
  formtadob,
  getTimeAgo,
  formatCurrency,
  formatDateTime,
  getCurrentDateTime,
};