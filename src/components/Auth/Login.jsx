import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = ({ onSuccess, onRegister, adminOnly = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [roleError, setRoleError] = useState('');
  const { login, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData);
    
    if (result.success) {
      const signedInUser = result.user || {};
      if (adminOnly && signedInUser.role !== 'admin') {
        setRoleError('This account is not authorized for the admin panel.');
      } else onSuccess?.();
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <section className="auth-welcome"><div className="auth-icon">⚡</div><h1>Welcome back.</h1><p>Sign in to manage your orders, bookings, saved products, and account details.</p><div className="auth-points"><span>✓ View your order history</span><span>✓ Track service bookings</span><span>✓ Fast, secure account access</span></div></section>
      <div className="auth-form">
        <p className="eyebrow">Electrical Shop</p><h2>{adminOnly ? 'Admin sign in' : 'Login to your account'}</h2><p className="auth-subtitle">{adminOnly ? 'Use your administrator email and password.' : 'Enter your details to continue.'}</p>
        {error && <div className="error-message">{error}</div>}
        {roleError && <div className="error-message">{roleError}</div>}
        
        <form onSubmit={handleSubmit}>
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
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <button type="button" className="auth-link-button" onClick={onRegister}>Register here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
