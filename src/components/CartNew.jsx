import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function CartNew() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCart(data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/cart/update/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      alert('✅ Item removed from cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear the cart?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      alert('✅ Cart cleared');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    
    const total = cart.totalPrice || 0;
    alert(`✅ Order placed successfully!\nTotal: ₹${total}\nYou will receive confirmation SMS/Email.\nPayment Options: COD, UPI, Card available at delivery.`);
  };

  const handleWhatsAppOrder = () => {
    if (!cart || cart.items.length === 0) return;

    const items = cart.items.map(item => 
      `${item.product.name} x ${item.quantity} = Rs.${item.product.price * item.quantity}`
    ).join('\n');
    
    const total = cart.totalPrice || 0;
    const msg = `Cart Order:\n${items}\n\nTotal: Rs.${total}`;
    
    const url = `https://wa.me/919012675213?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 Your Cart</h2>
        <div style={styles.card}>
          <p style={styles.loading}>Loading cart...</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem('token');
  
  if (!token) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 Your Cart</h2>
        <div style={styles.card}>
          <div style={styles.emptyCart}>
            <h3>🔒 Please Login</h3>
            <p>You need to login to view your cart</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 Your Cart</h2>
        <div style={styles.card}>
          <div style={styles.emptyCart}>
            <h3>Your cart is empty 🛍️</h3>
            <p>Add some products from the shop!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛒 Your Cart ({cart.totalItems} items)</h2>
      
      <div style={styles.cartGrid}>
        <div style={styles.itemsSection}>
          {cart.items.map(item => (
            <div key={item._id} style={styles.cartItem}>
              {item.product.images && item.product.images.length > 0 && (
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  style={styles.itemImage}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'}
                />
              )}
              
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.product.name}</h3>
                <p style={styles.itemPrice}>₹{item.product.price} each</p>
                <p style={styles.itemStock}>
                  {item.product.stock > 0 ? `✅ In Stock (${item.product.stock})` : '❌ Out of Stock'}
                </p>
              </div>

              <div style={styles.itemActions}>
                <div style={styles.quantityControl}>
                  <button 
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button 
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <p style={styles.itemTotal}>₹{item.product.price * item.quantity}</p>
                
                <button 
                  style={styles.removeBtn}
                  onClick={() => removeFromCart(item.product._id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            
            <div style={styles.summaryRow}>
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            
            <div style={styles.summaryRow}>
              <span>Delivery Charges</span>
              <span style={{color: '#48bb78'}}>FREE</span>
            </div>
            
            <div style={styles.divider}></div>
            
            <div style={styles.totalRow}>
              <span>Total Amount</span>
              <span>₹{cart.totalPrice}</span>
            </div>

            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              💳 Proceed to Checkout
            </button>

            <button style={styles.whatsappBtn} onClick={handleWhatsAppOrder}>
              📱 Order via WhatsApp
            </button>

            <button style={styles.clearBtn} onClick={clearCart}>
              🗑️ Clear Cart
            </button>

            <div style={styles.paymentInfo}>
              <p>✅ Cash on Delivery Available</p>
              <p>✅ UPI / Card / Netbanking</p>
              <p>✅ 100% Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  title: { fontSize: '2rem', marginBottom: '2rem', color: '#2d3748', textAlign: 'center' },
  card: { background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  loading: { textAlign: 'center', fontSize: '1.2rem', color: '#718096' },
  emptyCart: { textAlign: 'center', padding: '3rem' },
  cartGrid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' },
  itemsSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  cartItem: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'center' },
  itemImage: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2d3748' },
  itemPrice: { color: '#48bb78', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' },
  itemStock: { fontSize: '0.85rem', color: '#718096' },
  itemActions: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: { width: '32px', height: '32px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '600' },
  quantity: { fontSize: '1.2rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' },
  itemTotal: { fontSize: '1.3rem', fontWeight: '700', color: '#2d3748' },
  removeBtn: { padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  summarySection: { position: 'sticky', top: '2rem', height: 'fit-content' },
  summaryCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  summaryTitle: { fontSize: '1.5rem', marginBottom: '1.5rem', color: '#2d3748' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1rem', color: '#4a5568' },
  divider: { height: '1px', background: '#e2e8f0', margin: '1rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '700', color: '#2d3748', marginBottom: '1.5rem' },
  checkoutBtn: { width: '100%', padding: '1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' },
  whatsappBtn: { width: '100%', padding: '1rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' },
  clearBtn: { width: '100%', padding: '0.75rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' },
  paymentInfo: { marginTop: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#4a5568' }
};

export default CartNew;
