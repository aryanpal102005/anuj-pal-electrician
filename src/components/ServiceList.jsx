import React, { useState } from 'react';

function ServiceList() {
  const [services, setServices] = useState([
    { id: 1, name: 'Washing Machine', icon: '🧺', price: 399, category: 'appliance' },
    { id: 2, name: 'Refrigerator', icon: '❄️', price: 499, category: 'appliance' },
    { id: 3, name: 'AC / Cooler', icon: '❄️', price: 599, category: 'appliance' },
    { id: 4, name: 'Microwave / Oven', icon: '🔥', price: 349, category: 'appliance' },
    { id: 5, name: 'Iron / Geyser', icon: '🔥', price: 199, category: 'appliance' },
    { id: 6, name: 'Fan / Motor', icon: '🌀', price: 249, category: 'appliance' },
    { id: 7, name: 'Board Circuit', icon: '🔌', price: 299, category: 'electrical' },
    { id: 8, name: 'TV / Electronics', icon: '📺', price: 449, category: 'electronics' },
  ]);


  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', address: '', problem: '' });
  const [adminWhatsApp] = useState('919012675213'); // Admin WhatsApp number



  // Handle Book Now click
  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address || !userInfo.problem) {
      alert('Please fill all fields!');
      return;
    }

    const message = `🔧 *New Service Booking Request*\n\n*Service:* ${selectedService.name}\n*Price:* ₹${selectedService.price}\n*Name:* ${userInfo.name}\n*Phone:* ${userInfo.phone}\n*Address:* ${userInfo.address}\n*Problem Description:* ${userInfo.problem}\n\n_Sent from Electrician Shop App_`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowBookingModal(false);
    setUserInfo({ name: '', phone: '', address: '', problem: '' });
    alert('✅ Opening WhatsApp to send booking request!');
  };

  return (
    <div className="container">
      <h2 className="section-title">🔧 Our Repair Services</h2>
      
      {/* Services Grid */}
      <div className="grid">
        {services.map((service) => (
          <div className="card" key={service.id}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.name}</h3>
            
            
            <p>✅ Free Pick & Drop Available</p>
            
            <button 
              className="add-to-cart" 
              onClick={() => handleBookNow(service)}
              style={{ width: '100%' }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Admin Instructions */}
      <div className="card" style={{ marginTop: '2rem', background: '#e8f5e9' }}>
        <h3>📌 How to Manage Services (For Shop Owner)</h3>
        <ul>
          <li><strong>➕ Add New Service:</strong> Go to Admin Panel to add new repair services</li>
          <li><strong>✏️ Edit Price:</strong> Go to Admin Panel to edit service prices</li>
          <li><strong>🗑️ Delete Service:</strong> Go to Admin Panel to remove services</li>
          <li><strong>💡 Examples of new services you can add:</strong> Water Purifier, Air Fryer, Induction Cooktop, Chimney, RO System, etc.</li>
        </ul>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2>📋 Booking Details</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Service: <strong>{selectedService?.name}</strong></p>
            
            <input
              type="text"
              placeholder="Your Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
              style={{ width: '100%', padding: '0.7rem', marginBottom: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
              style={{ width: '100%', padding: '0.7rem', marginBottom: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            />
            
            <textarea
              placeholder="Your Address"
              value={userInfo.address}
              onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
              style={{ width: '100%', padding: '0.7rem', marginBottom: '0.8rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', minHeight: '80px' }}
            />
            
            <textarea
              placeholder="Describe the problem (e.g., AC not cooling, Fan making noise, etc.)"
              value={userInfo.problem}
              onChange={(e) => setUserInfo({...userInfo, problem: e.target.value})}
              style={{ width: '100%', padding: '0.7rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', minHeight: '80px' }}
            />
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={sendWhatsAppMessage}
                style={{
                  flex: 1,
                  background: '#25D366',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📱 Send via WhatsApp
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                style={{
                  flex: 1,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceList;