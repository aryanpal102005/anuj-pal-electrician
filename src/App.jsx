import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsPage from './components/ProductsPage';
import ServicesPage from './components/ServicesPage';
import MyBookings from './components/MyBookings';
import Cart from './components/Cart';
import OfferBanner from './components/OfferBanner';
import Footer from './components/Footer';
import GoogleMap from './components/GoogleMap';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import TrackOrder from './components/TrackOrder';
import CustomerDashboard from './components/CustomerDashboard';
import Wishlist from './components/Wishlist';
import { AboutPage, BlogPage, ContactPage, FaqPage, PrivacyPage } from './components/InfoPages';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const categories = [
  ['🔌', 'Wires & Cables', 'wiring-cable'], ['🔘', 'Switches', 'switches-boards'], ['🌀', 'Fans', 'fans-cooling'], ['💡', 'Lights', 'lighting'],
  ['⚡', 'MCB & Safety', 'protection'], ['🧰', 'Tools', 'tools-equipment'], ['🔋', 'Accessories', 'house-fitting']
];

function HomePage({ onNavigate }) {
  return <>
    <HeroSection onShop={() => onNavigate('products')} onService={() => onNavigate('services')} />
    <section className="page-width section-block">
      <div className="section-heading"><div><p className="eyebrow">Browse the shop</p><h2>Shop by category</h2></div><button className="link-button" onClick={() => onNavigate('products')}>View all products →</button></div>
      <div className="category-grid">
        {categories.map(([icon, name, category]) => <button key={name} className="category-card" onClick={() => onNavigate('products', { category })}><span>{icon}</span><b>{name}</b><small>Explore products</small></button>)}
      </div>
    </section>
    <section className="feature-band"><div className="page-width"><div><span>🚚</span><b>Reliable delivery</b><small>Carefully packed orders</small></div><div><span>🛡️</span><b>Quality assured</b><small>Trusted electrical brands</small></div><div><span>🔧</span><b>Need installation?</b><small>Book an electrician visit</small></div><div><span>💬</span><b>Friendly support</b><small>Help when you need it</small></div></div></section>
  </>;
}

function SimplePage({ title, text, action, actionLabel }) {
  return <section className="page-width simple-page"><p className="eyebrow">Electrical Shop</p><h1>{title}</h1><p>{text}</p>{action && <button className="button button-primary" onClick={action}>{actionLabel}</button>}</section>;
}

