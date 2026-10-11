import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../api/services';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check token validity on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getProfile();
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data,
              token,
            },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({
            type: AUTH_FAILURE,
            payload: 'Session expired. Please login again.',
          });
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await authService.register(userData);
      
      const payload = response.data;
      const user = { ...payload, token: undefined };
      delete user.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token: payload.token },
      });
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      return { success: false, message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await authService.login(credentials);
      
      const payload = response.data;
      const user = { ...payload, token: undefined };
      delete user.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token: payload.token },
      });
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data,
          token: state.token,
        },
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
