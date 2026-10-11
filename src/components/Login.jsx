import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        alert('✅ Login successful!');
        if (onLoginSuccess) onLoginSuccess();
        if (onClose) onClose();
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@electrician.com',
      password: 'admin123'
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>🔐 Admin Login</h2>
          {onClose && (
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          )}
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Logging in...' : '✅ Login'}
          </button>

          <button type="button" onClick={fillAdminCredentials} style={styles.demoBtn}>
            🔑 Use Admin Credentials
          </button>

          <div style={styles.info}>
            <p><strong>Admin Credentials:</strong></p>
            <p>Email: admin@electrician.com</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#718096',
  },
  error: {
    margin: '1rem 1.5rem',
    padding: '0.75rem',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  form: {
    padding: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  demoBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  info: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
};

export default Login;
