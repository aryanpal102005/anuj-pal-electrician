import React, { useState } from 'react';
import { bookingService } from '../api/services';

const BookingForm = ({ selectedService, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    serviceType: selectedService?.slug || '',
    problemDescription: '',
    preferredDate: '',
    preferredTime: 'morning',
    urgency: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    { value: 'washing-machine', label: '🧺 Washing Machine Repair' },
    { value: 'refrigerator', label: '❄️ Refrigerator Repair' },
    { value: 'fan-cooler', label: '🌀 Fan / Cooler Repair' },
    { value: 'motor', label: '⚙️ Motor Repair' },
    { value: 'geyser', label: '🔥 Geyser Repair' },
    { value: 'circuit-board', label: '🔌 Circuit Board Repair' },
    { value: 'house-fitting', label: '🏠 New House Electrical Fitting' },
    { value: 'ac-repair', label: '❄️ AC Repair' },
    { value: 'tv-repair', label: '📺 TV Repair' },
    { value: 'microwave', label: '📻 Microwave Repair' },
    { value: 'other', label: '🔧 Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.customerName || !formData.customerPhone || !formData.serviceType || 
        !formData.problemDescription || !formData.preferredDate) {
      setError('Please fill all required fields');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.customerPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          landmark: formData.landmark
        },
        serviceType: formData.serviceType,
        problemDescription: formData.problemDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        urgency: formData.urgency
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        // Auto-open WhatsApp to send booking details to admin
        if (response.whatsapp && response.whatsapp.url) {
          window.open(response.whatsapp.url, '_blank');
        }

        alert(`✅ Booking Successful!\n\nBooking ID: ${response.data._id}\n\nWe will contact you soon at ${formData.customerPhone}\n\nThank you for choosing our service!`);
        
        if (onSuccess) onSuccess(response.data);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(errorMsg);
      
      // Show detailed error in alert for debugging
      if (process.env.REACT_APP_ENV === 'development') {
        alert(`Error: ${errorMsg}\n\nURL: ${err.config?.url}\nMethod: ${err.config?.method}\nStatus: ${err.response?.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>📋 Book Repair Service</h2>
          {onClose && (
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          )}
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Personal Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Details</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email (Optional)</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Service Address</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                style={styles.input}
                placeholder="House no., Street name"
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="City"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="State"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>PIN Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="6-digit PIN"
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                style={styles.input}
                placeholder="Nearby landmark"
              />
            </div>
          </div>

          {/* Service Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Service Details</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Type *</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select service type</option>
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Problem Description *</label>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                style={styles.textarea}
                placeholder="Describe the problem in detail..."
                rows="4"
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  style={styles.input}
                  min={today}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Time *</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent (within 24 hours)</option>
                <option value="emergency">Emergency (ASAP)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
          </button>

          <p style={styles.note}>
            * We will call you to confirm the booking and provide cost estimate
          </p>
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
    padding: '1rem',
    overflowY: 'auto',
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1,
  },
  title: {
    fontSize: '1.5rem',
    color: '#2d3748',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#718096',
    padding: '0.5rem',
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
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#2d3748',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #667eea',
  },
  formGroup: {
    marginBottom: '1rem',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    background: 'white',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  note: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#718096',
    marginTop: '1rem',
  },
};

export default BookingForm;
