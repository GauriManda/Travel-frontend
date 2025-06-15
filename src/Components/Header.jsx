import React, { useContext, useMemo, useCallback } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate('/');
  }, [dispatch, navigate]);

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
        userId: user?._id
      });
    }
  }, [user?._id, user?.username]); // Only log when actual user data changes

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