import React, { useState } from 'react';

function ServicesPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    address: '',
    serviceType: '',
    problem: '',
    date: '',
    time: ''
  });
  const [adminWhatsApp] = useState('919012675213');

  const services = [
    {
      id: 1,
      icon: '🏠',
      title: 'House Wiring',
      description: 'Complete electrical wiring solutions for your home',
      items: [
        'New house complete wiring',
        'Old house rewiring',
        'Concealed wiring',
        'Open wiring',
        'Switchboard installation'
      ]
    },
    {
      id: 2,
      icon: '🏗️',
      title: 'Linter / Slab Conduit Piping',
      description: 'Professional conduit piping installation during construction',
      items: [
        'Chhat/linter dalte waqt electrical pipe installation',
        'Conduit pipe layout',
        'Switch & socket point planning',
        'Fan/light points',
        'Future wiring provisions'
      ]
    },
    {
      id: 3,
      icon: '💡',
      title: 'Light Installation',
      description: 'Professional light fixture installation and setup'
    },
    {
      id: 4,
      icon: '🌀',
      title: 'Fan Installation',
      description: 'Expert ceiling and wall fan installation'
    },
    {
      id: 5,
      icon: '🔌',
      title: 'Switch & Socket Installation',
      description: 'Quality switch and socket point installation'
    },
    {
      id: 6,
      icon: '⚡',
      title: 'MCB / DB Installation',
      description: 'Main circuit breaker and distribution board installation'
    },
    {
      id: 7,
      icon: '📹',
      title: 'CCTV Installation',
      description: 'Professional CCTV camera system installation'
    },
    {
      id: 8,
      icon: '🔧',
      title: 'Electrical Repair & Maintenance',
      description: 'General electrical repair and maintenance services'
    }
  ];

  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingDetails({
      name: '',
      phone: '',
      address: '',
      serviceType: service.title,
      problem: '',
      date: '',
      time: ''
    });
    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value
    });
  };

  const sendWhatsAppMessage = () => {
    // Validate all fields
    if (!bookingDetails.name || !bookingDetails.phone || !bookingDetails.address || 
        !bookingDetails.serviceType || !bookingDetails.problem || !bookingDetails.date || !bookingDetails.time) {
      alert('❌ Please fill all fields!');
      return;
    }

    // Validate phone number (basic validation)
    if (bookingDetails.phone.length < 10) {
      alert('❌ Please enter a valid phone number!');
      return;
    }

    // Generate unique booking ID
    const bookingId = `BK-${Date.now()}`;

    // Create booking object
    const newBooking = {
      bookingId: bookingId,
      name: bookingDetails.name,
      phone: bookingDetails.phone,
      address: bookingDetails.address,
      serviceType: bookingDetails.serviceType,
      problem: bookingDetails.problem,
      date: bookingDetails.date,
      time: bookingDetails.time,
      status: 'pending',
      bookedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('service-bookings') || '[]');
    existingBookings.push(newBooking);
    localStorage.setItem('service-bookings', JSON.stringify(existingBookings));

    // Format the message
    const message = `🔧 *NEW SERVICE BOOKING REQUEST*

*BOOKING ID:* ${bookingId}

*CUSTOMER DETAILS:*
*Name:* ${bookingDetails.name}
*Phone:* ${bookingDetails.phone}
*Address:* ${bookingDetails.address}

*SERVICE INFORMATION:*
*Service Type:* ${bookingDetails.serviceType}
*Problem Description:* ${bookingDetails.problem}

*PREFERRED SCHEDULE:*
*Date:* ${bookingDetails.date}
*Time:* ${bookingDetails.time}

_Sent from Electrician Shop App_`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowBookingModal(false);
    setBookingDetails({
      name: '',
      phone: '',
      address: '',
      serviceType: '',
      problem: '',
      date: '',
      time: ''
    });
    alert('✅ Booking confirmed! Booking ID: ' + bookingId + '\n\nOpening WhatsApp to send booking request!');
  };

  // Get today's date in YYYY-MM-DD format for minimum date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="container">
      <h2 className="section-title">🔧 Electrical Services</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Professional electrical services for your home and business
      </p>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {services.map((service) => (
          <div className="card" key={service.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{service.description}</p>
            
            {service.items && (
              <ul style={{ marginBottom: '1rem', flex: 1 }}>
                {service.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', color: '#555' }}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            )}

            <p style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '1rem' }}>
              ✅ Free Pick & Drop Available
            </p>

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
          zIndex: 1000,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>📋 Service Booking Form</h2>
            
            {/* Customer Details Section */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f0f0f0' }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem', fontSize: '1.1rem' }}>👤 Customer Details</h3>
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Name:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={bookingDetails.name}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Phone No.:
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={bookingDetails.phone}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Address:
              </label>
              <textarea
                name="address"
                placeholder="Enter your complete address"
                value={bookingDetails.address}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontSize: '1rem',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
            </div>

            {/* Service Information Section */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f0f0f0' }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem', fontSize: '1.1rem' }}>🔧 Service Information</h3>
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Service Type:
              </label>
              <input
                type="text"
                name="serviceType"
                value={bookingDetails.serviceType}
                readOnly
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  background: '#f9f9f9',
                  fontSize: '1rem'
                }}
              />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Problem Description:
              </label>
              <textarea
                name="problem"
                placeholder="Describe the problem or service requirement in detail"
                value={bookingDetails.problem}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  fontSize: '1rem',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
            </div>

            {/* Preferred Schedule Section */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f0f0f0' }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem', fontSize: '1.1rem' }}>📅 Preferred Schedule</h3>
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={bookingDetails.date}
                onChange={handleInputChange}
                min={getTodayDate()}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Time:
              </label>
              <input
                type="time"
                name="time"
                value={bookingDetails.time}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px', 
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                onClick={sendWhatsAppMessage}
                style={{
                  flex: 1,
                  background: '#25D366',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#20ba5a'}
                onMouseOut={(e) => e.target.style.background = '#25D366'}
              >
                📱 Book Now
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                style={{
                  flex: 1,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#5a6268'}
                onMouseOut={(e) => e.target.style.background = '#6c757d'}
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

export default ServicesPage;
