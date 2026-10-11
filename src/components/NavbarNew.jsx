import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function NavbarNew({ setActiveTab }) {
  const [cartCount, setCartCount] = useState(0);
  const [activeTabState, setActiveTabState] = useState('home');

  useEffect(() => {
    fetchCartCount();
    // Refresh cart count every 5 seconds
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      const { data } = await axios.get(`${API_URL}/cart/count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartCount(data.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTabState(tab);
    setActiveTab(tab);
    if (tab === 'cart') {
      fetchCartCount(); // Refresh count when cart is opened
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleTabChange('home')}>
        ⚡ ANUJ PAL ELECTRICIAN
      </div>
      <div className="nav-links">
        <button onClick={() => handleTabChange('home')}>🏠 Home</button>
        <button onClick={() => handleTabChange('services')}>🔧 Services</button>
        <button onClick={() => handleTabChange('book-repair')}>📋 Book Repair</button>
        <button onClick={() => handleTabChange('track-booking')}>📍 Track Booking</button>
        <button onClick={() => handleTabChange('products')}>🛒 Products</button>
        <button onClick={() => handleTabChange('recharge')}>📱 Recharge</button>
        <button onClick={() => handleTabChange('offers')}>🎉 Offers</button>
        <button onClick={() => handleTabChange('admin')}>👑 Admin</button>
        <div className="cart-icon" onClick={() => handleTabChange('cart')}>
          🛒 <span className="cart-count">{cartCount}</span>
        </div>
      </div>
    </nav>
  );
}

export default NavbarNew;
