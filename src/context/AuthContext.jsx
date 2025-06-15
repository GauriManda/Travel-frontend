import React, { createContext, useReducer, useEffect, useContext } from 'react';

const initialState = {
  hasUser: false,
  username: null,
  userId: null,
  token: null,
  role: null,
  loading: false,
  error: null,
};

// Create the context
const AuthContext = createContext(initialState);

// Reducer function to manage state changes
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        hasUser: true,
        username: action.payload.username,
        userId: action.payload.userId,
        token: action.payload.token,
        role: action.payload.role,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        hasUser: false,
        username: null,
        userId: null,
        token: null,
        role: null,
        loading: false,
        error: action.payload,
      };
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        hasUser: true,
        username: action.payload.username,
        userId: action.payload.userId,
        token: action.payload.token,
        role: action.payload.role,
        loading: false,
        error: null,
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        hasUser: false,
        username: null,
        userId: null,
        token: null,
        role: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        hasUser: false,
        username: null,
        userId: null,
        token: null,
        role: null,
        loading: false,
        error: null,
      };
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context provider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user data from localStorage on app start
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.username && userData.userId) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            username: userData.username,
            userId: userData.userId,
            token: userData.token,
            role: userData.role,
          },
        });
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      localStorage.removeItem('user'); // Clear corrupted data
    }
  }, []);

  // Save user to localStorage when state changes
  useEffect(() => {
    if (state.hasUser && state.username && state.userId) {
      const userData = {
        username: state.username,
        userId: state.userId,
        token: state.token,
        role: state.role,
      };
      localStorage.setItem('user', JSON.stringify(userData));
    } else if (!state.hasUser) {
      localStorage.removeItem('user');
    }
  }, [state.hasUser, state.username, state.userId, state.token, state.role]);

  // Create user object for compatibility with components that expect a user object
  const user = state.hasUser ? {
    username: state.username,
    userId: state.userId,
    _id: state.userId, // Add _id alias for compatibility
    email: state.username, // Assuming username might be email
    token: state.token,
    role: state.role
  } : null;

  // Provide both individual properties AND user object for maximum compatibility
  const contextValue = {
    // Individual properties (for direct destructuring)
    hasUser: state.hasUser,
    username: state.username,
    userId: state.userId,
    token: state.token,
    role: state.role,
    loading: state.loading,
    error: state.error,
    
    // User object (for components that expect it)
    user,
    
    // Actions
    dispatch,
    
    // Helper methods
    isLoggedIn: state.hasUser,
    isLoading: state.loading,
    
    // For backward compatibility with simple setUser pattern
    setUser: (userData) => {
      if (userData) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: userData
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

// Export AuthContext for direct useContext usage
export { AuthContext };