import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const BASE_URL = 'http://localhost:4000/api/v1';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(AuthContext);
  
  // Form state
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Get optional success message from redirect
  const successMessage = location.state?.successMessage || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setServerError('Please enter both username/email and password');
      return;
    }

    try {
      setLoading(true);
      dispatch({ type: 'LOGIN_START' });

      console.log('Attempting login with:', { 
        identifier: formData.identifier,
        url: `${BASE_URL}/auth/login`
      });

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password
        }),
        credentials: 'include'
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        let errorMessage;
        
        switch (response.status) {
          case 400:
            errorMessage = data.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Invalid credentials. Please check your username/email and password.';
            break;
          case 403:
            errorMessage = 'Access denied. Please verify your account.';
            break;
          case 404:
            errorMessage = 'User not found. Please check your credentials or create an account.';
            break;
          case 422:
            errorMessage = data.message || 'Validation error. Please check your input.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data.message || `Login failed (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      // Handle different possible response structures
      let userData;
      
      if (data.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      // Extract user data from various possible response structures
      const token = data.token;
userData = {
  token,
  username: data.username || data.data?.username,
  userId: data.userId || data.data?._id, // This is the main fix
  role: data.role || data.data?.role || 'user',
  email: data.email || data.data?.email
};

      console.log('Processed user data:', userData);

      // Validate essential data
      if (!userData.username && !userData.email) {
        throw new Error('Invalid response: Missing username or email');
      }

      if (!userData.userId) {
        throw new Error('Invalid response: Missing user ID');
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });

      // Store token for future requests
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData));

      console.log('Login successful, redirecting...');
      
      const redirectPath = userData.role === 'admin' ? '/admin/home' : '/home';
      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.message || 'Something went wrong during login';
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Clear success message after a delay
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        // Clear the success message from location state
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, location.pathname]);

  return (
    <div className="login-container">
      <h2>Log In to Your Account</h2>

      {successMessage && (
        <div className="success-alert">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="error-alert">
          {serverError}
          {(serverError.includes('not found') || serverError.includes('create an account')) && (
            <div className="register-suggestion">
              <Link to="/register">Create Account</Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Enter your username or email"
          />
        </div>

        <div className="form-group password-input-container">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="form-footer">
        Don't have an account yet? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;