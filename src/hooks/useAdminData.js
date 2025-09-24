import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useAdminData = (dataType, initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 20,
    ...initialFilters
  });

  const fetchData = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = { ...filters, ...newFilters };
      const queryParams = new URLSearchParams();
      
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const endpoint = `/admin/${dataType}?${queryParams.toString()}`;
      const response = await apiService.request(endpoint);
      
      // Handle both paginated and non-paginated responses
      if (response.pagination) {
        if (newFilters.page === 1 || !newFilters.page) {
          // Replace data for new search or first page
          setData(response[dataType] || response.products || response.orders || response.users || []);
        } else {
          // Append data for pagination (load more)
          setData(prev => [...prev, ...(response[dataType] || response.products || response.orders || response.users || [])]);
        }
        setPagination(response.pagination);
      } else {
        // Non-paginated response (fallback)
        setData(response);
        setPagination({
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      }
      
      setFilters(queryFilters);
    } catch (err) {
      console.error(`Error fetching ${dataType}:`, err);
      setError(`Failed to load ${dataType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [dataType, filters]);

  const loadMore = useCallback(() => {
    if (pagination.hasNext && !loading) {
      fetchData({ page: pagination.page + 1 });
    }
  }, [pagination.hasNext, pagination.page, loading, fetchData]);

  const search = useCallback((searchTerm) => {
    fetchData({ search: searchTerm, page: 1 });
  }, [fetchData]);

  const filterByCategory = useCallback((category) => {
    fetchData({ category, page: 1 });
  }, [fetchData]);

  const filterByStatus = useCallback((status) => {
    fetchData({ status, page: 1 });
  }, [fetchData]);

  const reset = useCallback(() => {
    fetchData({ search: '', category: '', status: '', page: 1 });
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData({ page: 1 });
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, []); // Only run on mount

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    loadMore,
    search,
    filterByCategory,
    filterByStatus,
    reset,
    refetch
  };
};