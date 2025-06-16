import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!context) {
    console.error('Header component must be used within AuthContext.Provider');
    return <div>Loading...</div>;
  }

  const { user, logout } = context;

  if (!logout) {
    console.error('logout function is not available in AuthContext');
    return <div>Authentication Error</div>;
  }

  const handleLogout = useCallback(() => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const username = useMemo(() => {
    return user?.username || user?.email?.split('@')[0] || 'User';
  }, [user?.username, user?.email]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header - User state changed:', {
        isLoggedIn: !!user,
        username: user?.username,
        userId: user?._id,
        hasLogout: typeof logout === 'function',
      });
    }
  }, [user?._id, user?.username, logout]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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

        {/* Hamburger Icon */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="navbar-menu-overlay show"
            onClick={closeMenu}
          ></div>
        )}

        {/* Sidebar Menu */}
        <div className={`navbar-menu ${menuOpen ? 'show' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/tours"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              onClick={closeMenu}
            >
              Tours
            </NavLink>
          </div>

          <div className="auth-links">
            {user ? (
              <div className="user-section">
                <span className="username">Hello, {username}</span>
                <button className="logout-btn" onClick={() => { handleLogout(); closeMenu(); }}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-link" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="register-btn" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
