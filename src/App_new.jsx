import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Import components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar cartCount={cartCount} />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <div className="dashboard">
                      <h1>Dashboard</h1>
                      <p>Welcome to your dashboard!</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <div className="cart-page">
                      <h1>Shopping Cart</h1>
                      <p>Your cart items will appear here.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <div className="orders-page">
                      <h1>My Orders</h1>
                      <p>Your order history will appear here.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/recharge" 
                element={
                  <ProtectedRoute>
                    <div className="recharge-page">
                      <h1>Wallet Recharge</h1>
                      <p>Recharge your wallet here.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <div className="admin-dashboard">
                      <h1>Admin Dashboard</h1>
                      <p>Admin management panel.</p>
                    </div>
                  </AdminRoute>
                } 
              />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/products" />} />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="not-found">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
