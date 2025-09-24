import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const AdminSearch = ({ onSearch, onFilter, filters, loading, type }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, filters.search]);

  const getFilterOptions = () => {
    switch (type) {
      case 'products':
        return [
          { value: '', label: 'All Categories' },
          { value: 'men', label: 'Men' },
          { value: 'women', label: 'Women' },
          { value: 'shoes', label: 'Shoes' },
          { value: 'unisex', label: 'Unisex' }
        ];
      case 'orders':
        return [
          { value: '', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' }
        ];
      case 'users':
        return [
          { value: '', label: 'All Roles' },
          { value: 'user', label: 'Users' },
          { value: 'admin', label: 'Admins' }
        ];
      default:
        return [];
    }
  };

  const filterOptions = getFilterOptions();
  const filterKey = type === 'products' ? 'category' : type === 'orders' ? 'status' : 'role';
  const currentFilter = filters[filterKey] || '';

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        {filterOptions.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={currentFilter}
              onChange={(e) => onFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.search || currentFilter) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Search: "{filters.search}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {filterOptions.find(o => o.value === currentFilter)?.label}
              <button
                onClick={() => onFilter('')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearch;