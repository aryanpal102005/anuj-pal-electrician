import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './MyAccount.css';

function MyAccount({ onNavigate, orders = [], bookings = [] }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [addresses, setAddresses] = useState(() => JSON.parse(localStorage.getItem('user-addresses') || '[]'));
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ type: 'Home', street: '', city: '', state: '', zipCode: '' });
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notification-prefs') || '{"email": true, "sms": true, "whatsapp": true}'));

  if (!isAuthenticated) {
    return (
      <div className="my-account-login-prompt">
        <div className="login-prompt-card">
          <h2>👤 My Account</h2>
          <p>Please login to access your account</p>
          <div className="login-prompt-buttons">
            <button className="button button-primary" onClick={() => onNavigate('login')}>Login</button>
            <button className="button button-outline" onClick={() => onNavigate('register')}>Register</button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    onNavigate('home');
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
  };

  const handleAddAddress = () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      alert('Please fill all address fields!');
      return;
    }
    const newAddresses = editingAddress 
      ? addresses.map((addr, idx) => idx === editingAddress ? addressForm : addr)
      : [...addresses, { ...addressForm, id: Date.now() }];
    setAddresses(newAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
    setAddressForm({ type: 'Home', street: '', city: '', state: '', zipCode: '' });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (idx) => {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    setAddresses(newAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
  };

  const handleEditAddress = (idx) => {
    setEditingAddress(idx);
    setAddressForm(addresses[idx]);
    setShowAddressForm(true);
  };

  const handleNotificationChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notification-prefs', JSON.stringify(updated));
  };

  const completedServices = bookings.filter(b => b.status === 'Completed').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'completed').length;

  return (
    <div className="my-account-container">
      <div className="account-header-dropdown">
        <button className="account-button" onClick={() => setShowDropdown(!showDropdown)}>
          👤 {user?.name || 'My Account'}
          <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
        </button>

        {showDropdown && (
          <div className="account-dropdown-menu">
            <div className="dropdown-section">
              <button className="dropdown-item" onClick={() => { setActiveSection('profile'); setShowDropdown(false); }}>
                <span>👤</span> My Profile
              </button>
              <button className="dropdown-item" onClick={() => { setActiveSection('orders'); setShowDropdown(false); }}>
                <span>📦</span> My Orders
              </button>
              <button className="dropdown-item" onClick={() => { setActiveSection('services'); setShowDropdown(false); }}>
                <span>🔧</span> My Service History
              </button>
              <button className="dropdown-item" onClick={() => { setActiveSection('addresses'); setShowDropdown(false); }}>
                <span>🏠</span> My Addresses
              </button>
              <button className="dropdown-item" onClick={() => { setActiveSection('settings'); setShowDropdown(false); }}>
                <span>⚙️</span> Account Settings
              </button>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-item" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      {activeSection && (
        <div className="account-content">
          <button className="close-section" onClick={() => setActiveSection(null)}>✕</button>

          {/* My Profile */}
          {activeSection === 'profile' && (
            <div className="account-section">
              <h2>👤 My Profile</h2>
              <div className="profile-card">
                <div className="profile-field">
                  <label>Name</label>
                  <p>{user?.name || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p>{user?.email || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>Mobile Number</label>
                  <p>{user?.phone || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>Role</label>
                  <p>{user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}</p>
                </div>
              </div>
            </div>
          )}

          {/* My Orders */}
          {activeSection === 'orders' && (
            <div className="account-section">
              <h2>📦 My Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet</p>
                  <button className="button button-primary" onClick={() => { setActiveSection(null); onNavigate('products'); }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order, idx) => (
                    <div key={idx} className="order-card">
                      <div className="order-header">
                        <span className="order-id">Order #{order.id}</span>
                        <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>Items:</strong> {order.items?.length || 0} product(s)</p>
                        <p><strong>Total:</strong> ₹{order.summary?.total || order.total || 0}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Service History */}
          {activeSection === 'services' && (
            <div className="account-section">
              <h2>🔧 My Service History</h2>
              <div className="service-stats">
                <div className="stat-card">
                  <span className="stat-number">{completedServices}</span>
                  <span className="stat-label">Completed Services</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{bookings.length}</span>
                  <span className="stat-label">Total Bookings</span>
                </div>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <p>No service bookings yet</p>
                  <button className="button button-primary" onClick={() => { setActiveSection(null); onNavigate('services'); }}>
                    Book a Service
                  </button>
                </div>
              ) : (
                <div className="services-list">
                  {bookings.map((booking, idx) => (
                    <div key={idx} className="service-card">
                      <div className="service-header">
                        <span className="booking-id">Booking #{booking.bookingId}</span>
                        <span className={`service-status status-${(booking.status || 'pending').toLowerCase()}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                      <div className="service-details">
                        <p><strong>Service:</strong> {booking.serviceType}</p>
                        <p><strong>Issue:</strong> {booking.problem}</p>
                        <p><strong>Scheduled:</strong> {booking.date} at {booking.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Addresses */}
          {activeSection === 'addresses' && (
            <div className="account-section">
              <h2>🏠 My Addresses</h2>
              {!showAddressForm ? (
                <>
                  {addresses.length === 0 ? (
                    <div className="empty-state">
                      <p>No addresses saved yet</p>
                    </div>
                  ) : (
                    <div className="addresses-list">
                      {addresses.map((addr, idx) => (
                        <div key={idx} className="address-card">
                          <div className="address-type">{addr.type}</div>
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                          <div className="address-actions">
                            <button className="btn-small" onClick={() => handleEditAddress(idx)}>Edit</button>
                            <button className="btn-small btn-danger" onClick={() => handleDeleteAddress(idx)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="button button-primary" onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm({ type: 'Home', street: '', city: '', state: '', zipCode: '' }); }}>
                    + Add New Address
                  </button>
                </>
              ) : (
                <div className="address-form">
                  <h3>{editingAddress !== null ? 'Edit Address' : 'Add New Address'}</h3>
                  <div className="form-group">
                    <label>Address Type</label>
                    <select value={addressForm.type} onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}>
                      <option>Home</option>
                      <option>Office</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input type="text" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="Enter street address" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input type="text" value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} placeholder="Zip Code" />
                  </div>
                  <div className="form-actions">
                    <button className="button button-primary" onClick={handleAddAddress}>
                      {editingAddress !== null ? 'Update Address' : 'Save Address'}
                    </button>
                    <button className="button button-outline" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Account Settings */}
          {activeSection === 'settings' && (
            <div className="account-section">
              <h2>⚙️ Account Settings</h2>
              
              {!showPasswordForm ? (
                <div className="settings-options">
                  <div className="settings-card">
                    <h3>🔐 Change Password</h3>
                    <p>Update your account password</p>
                    <button className="button button-outline" onClick={() => setShowPasswordForm(true)}>Change Password</button>
                  </div>

                  <div className="settings-card">
                    <h3>🔔 Notification Preferences</h3>
                    <div className="notification-prefs">
                      <label className="pref-item">
                        <input type="checkbox" checked={notifications.email} onChange={() => handleNotificationChange('email')} />
                        <span>📧 Email Notifications</span>
                      </label>
                      <label className="pref-item">
                        <input type="checkbox" checked={notifications.sms} onChange={() => handleNotificationChange('sms')} />
                        <span>📱 SMS Notifications</span>
                      </label>
                      <label className="pref-item">
                        <input type="checkbox" checked={notifications.whatsapp} onChange={() => handleNotificationChange('whatsapp')} />
                        <span>💬 WhatsApp Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="password-form">
                  <h3>🔐 Change Password</h3>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} placeholder="Confirm new password" />
                  </div>
                  <div className="form-actions">
                    <button className="button button-primary" onClick={handlePasswordChange}>Update Password</button>
                    <button className="button button-outline" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyAccount;
