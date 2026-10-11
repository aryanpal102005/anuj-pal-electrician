import React, { useState } from 'react';
import MyAccount from './MyAccount';
import { useAuth } from '../context/AuthContext';

function Navbar({ activeTab, cartCount, wishlistCount, onNavigate, orders = [], bookings = [] }) {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const submitSearch = (event) => {
    event.preventDefault();
    onNavigate('products', { search });
  };

  return (
    <header className="site-header">
      <div className="header-main page-width">
        <button className="brand" onClick={() => onNavigate('home')} aria-label="Go to home">
          <span className="brand-mark">⚡</span>
          <span><strong>Electrical</strong> Shop<small>ANUJ PAL ELECTRICIAN</small></span>
        </button>

        <form className="site-search" onSubmit={submitSearch}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search wires, lights, fans and more"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <div className="header-actions">
          {!isAuthenticated ? (
            <>
              <button className="text-action" onClick={() => onNavigate('login')}>Login</button>
              <button className="outline-action" onClick={() => onNavigate('register')}>Register</button>
            </>
          ) : (
            <MyAccount onNavigate={onNavigate} orders={orders} bookings={bookings} />
          )}
          <button className="wishlist-action" onClick={() => onNavigate('wishlist')}>Wishlist <span>{wishlistCount}</span></button>
          <button className="cart-action" onClick={() => onNavigate('cart')}>
            Cart <span>{cartCount}</span>
          </button>
        </div>
      </div>
      <nav className="primary-nav">
        <div className="page-width">
          {[
            ['home', 'Home'], 
            ['products', 'Products'], 
            ['services', 'Book a Service'],
            ['my-bookings', 'My Bookings'],
            ['offers', 'Offers'], 
            ['blog', 'Tips'], 
            ['faq', 'FAQ'], 
            ['about', 'About Us'], 
            ['contact', 'Contact'], 
            ['dashboard', 'My Account'], 
            ['admin-login', 'Admin']
          ].map(([tab, label]) => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => onNavigate(tab)}>{label}</button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
