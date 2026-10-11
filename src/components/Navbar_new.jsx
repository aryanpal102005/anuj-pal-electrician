import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ cartCount = 0 }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          ⚡ Electrician Shop
        </Link>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/products" 
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            Products
          </Link>
          
          {isAuthenticated && (
            <>
              <Link 
                to="/cart" 
                className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
              >
                Cart ({cartCount})
              </Link>
              
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
              >
                Orders
              </Link>
              
              <Link 
                to="/recharge" 
                className={`nav-link ${isActive('/recharge') ? 'active' : ''}`}
              >
                Wallet
              </Link>
              
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link admin-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
