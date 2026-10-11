import React, { useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const services = [
  ['house-fitting', 'Home Wiring', 'Complete wiring, sockets and upgrades', '⚡'],
  ['fan-cooler', 'Fan Installation', 'Install or repair ceiling, exhaust and pedestal fans', '🌀'],
  ['circuit-board', 'Switch Repair', 'Switchboards, sockets and wiring faults', '🔘'],
  ['motor', 'MCB Replacement', 'Safety switches, MCBs and power protection', '🛡️'],
  ['other', 'Inverter Installation', 'Inverter, battery and backup-power support', '🔋'],
  ['other', 'CCTV Installation', 'Camera installation and basic setup', '📹'],
  ['other', 'Electrician Visit', 'Inspection, diagnosis and electrical help', '🔧']
];
const today = new Date().toISOString().split('T')[0];

function RepairRequest({ repairRequests, setRepairRequests }) {
  const [selectedService, setSelectedService] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: 'morning', street: '', city: '', state: '', zipCode: '', landmark: '', problem: '', urgency: 'normal' });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const selected = useMemo(() => services.find(([, name]) => name === selectedService), [selectedService]);
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const attachPhotos = async (event) => {
    const selectedFiles = Array.from(event.target.files || []).slice(0, 3);
    const encoded = await Promise.all(selectedFiles.map((file) => new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, data: reader.result }); reader.readAsDataURL(file); })));
    setPhotos(encoded);
  };
  const submit = async (event) => {
    event.preventDefault(); setMessage('');
    if (!selectedService) { setMessage('Please choose a service first.'); return; }
    setSubmitting(true);
    const payload = { customerName: form.name, customerPhone: form.phone, customerEmail: form.email, serviceType: selected?.[0], serviceName: selectedService, problemDescription: form.problem, preferredDate: form.date, preferredTime: form.time, urgency: form.urgency, address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, landmark: form.landmark }, images: photos.map((photo) => photo.data) };
    try {
      const { data } = await axios.post(`${API_URL}/bookings`, payload);
      const booking = data.data || { ...payload, _id: `BK-${Date.now()}`, status: 'pending' };
      const bookingMessage = `*NEW SERVICE BOOKING*\n\n*Booking ID:* ${booking._id}\n*Service:* ${booking.serviceName || selectedService}\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n${form.email ? `*Email:* ${form.email}\n` : ''}*Address:* ${form.street}, ${form.city}, ${form.state} - ${form.zipCode}${form.landmark ? `\n*Landmark:* ${form.landmark}` : ''}\n\n*Date:* ${form.date}\n*Time:* ${form.time}\n*Priority:* ${form.urgency}\n*Problem:* ${form.problem}\n*Photos attached:* ${photos.length}`;
      window.open(data.whatsapp?.url || `https://wa.me/919012675213?text=${encodeURIComponent(bookingMessage)}`, '_blank', 'noopener');
      setRepairRequests((items) => [booking, ...items]);
      setMessage(`Booking confirmed. Your booking ID is ${booking._id}. We will contact you shortly.`);
      setSelectedService(''); setForm({ name: '', phone: '', email: '', date: '', time: 'morning', street: '', city: '', state: '', zipCode: '', landmark: '', problem: '', urgency: 'normal' }); setPhotos([]);
    } catch (error) { setMessage(error.response?.data?.message || 'Could not submit the booking. Please make sure the backend is running.'); }
    finally { setSubmitting(false); }
  };
  return <section className="page-width booking-page"><div className="booking-intro"><p className="eyebrow">Electrical service at your doorstep</p><h1>Book an electrician visit.</h1><p>Choose a service, pick your preferred time and tell us what you need. We’ll confirm the visit with you.</p></div><form className="booking-form" onSubmit={submit}><section><h2>1. Choose a service</h2><div className="service-choice-grid">{services.map(([, name, detail, icon]) => <label key={name} className={selectedService === name ? 'selected' : ''}><input type="radio" name="service" checked={selectedService === name} onChange={() => setSelectedService(name)} /><span>{icon}</span><b>{name}</b><small>{detail}</small></label>)}</div></section><section><h2>2. Select date & time</h2><div className="booking-fields three"><label>Date<input type="date" name="date" min={today} value={form.date} onChange={change} required /></label><label>Time slot<select name="time" value={form.time} onChange={change}><option value="morning">Morning · 9 AM–12 PM</option><option value="afternoon">Afternoon · 12 PM–4 PM</option><option value="evening">Evening · 4 PM–7 PM</option><option value="anytime">Any available time</option></select></label><label>Priority<select name="urgency" value={form.urgency} onChange={change}><option value="normal">Normal</option><option value="urgent">Urgent</option><option value="emergency">Emergency</option></select></label></div></section><section><h2>3. Your contact & address</h2><div className="booking-fields two"><label>Full name<input name="name" value={form.name} onChange={change} required /></label><label>Mobile number<input name="phone" type="tel" pattern="[6-9][0-9]{9}" value={form.phone} onChange={change} required /></label><label>Email <small>(optional)</small><input name="email" type="email" value={form.email} onChange={change} /></label><label>PIN code<input name="zipCode" inputMode="numeric" value={form.zipCode} onChange={change} required /></label><label className="wide">House / street address<textarea name="street" rows="2" value={form.street} onChange={change} required /></label><label>City / town<input name="city" value={form.city} onChange={change} required /></label><label>State<input name="state" value={form.state} onChange={change} required /></label><label className="wide">Landmark <small>(optional)</small><input name="landmark" value={form.landmark} onChange={change} /></label></div></section><section><h2>4. Describe the job</h2><label className="problem-field">What needs to be fixed or installed?<textarea name="problem" rows="4" value={form.problem} onChange={change} placeholder="For example: fan is making a noise, or I need a new switchboard installed" required /></label><label className="photo-upload">📷 <span><b>Attach photos</b><small>Optional — add up to 3 images to help us understand the work</small></span><input type="file" accept="image/*" multiple onChange={attachPhotos} /></label>{photos.length > 0 && <div className="photo-list">{photos.map((photo) => <span key={photo.name}>✓ {photo.name}</span>)}</div>}</section>{message && <p className={message.startsWith('Booking confirmed') ? 'booking-success' : 'booking-error'}>{message}</p>}<button className="button button-primary confirm-booking" disabled={submitting}>{submitting ? 'Confirming booking…' : 'Confirm booking'}</button></form>{repairRequests.length > 0 && <section className="booking-history"><h2>Your recent bookings</h2>{repairRequests.slice(0, 3).map((booking) => <article key={booking._id}><div><b>{booking.serviceName || booking.serviceType}</b><small>{new Date(booking.preferredDate).toLocaleDateString('en-IN')} · {booking.preferredTime}</small></div><span className={`booking-status ${booking.status}`}>{booking.status.replace('-', ' ')}</span></article>)}</section>}</section>;
}

export default RepairRequest;
