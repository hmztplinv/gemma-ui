import React, { createContext, useReducer, useEffect } from 'react';
import AuthApi from '../api/authApi';

// Context oluşturma
export const AuthContext = createContext();

// İlk durum
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Actions
const LOGIN_START = 'LOGIN_START';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const REGISTER_START = 'REGISTER_START';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_START:
    case REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        dispatch({ type: LOGOUT });
      }
    };
    
    checkUserStatus();
  }, []);

  // Giriş
  const login = async (credentials) => {
    dispatch({ type: LOGIN_START });
    
    try {
      const userData = await AuthApi.login(credentials);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({ type: LOGIN_SUCCESS, payload: userData });
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data || 'Failed to login. Please try again.';
      dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
      throw error;
    }
  };

  // Kayıt
  const register = async (user) => {
    dispatch({ type: REGISTER_START });
    
    try {
      const userData = await AuthApi.register(user);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({ type: REGISTER_SUCCESS, payload: userData });
      return userData;
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data || 'Failed to register. Please try again.';
      dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
      throw error;
    }
  };

  // Çıkış
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
  };

  // Hata temizleme
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Context kullanımı için özel hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};