function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('electrician-shop-wishlist') || '[]'));
  const [shopFilters, setShopFilters] = useState({ category: 'all', search: '' });
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [repairRequests, setRepairRequests] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const navigate = (tab, filters = {}) => { if (tab === 'products') setShopFilters({ category: filters.category || 'all', search: filters.search || '' }); setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  
  const addToCart = (product, quantity = 1) => setCart((items) => {
    const id = product._id || product.id;
    const found = items.find((item) => item.id === id);
    if (found) return items.map((item) => item.id === id ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) } : item);
    return [...items, { id, name: product.name, price: product.price, stock: product.stock, quantity, image: product.images?.[0] }];
  });
  
  useEffect(() => { localStorage.setItem('electrician-shop-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  
  const toggleWishlist = (product) => setWishlist((items) => items.some((item) => (item._id || item.id) === (product._id || product.id)) ? items.filter((item) => (item._id || item.id) !== (product._id || product.id)) : [...items, product]);
  
  const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id));
  
  const updateQuantity = (id, quantity) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.min(item.stock, quantity) } : item));
  
  const beginCheckout = (summary) => { setCheckoutSummary(summary); navigate('checkout'); };
  
  const buyNow = (product, quantity = 1) => {
    const id = product._id || product.id;
    const existing = cart.find((item) => item.id === id);
    const updatedItem = { id, name: product.name, price: product.price, stock: product.stock, quantity: Math.min(product.stock, (existing?.quantity || 0) + quantity), image: product.images?.[0] };
    const nextCart = existing ? cart.map((item) => item.id === id ? updatedItem : item) : [...cart, updatedItem];
    const subtotal = nextCart.reduce((total, item) => total + item.price * item.quantity, 0);
    setCart(nextCart);
    beginCheckout({ subtotal, discount: 0, shipping: 0, total: subtotal });
  };
  
  const placeOrder = async ({ address, payment, summary }) => {
    let order;
    if (isAuthenticated) {
      try {
        const { data } = await axios.post(`${API_URL}/orders`, {
          orderItems: cart.map((item) => ({ product: item.id, quantity: item.quantity })),
          shippingAddress: { ...address, zipCode: address.pincode, country: 'India' },
          paymentMethod: payment === 'cash' ? 'cod' : payment
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const saved = data.data;
        order = { id: saved._id, address: saved.shippingAddress, payment, summary: { subtotal: saved.itemsPrice, discount: 0, shipping: saved.shippingPrice, total: saved.totalPrice }, items: saved.orderItems, createdAt: saved.createdAt };
      } catch (error) { throw new Error(error.response?.data?.message || 'Could not save the order.'); }
    } else order = { id: `ES-${Math.floor(100000 + Math.random() * 900000)}`, address, payment, summary, items: cart, createdAt: new Date().toISOString() };
    const itemLines = order.items.map((item) => `• ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`).join('\n');
    const paymentLabel = payment === 'cash' ? 'Cash on Delivery' : payment === 'upi' ? 'UPI' : 'QR Scan';
    const message = `*NEW PRODUCT ORDER*\n\n*Order ID:* ${order.id}\n*Customer:* ${order.address.name}\n*Phone:* ${order.address.phone}\n*Address:* ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipCode}\n\n*Items:*\n${itemLines}\n\n*Total:* ₹${order.summary.total}\n*Payment:* ${paymentLabel}`;
    window.open(`https://wa.me/919012675213?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    setOrders((items) => [order, ...items]); setLastOrder(order); setCart([]); navigate('order-success');
  };

  let content;
  if (activeTab === 'home') content = <HomePage onNavigate={navigate} />;
  else if (activeTab === 'products') content = <ProductsPage initialCategory={shopFilters.category} initialSearch={shopFilters.search} onAddToCart={addToCart} onBuyNow={buyNow} onToggleWishlist={toggleWishlist} wishlistIds={wishlist.map((item) => item._id || item.id)} />;
  else if (activeTab === 'services') content = <ServicesPage />;
  else if (activeTab === 'my-bookings') content = <MyBookings bookings={repairRequests} onNavigate={navigate} />;
  else if (activeTab === 'cart') content = <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} onCheckout={beginCheckout} onShop={() => navigate('products')} />;
  else if (activeTab === 'checkout') content = <Checkout cart={cart} summary={checkoutSummary || { subtotal: 0, discount: 0, shipping: 0, total: 0 }} onPlaceOrder={placeOrder} onBack={() => navigate('cart')} />;
  else if (activeTab === 'order-success') content = lastOrder ? <OrderSuccess order={lastOrder} onTrack={(id) => navigate('track-order', { id })} onShop={() => navigate('products')} /> : <SimplePage title="No recent order" text="Your order confirmation will appear here after checkout." action={() => navigate('products')} actionLabel="Shop products" />;
  else if (activeTab === 'track-order') content = <TrackOrder orders={orders} onShop={() => navigate('products')} />;
  else if (activeTab === 'dashboard') content = <CustomerDashboard orders={orders} bookings={repairRequests} onShop={() => navigate('products')} onBook={() => navigate('services')} />;
  else if (activeTab === 'admin') content = <AdminPanel isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} />;
  else if (activeTab === 'admin-login') content = <Login adminOnly onSuccess={() => navigate('admin')} onRegister={() => navigate('register')} />;
  else if (activeTab === 'offers') content = <OfferBanner />;
  else if (activeTab === 'login') content = <Login onSuccess={() => navigate('home')} onRegister={() => navigate('register')} />;
  else if (activeTab === 'register') content = <Register onSuccess={() => navigate('home')} onLogin={() => navigate('login')} />;
  else if (activeTab === 'wishlist') content = <Wishlist items={wishlist} onRemove={(id) => setWishlist((items) => items.filter((item) => (item._id || item.id) !== id))} onAddToCart={addToCart} onBuyNow={buyNow} onShop={() => navigate('products')} />;
  else if (activeTab === 'about') content = <AboutPage />;
  else if (activeTab === 'contact') content = <ContactPage />;
  else if (activeTab === 'blog') content = <BlogPage />;
  else if (activeTab === 'faq') content = <FaqPage />;
  else if (activeTab === 'privacy') content = <PrivacyPage />;
  else content = <SimplePage title="Page not found" text="Use the navigation to continue browsing Electrical Shop." action={() => navigate('home')} actionLabel="Go home" />;
  
  return <div className="App"><Navbar activeTab={activeTab} cartCount={cart.length} wishlistCount={wishlist.length} onNavigate={navigate} orders={orders} bookings={repairRequests} />{content}<GoogleMap /><Footer onNavigate={navigate} /></div>;
}

export default App;
