// SearchBar.jsx - Reusable search component with various options
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * SearchBar component with debounce and optional filters
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  debounceTime = 300,
  variant = 'default',
  size = 'md',
  filters = [],
  selectedFilter = '',
  onFilterChange,
  clearable = true,
  autoFocus = false,
  className = '',
  disabled = false,
  searchIcon = true,
  ...props
}) => {
  // Local state for controlled input
  const [searchTerm, setSearchTerm] = useState(value);
  const [localFilter, setLocalFilter] = useState(selectedFilter);
  
  // Ref for debounce timeout
  const debounceTimeout = useRef(null);
  
  // Input ref for autoFocus
  const inputRef = useRef(null);
  
  // Handle input changes with debounce
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Call onChange immediately if provided
    if (onChange) {
      onChange(newValue);
    }
    
    // Debounce the search callback
    if (onSearch) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        onSearch(newValue, localFilter);
      }, debounceTime);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setLocalFilter(newFilter);
    
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
    
    // Trigger search with new filter
    if (onSearch && searchTerm) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        onSearch(searchTerm, newFilter);
      }, debounceTime);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, localFilter);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    
    if (onChange) {
      onChange('');
    }
    
    if (onSearch) {
      onSearch('', localFilter);
    }
    
    // Focus input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Sync with external value
  useEffect(() => {
    if (value !== undefined && value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);
  
  // Sync with external filter
  useEffect(() => {
    if (selectedFilter !== undefined && selectedFilter !== localFilter) {
      setLocalFilter(selectedFilter);
    }
  }, [selectedFilter]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  
  // Apply autofocus if needed
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500',
    primary: 'bg-blue-50 border-blue-300 focus-within:border-blue-500 focus-within:ring-blue-500',
    dark: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus-within:border-blue-500 focus-within:ring-blue-500'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg'
  };
  
  return (
    <form 
      className={`relative flex items-center w-full ${className}`}
      onSubmit={handleSubmit}
      role="search"
      {...props}
    >
      {/* Search icon */}
      {searchIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}
      
      {/* Main input */}
      <input
        ref={inputRef}
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        className={`
          block w-full rounded-l-md border outline-none focus:ring-2 focus:ring-opacity-50
          ${searchIcon ? 'pl-10' : 'pl-3'} pr-3
          ${variantClasses[variant] || variantClasses.default}
          ${sizeClasses[size] || sizeClasses.md}
          ${filters.length > 0 ? 'rounded-r-none' : 'rounded-r-md'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        placeholder={placeholder}
        disabled={disabled}
      />
      
      {/* Filters dropdown */}
      {filters.length > 0 && (
        <select
          value={localFilter}
          onChange={handleFilterChange}
          className={`
            border border-l-0 outline-none focus:ring-2 focus:ring-opacity-50
            ${variantClasses[variant] || variantClasses.default}
            ${sizeClasses[size] || sizeClasses.md}
            ${clearable || searchTerm.length === 0 ? 'rounded-r-md' : 'rounded-r-none'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          disabled={disabled}
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
      
      {/* Clear button */}
      {clearable && searchTerm.length > 0 && (
        <button
          type="button"
          onClick={clearSearch}
          className={`
            absolute inset-y-0 right-0 flex items-center pr-3
            ${filters.length > 0 ? 'hidden' : ''}
            ${disabled ? 'hidden' : ''}
          `}
          aria-label="Clear search"
        >
          <svg 
            className="w-5 h-5 text-gray-500 hover:text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  debounceTime: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'primary', 'dark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  selectedFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
  clearable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  searchIcon: PropTypes.bool
};

export default SearchBar;