import React, { useState } from 'react';

function OrderManagement({ orders, setOrders }) {
  const [trackingId, setTrackingId] = useState('');

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="container">
      <h2 className="section-title">📦 Order Management</h2>
      <div className="card">
        <h3>Track Order</h3>
        <input type="text" placeholder="Enter Order ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} style={{ padding: '0.5rem', width: '200px', marginRight: '0.5rem' }} />
        <button className="submit-btn" onClick={() => alert(`Order ${trackingId} is being processed. You will receive SMS update.`)}>Track</button>
      </div>
      <div className="card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <h3>All Orders</h3>
        {orders.length === 0 ? (
          <p>No orders yet. Orders will appear here when customers checkout.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td><td>{o.customer}</td><td>₹{o.total}</td><td>{o.status}</td>
                  <td>
                    <select onChange={(e) => updateStatus(o.id, e.target.value)} value={o.status}>
                      <option>pending</option><option>confirmed</option><option>shipped</option><option>delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;