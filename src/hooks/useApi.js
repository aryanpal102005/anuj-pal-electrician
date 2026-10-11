import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Custom hook for pagination
export const usePagination = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [params, setParams] = useState(initialParams);

  const fetch = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...params, ...newParams };
      const result = await fetchFunction(mergedParams);
      
      setData(result.data || []);
      setPagination(result.pagination || {});
      setParams(mergedParams);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, []);

  const loadPage = useCallback((page) => {
    fetch({ page });
  }, [fetch]);

  const refresh = useCallback(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    loadPage,
    refresh,
    fetch,
  };
};
