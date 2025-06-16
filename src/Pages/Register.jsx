import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./Register.css";
const BASE_URL = import.meta.env.VITE_API_URL; 



const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing again
    setError(null);
    setServerError(null);
  };

  const validateForm = () => {
    // Reset errors
    setError(null);
    
    // Validate username
    if (!formData.username || formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate password
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      dispatch({ type: 'REGISTER_START' });
      
      console.log('Submitting registration to:', `${BASE_URL}/auth/register`);
      console.log('Registration data:', { ...formData, confirmPassword: undefined });
      
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration failed:', data);
        
        // Check for duplicate key error
        if (data.error && data.error.includes('duplicate key error')) {
          if (data.error.includes('username')) {
            throw new Error('Username "' + formData.username + '" is already registered. Try logging in instead.');
          } else if (data.error.includes('email')) {
            throw new Error('Email is already registered. Try logging in instead.');
          } else {
            throw new Error('This account already exists. Please try logging in.');
          }
        }
        
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log('Registration successful:', data);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
      
      // Redirect to login with a success message
navigate('/login', {
  state: {
    successMessage: 'Account created successfully. Please log in.'
  }
});

    } catch (err) {
      console.error('Registration error:', err);
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: err.message || 'Something went wrong during registration' 
      });
      setServerError(err.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      
      {/* Display validation errors */}
      {error && <div className="error-alert">{error}</div>}
      
      {serverError && (
        <div className="error-alert">
          {serverError}
          {serverError.includes('already registered') && (
            <div className="login-suggestion">
              <Link to="/login">Go to Login</Link>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="form-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;