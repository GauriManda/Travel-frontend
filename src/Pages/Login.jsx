import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const BASE_URL = 'http://localhost:4000/api/v1';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 for success message
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

  // Get optional success message from redirect (e.g. after register)
  const successMessage = location.state?.successMessage || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      setServerError('Please enter both username/email and password');
      return;
    }

    try {
      setLoading(true);
      dispatch({ type: 'LOGIN_START' });

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage;
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'Invalid username/email or password';
        } else if (response.status === 404) {
          errorMessage = 'User not found. Please check your credentials or register';
        } else {
          errorMessage = data.message || 'Login failed';
        }
        throw new Error(errorMessage);
      }

      const userFromServer = data.data || {};

      const userData = {
        token: data.token,
        username: userFromServer.username || data.username,
        userId: userFromServer._id || data.userId || data.id,
        role: data.role || userFromServer.role
      };

      if (!userData.username || !userData.userId) {
        throw new Error('Invalid response from server. Missing user data.');
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });

      const redirectPath = userData.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath);

    } catch (err) {
      console.error('Login error:', err);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: err.message || 'Something went wrong during login'
      });
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

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
          {serverError.includes('register') && (
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
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
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
