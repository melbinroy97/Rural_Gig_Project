import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      // Don't set error if it's just a 401 (guest user)
      if (err.response?.status !== 401) {
        dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.message || 'Error loading user' });
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null });
      }
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return true;
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.message || 'Login failed' });
      return false;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.post('/auth/register', userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return true;
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.message || 'Registration failed' });
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch({ type: 'LOGOUT' });
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
