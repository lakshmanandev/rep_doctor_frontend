// validators.js - Utility functions for form and data validation

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  export const isValidEmail = (email) => {
    if (isEmpty(email)) return false;
    // RFC 5322 compliant email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
   * @param {string} password - Password to validate
   * @returns {boolean} True if valid
   */
  export const isStrongPassword = (password) => {
    if (isEmpty(password)) return false;
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  /**
   * Check if passwords match
   * @param {string} password - Original password
   * @param {string} confirmPassword - Confirmation password
   * @returns {boolean} True if matching
   */
  export const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  export const isValidPhone = (phone) => {
    if (isEmpty(phone)) return false;
    // Basic phone validation (allows various formats with optional country code)
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid
   */
  export const isValidUrl = (url) => {
    if (isEmpty(url)) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Validate a date is in the future
   * @param {Date|string} date - Date to validate
   * @returns {boolean} True if future date
   */
  export const isFutureDate = (date) => {
    if (isEmpty(date)) return false;
    const now = new Date();
    const compareDate = date instanceof Date ? date : new Date(date);
    return compareDate > now;
  };
  
  /**
   * Validate a date is in the past
   * @param {Date|string} date - Date to validate
   * @returns {boolean} True if past date
   */
  export const isPastDate = (date) => {
    if (isEmpty(date)) return false;
    const now = new Date();
    const compareDate = date instanceof Date ? date : new Date(date);
    return compareDate < now;
  };
  
  /**
   * Validate minimum age
   * @param {Date|string} birthDate - Birth date to validate
   * @param {number} minAge - Minimum age required
   * @returns {boolean} True if age is at least minAge
   */
  export const isMinimumAge = (birthDate, minAge = 18) => {
    if (isEmpty(birthDate)) return false;
    const today = new Date();
    const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= minAge;
  };
  
  /**
   * Validate if value is numeric
   * @param {*} value - Value to check
   * @returns {boolean} True if numeric
   */
  export const isNumeric = (value) => {
    if (isEmpty(value)) return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  /**
   * Validate if value is an integer
   * @param {*} value - Value to check
   * @returns {boolean} True if integer
   */
  export const isInteger = (value) => {
    if (isEmpty(value)) return false;
    return Number.isInteger(Number(value));
  };
  
  /**
   * Validate value is within range
   * @param {number} value - Value to check
   * @param {number} min - Minimum allowed
   * @param {number} max - Maximum allowed
   * @returns {boolean} True if within range
   */
  export const isInRange = (value, min, max) => {
    if (!isNumeric(value)) return false;
    const num = Number(value);
    return num >= min && num <= max;
  };
  
  /**
   * Validate value is at least minimum length
   * @param {string|Array} value - Value to check
   * @param {number} length - Minimum length
   * @returns {boolean} True if at least minimum length
   */
  export const hasMinLength = (value, length = 1) => {
    if (isEmpty(value)) return false;
    return value.length >= length;
  };
  
  /**
   * Validate value does not exceed maximum length
   * @param {string|Array} value - Value to check
   * @param {number} length - Maximum length
   * @returns {boolean} True if not exceeding maximum length
   */
  export const hasMaxLength = (value, length = 255) => {
    if (isEmpty(value)) return true; // Empty is technically under max length
    return value.length <= length;
  };
  
  /**
   * Validate value contains only letters (and optional spaces)
   * @param {string} value - Value to check
   * @param {boolean} allowSpaces - Whether to allow spaces
   * @returns {boolean} True if contains only letters
   */
  export const isAlpha = (value, allowSpaces = false) => {
    if (isEmpty(value)) return false;
    return allowSpaces ? 
      /^[A-Za-z\s]+$/.test(value) : 
      /^[A-Za-z]+$/.test(value);
  };
  
  /**
   * Validate value contains only letters and numbers
   * @param {string} value - Value to check
   * @returns {boolean} True if contains only letters and numbers
   */
  export const isAlphanumeric = (value) => {
    if (isEmpty(value)) return false;
    return /^[A-Za-z0-9]+$/.test(value);
  };
  
  /**
   * Validate a credit card number using Luhn algorithm
   * @param {string} cardNumber - Card number to validate
   * @returns {boolean} True if valid card number format
   */
  export const isValidCreditCard = (cardNumber) => {
    if (isEmpty(cardNumber)) return false;
    
    // Remove non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) return false;
    
    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  /**
   * Validate a zipcode/postal code format (simple US format)
   * @param {string} zipcode - Zipcode to validate
   * @returns {boolean} True if valid format
   */
  export const isValidZipcode = (zipcode) => {
    if (isEmpty(zipcode)) return false;
    // Basic US zipcode (5 digits or 5+4)
    return /^\d{5}(-\d{4})?$/.test(zipcode);
  };
  
  /**
   * Validate file size is within limit
   * @param {number} fileSize - File size in bytes
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean} True if file size is within limit
   */
  export const isValidFileSize = (fileSize, maxSize = 5 * 1024 * 1024) => { // Default 5MB
    if (isEmpty(fileSize)) return false;
    return fileSize <= maxSize;
  };
  
  /**
   * Validate file type against allowed types
   * @param {string} fileName - File name or extension
   * @param {Array} allowedTypes - Array of allowed extensions or mime types
   * @returns {boolean} True if file type is allowed
   */
  export const isValidFileType = (fileName, allowedTypes = []) => {
    if (isEmpty(fileName) || !Array.isArray(allowedTypes) || allowedTypes.length === 0) return false;
    
    const ext = fileName.split('.').pop().toLowerCase();
    return allowedTypes.includes(ext) || allowedTypes.some(type => fileName.endsWith(type));
  };
  
  /**
   * Validate if a string contains another string
   * @param {string} str - String to check
   * @param {string} substring - Substring to find
   * @param {boolean} caseSensitive - Whether check is case sensitive
   * @returns {boolean} True if string contains substring
   */
  export const containsString = (str, substring, caseSensitive = false) => {
    if (isEmpty(str) || isEmpty(substring)) return false;
    
    if (!caseSensitive) {
      return str.toLowerCase().includes(substring.toLowerCase());
    }
    
    return str.includes(substring);
  };
  
  /**
   * Validate form data against schema
   * @param {Object} data - Form data to validate
   * @param {Object} schema - Validation schema with field rules
   * @returns {Object} Object with isValid flag and errors object
   */
  export const validateForm = (data, schema) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(schema).forEach(field => {
      const value = data[field];
      const fieldRules = schema[field];
      
      if (fieldRules.required && isEmpty(value)) {
        errors[field] = fieldRules.requiredMessage || 'This field is required';
        isValid = false;
      } else if (!isEmpty(value)) {
        // Check each validation rule
        if (fieldRules.email && !isValidEmail(value)) {
          errors[field] = fieldRules.emailMessage || 'Invalid email format';
          isValid = false;
        } else if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
          errors[field] = fieldRules.minLengthMessage || `Minimum length is ${fieldRules.minLength}`;
          isValid = false;
        } else if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
          errors[field] = fieldRules.maxLengthMessage || `Maximum length is ${fieldRules.maxLength}`;
          isValid = false;
        } else if (fieldRules.pattern && !new RegExp(fieldRules.pattern).test(value)) {
          errors[field] = fieldRules.patternMessage || 'Invalid format';
          isValid = false;
        } else if (fieldRules.custom && typeof fieldRules.custom === 'function') {
          const customResult = fieldRules.custom(value, data);
          if (customResult !== true) {
            errors[field] = customResult || 'Invalid value';
            isValid = false;
          }
        }
      }
    });
    
    return { isValid, errors };
  };
  
  export default {
    isEmpty,
    isValidEmail,
    isStrongPassword,
    passwordsMatch,
    isValidPhone,
    isValidUrl,
    isFutureDate,
    isPastDate,
    isMinimumAge,
    isNumeric,
    isInteger,
    isInRange,
    hasMinLength,
    hasMaxLength,
    isAlpha,
    isAlphanumeric,
    isValidCreditCard,
    isValidZipcode,
    isValidFileSize,
    isValidFileType,
    containsString,
    validateForm
  };