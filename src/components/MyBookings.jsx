import React, { useState, useEffect } from 'react';

function MyBookings({ bookings, onNavigate }) {
  const [localBookings, setLocalBookings] = useState(() => {
    const saved = localStorage.getItem('service-bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('service-bookings', JSON.stringify(localBookings));
  }, [localBookings]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFC107';
      case 'confirmed': return '#17A2B8';
      case 'technical-assigned': return '#007BFF';
      case 'in-progress': return '#FF6B6B';
      case 'completed': return '#28A745';
      default: return '#6C757D';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'technical-assigned': return '👨‍🔧';
      case 'in-progress': return '🔧';
      case 'completed': return '🎉';
      default: return '❓';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'technical-assigned': return 'Technical Assigned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const statusSequence = ['pending', 'confirmed', 'technical-assigned', 'in-progress', 'completed'];

  const getProgressPercentage = (status) => {
    const index = statusSequence.indexOf(status);
    return ((index + 1) / statusSequence.length) * 100;
  };

  return (
    <div className="container">
      <h2 className="section-title">📋 My Service Bookings</h2>
      
      {localBookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <h3>No Bookings Yet</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            You haven't booked any services yet. Start by booking a service!
          </p>
          <button 
            className="button button-primary"
            onClick={() => onNavigate('services')}
          >
            Book a Service
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {localBookings.map((booking, index) => (
            <div key={index} className="card" style={{ borderLeft: `5px solid ${getStatusColor(booking.status)}` }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>🔧 {booking.serviceType}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Booking ID: <strong>{booking.bookingId}</strong>
                  </p>
                </div>
                <div style={{ 
                  background: getStatusColor(booking.status), 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px',
                  textAlign: 'center',
                  minWidth: '120px'
                }}>
                  <p style={{ fontSize: '1.5rem', margin: '0' }}>{getStatusIcon(booking.status)}</p>
                  <p style={{ margin: '0.3rem 0 0 0', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {getStatusLabel(booking.status)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  background: '#E9ECEF', 
                  height: '8px', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    background: getStatusColor(booking.status),
                    height: '100%',
                    width: `${getProgressPercentage(booking.status)}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                  <span>⏳ Pending</span>
                  <span>✅ Confirmed</span>
                  <span>👨‍🔧 Assigned</span>
                  <span>🔧 In Progress</span>
                  <span>🎉 Completed</span>
                </div>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E9ECEF' }}>
                <h4 style={{ color: '#007BFF', marginBottom: '0.8rem' }}>👤 Customer Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Name</p>
                    <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0' }}>{booking.name}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Phone</p>
                    <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0' }}>{booking.phone}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Address</p>
                    <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0', fontSize: '0.9rem' }}>{booking.address}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E9ECEF' }}>
                <h4 style={{ color: '#007BFF', marginBottom: '0.8rem' }}>🔧 Service Details</h4>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Problem Description</p>
                  <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0' }}>{booking.problem}</p>
                </div>
              </div>

              {/* Schedule Details */}
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E9ECEF' }}>
                <h4 style={{ color: '#007BFF', marginBottom: '0.8rem' }}>📅 Scheduled Date & Time</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Date</p>
                    <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0', fontSize: '1.1rem' }}>📅 {booking.date}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>Time</p>
                    <p style={{ fontWeight: 'bold', margin: '0.3rem 0 0 0', fontSize: '1.1rem' }}>🕐 {booking.time}</p>
                  </div>
                </div>
              </div>

              {/* Booking Date */}
              <div style={{ color: '#999', fontSize: '0.85rem' }}>
                Booked on: {new Date(booking.bookedAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Status Notes */}
              {booking.status === 'completed' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#D4EDDA', 
                  borderRadius: '5px',
                  color: '#155724'
                }}>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>✅ Service Completed!</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Thank you for using our service. We hope you're satisfied with our work!
                  </p>
                </div>
              )}

              {booking.status === 'in-progress' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#FFF3CD', 
                  borderRadius: '5px',
                  color: '#856404'
                }}>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>🔧 Work in Progress</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Our technician is currently working on your service. We'll update you soon!
                  </p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#E7F3FF', 
                  borderRadius: '5px',
                  color: '#004085'
                }}>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>⏳ Awaiting Confirmation</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Your booking is pending. Admin will confirm shortly. You'll receive a WhatsApp confirmation.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Legend */}
      <div className="card" style={{ marginTop: '2rem', background: '#F8F9FA' }}>
        <h3 style={{ marginBottom: '1rem' }}>📊 Booking Status Guide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '5px', borderLeft: `4px solid #FFC107` }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>⏳ Pending</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              Your booking is received and waiting for admin confirmation.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '5px', borderLeft: `4px solid #17A2B8` }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>✅ Confirmed</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              Your booking has been confirmed by admin.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '5px', borderLeft: `4px solid #007BFF` }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>👨‍🔧 Technical Assigned</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              A technician has been assigned to your service.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '5px', borderLeft: `4px solid #FF6B6B` }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>🔧 In Progress</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              The technician is currently working on your service.
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '5px', borderLeft: `4px solid #28A745` }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>🎉 Completed</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              Your service has been completed successfully!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
