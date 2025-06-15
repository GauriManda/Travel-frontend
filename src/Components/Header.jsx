import React, { useContext, useMemo, useCallback } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  // Add error handling for context
  if (!context) {
    console.error('Header component must be used within AuthContext.Provider');
    return <div>Loading...</div>;
  }

  const { user, logout } = context;

  // Add error handling for logout function
  if (!logout) {
    console.error('logout function is not available in AuthContext');
    return <div>Authentication Error</div>;
  }

  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    try {
      logout(); // Use the logout function from context
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  // Memoize username calculation
  const username = useMemo(() => {
    return user?.username || user?.email?.split('@')[0] || "User";
  }, [user?.username, user?.email]);

  // Only log user changes in development, not on every render
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Header - User state changed:", {
        isLoggedIn: !!user,
        username: user?.username,
        userId: user?._id,
        hasLogout: typeof logout === 'function'
      });
    }
  }, [user?._id, user?.username, logout]); // Add logout to dependencies

  return (
    <div className="header-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-text">
            <span className="brand-travel">TRAVEL</span>
            <span className="brand-world">WORLD</span>
            <span className="brand-icon">✈️</span>
          </span>
          <span className="brand-tagline">Explore the unexplored</span>
        </div>
        
        <div className="navbar-menu">
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
            <NavLink to="/tours" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Tours</NavLink>
          </div>
          
          <div className="auth-links">
            {user ? (
              <div className="user-section">
                <span className="username">Hello, {username}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-link">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;