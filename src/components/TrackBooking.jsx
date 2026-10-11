import React, { useState } from 'react';
import { bookingService } from '../api/services';

const TrackBooking = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingService.getBookingsByPhone(phone);
      setBookings(response.data || []);
      setSearched(true);
    } catch (err) {
      console.error('Track booking error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch bookings';
      setError(errorMsg);
      
      // Show detailed error in alert for debugging
      if (process.env.REACT_APP_ENV === 'development') {
        alert(`Error: ${errorMsg}\n\nURL: ${err.config?.url}\nMethod: ${err.config?.method}\nStatus: ${err.response?.status}\n\nMake sure backend is running on http://localhost:5001`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt('Please enter cancellation reason:');
    if (!reason) return;

    try {
      const response = await bookingService.cancelBooking(bookingId, {
        cancellationReason: reason,
        phone: phone
      });

      if (response.success) {
        alert('Booking cancelled successfully!');
        // Refresh bookings
        handleSearch({ preventDefault: () => {} });
      }
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6ad55',
      confirmed: '#4299e1',
      'in-progress': '#9f7aea',
      completed: '#48bb78',
      cancelled: '#f56565'
    };
    return colors[status] || '#718096';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      'in-progress': '🔧',
      completed: '✔️',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📍 Track Your Booking</h1>
        <p style={styles.subtitle}>Enter your phone number to track your service bookings</p>
      </div>

      {/* Search Form */}
      <div style={styles.searchCard}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>📱</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              style={styles.input}
              maxLength="10"
              required
            />
          </div>
          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? '🔍 Searching...' : '🔍 Track Booking'}
          </button>
        </form>

        {error && (
          <div style={styles.error}>{error}</div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div style={styles.results}>
          {bookings.length === 0 ? (
            <div style={styles.noBookings}>
              <div style={styles.noBookingsIcon}>📭</div>
              <h3>No Bookings Found</h3>
              <p>No bookings found for this phone number.</p>
              <p style={styles.hint}>Make sure you entered the correct number used during booking.</p>
            </div>
          ) : (
            <>
              <h2 style={styles.resultsTitle}>
                Found {bookings.length} booking{bookings.length > 1 ? 's' : ''}
              </h2>
              
              <div style={styles.bookingsList}>
                {bookings.map(booking => (
                  <div key={booking._id} style={styles.bookingCard}>
                    <div style={styles.bookingHeader}>
                      <div>
                        <span style={{
                          ...styles.statusBadge,
                          background: getStatusColor(booking.status)
                        }}>
                          {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={styles.bookingId}>
                        ID: {booking._id.slice(-8)}
                      </div>
                    </div>

                    <div style={styles.bookingBody}>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Service:</span>
                        <span style={styles.value}>
                          {booking.serviceType.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.label}>Customer:</span>
                        <span style={styles.value}>{booking.customerName}</span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.label}>Address:</span>
                        <span style={styles.value}>
                          {booking.address.street}, {booking.address.city}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.label}>Scheduled:</span>
                        <span style={styles.value}>
                          {new Date(booking.preferredDate).toLocaleDateString('en-IN')} - {booking.preferredTime}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.label}>Problem:</span>
                        <span style={styles.value}>{booking.problemDescription}</span>
                      </div>

                      {booking.assignedTechnician && (
                        <div style={styles.technicianInfo}>
                          <div style={styles.infoRow}>
                            <span style={styles.label}>Technician:</span>
                            <span style={styles.value}>{booking.assignedTechnician}</span>
                          </div>
                          {booking.technicianPhone && (
                            <div style={styles.infoRow}>
                              <span style={styles.label}>Contact:</span>
                              <span style={styles.value}>{booking.technicianPhone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {booking.estimatedCost && (
                        <div style={styles.costInfo}>
                          <span style={styles.label}>Estimated Cost:</span>
                          <span style={styles.costValue}>₹{booking.estimatedCost}</span>
                        </div>
                      )}

                      {booking.actualCost && (
                        <div style={styles.costInfo}>
                          <span style={styles.label}>Actual Cost:</span>
                          <span style={styles.costValue}>₹{booking.actualCost}</span>
                        </div>
                      )}

                      <div style={styles.bookingFooter}>
                        <span style={styles.bookingDate}>
                          Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button
                            style={styles.cancelBtn}
                            onClick={() => handleCancel(booking._id)}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Help Section */}
      <div style={styles.helpSection}>
        <h3 style={styles.helpTitle}>Need Help?</h3>
        <p style={styles.helpText}>
          📞 Call us: <strong>+91 9012675213</strong><br />
          📧 Email: <strong>anujpalelectricals@gmail.com</strong><br />
          ⏰ Timings: 9 AM - 8 PM
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
    background: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#718096',
  },
  searchCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  searchForm: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  inputGroup: {
    flex: 1,
    minWidth: '250px',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  searchBtn: {
    padding: '0.75rem 2rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  error: {
    marginTop: '1rem',
    padding: '0.75rem',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  results: {
    marginTop: '2rem',
  },
  resultsTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1.5rem',
  },
  noBookings: {
    background: 'white',
    borderRadius: '12px',
    padding: '3rem',
    textAlign: 'center',
    color: '#718096',
  },
  noBookingsIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  hint: {
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  bookingCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: '#f7fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  bookingId: {
    fontSize: '0.85rem',
    color: '#718096',
    fontFamily: 'monospace',
  },
  bookingBody: {
    padding: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    marginBottom: '0.75rem',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '600',
    color: '#4a5568',
    minWidth: '120px',
  },
  value: {
    color: '#2d3748',
    flex: 1,
  },
  technicianInfo: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#ebf4ff',
    borderRadius: '8px',
  },
  costInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    padding: '0.75rem',
    background: '#f0fff4',
    borderRadius: '8px',
  },
  costValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#38a169',
  },
  bookingFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  bookingDate: {
    fontSize: '0.85rem',
    color: '#718096',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  helpSection: {
    marginTop: '3rem',
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
  },
  helpTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  helpText: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.8',
  },
};

export default TrackBooking;
