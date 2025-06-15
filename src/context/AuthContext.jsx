import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context once
const AuthContext = createContext();

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (!isTokenExpired(userData.token)) {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login function
  const login = useCallback((userData) => {
    console.log('AuthContext: Logging in user:', userData);
    setUser(userData);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log('AuthContext: Logging out user');
    setUser(null);
  }, []);

  // Dispatch function for components that expect reducer pattern
  const dispatch = useCallback((action) => {
    console.log('AuthContext: Dispatching action:', action);
    
    switch (action.type) {
      case 'LOGIN_START':
        setLoading(true);
        break;
        
      case 'LOGIN_SUCCESS':
        setLoading(false);
        login(action.payload);
        break;
        
      case 'LOGIN_FAILURE':
        setLoading(false);
        setUser(null);
        break;
        
      case 'LOGOUT':
        logout();
        break;
        
      case 'REGISTER_START':
        setLoading(true);
        break;
        
      case 'REGISTER_SUCCESS':
        setLoading(false);
        login(action.payload);
        break;
        
      case 'REGISTER_FAILURE':
        setLoading(false);
        break;
        
      default:
        console.warn('Unknown action type:', action.type);
    }
  }, [login, logout]);

  // Get valid token function
  const getValidToken = useCallback(() => {
    if (!user?.token || isTokenExpired(user.token)) {
      logout();
      return null;
    }
    return user.token;
  }, [user?.token, logout]);

  // Context value
  const contextValue = {
    user,
    login,
    logout,
    loading,
    dispatch,
    isLoggedIn: !!user,
    getValidToken,
    // Legacy support
    hasUser: !!user,
    username: user?.username,
    userId: user?.userId || user?._id,
    token: user?.token,
    role: user?.role
  };

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('AuthContext: Current state:', {
      hasUser: !!user,
      loading,
      userId: user?._id,
      username: user?.username
    });
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export the context itself
export { AuthContext };

// Backward compatibility export
export const AuthContextProvider = AuthProvider;