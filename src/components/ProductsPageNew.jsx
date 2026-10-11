import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const categories = [
    { value: 'all', label: '🛒 All Products', icon: '🛒' },
    { value: 'wiring-cable', label: 'Wiring & Cable', icon: '🔌' },
    { value: 'lighting', label: 'Lighting', icon: '💡' },
    { value: 'switches-boards', label: 'Switches & Boards', icon: '🔘' },
    { value: 'fans-cooling', label: 'Fans & Cooling', icon: '🌀' },
    { value: 'heating', label: 'Heating', icon: '🔥' },
    { value: 'motors-pumps', label: 'Motors & Pumps', icon: '⚙️' },
    { value: 'protection', label: 'Protection Devices', icon: '⚡' },
    { value: 'tools-equipment', label: 'Tools & Equipment', icon: '🧰' },
    { value: 'smart-devices', label: 'Smart Devices', icon: '📡' },
    { value: 'batteries-power', label: 'Batteries & Power', icon: '🔋' },
    { value: 'house-fitting', label: 'House Fitting', icon: '🏠' },
    { value: 'tv-internet', label: 'TV & Internet', icon: '📺' },
    { value: 'miscellaneous', label: 'Miscellaneous', icon: '🔔' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Category changed to:', selectedCategory);
    console.log('Total products:', products.length);
    
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
      console.log('Showing all products:', products.length);
    } else {
      const filtered = products.filter(p => p.category === selectedCategory);
      setFilteredProducts(filtered);
      console.log(`Filtered products for ${selectedCategory}:`, filtered.length);
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/products?limit=100`);
      console.log('Fetched products:', data.data);
      console.log('Total products:', data.data.length);
      setProducts(data.data);
      setFilteredProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to load products. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowBuyForm(true);
  };

  const handleWhatsAppOrder = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill name and phone');
      return;
    }

    const msg = `Order: ${selectedProduct.name}, Price: Rs.${selectedProduct.price}, Customer: ${customerDetails.name}, Phone: ${customerDetails.phone}`;
    const url = `https://wa.me/919012675213?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    
    setShowBuyForm(false);
    setCustomerDetails({ name: '', phone: '', address: '' });
  };

  const handleCallOrder = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill name and phone');
      return;
    }

    alert(`📞 Calling Admin...\n\nPlease tell:\nProduct: ${selectedProduct.name}\nYour Name: ${customerDetails.name}\nYour Phone: ${customerDetails.phone}`);
    window.location.href = 'tel:9012675213';
    
    setShowBuyForm(false);
    setCustomerDetails({ name: '', phone: '', address: '' });
  };

  const handleSMSOrder = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill name and phone');
      return;
    }

    const msg = `Order: ${selectedProduct.name}, Price: Rs.${selectedProduct.price}, Customer: ${customerDetails.name}, Phone: ${customerDetails.phone}`;
    window.location.href = `sms:9012675213?body=${encodeURIComponent(msg)}`;
    
    setShowBuyForm(false);
    setCustomerDetails({ name: '', phone: '', address: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>🛒 Electrical Products Shop</h1>
        <p>Quality electrical products at best prices</p>
      </div>

      <div style={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat.value}
            style={{
              ...styles.categoryBtn,
              ...(selectedCategory === cat.value ? styles.categoryBtnActive : {})
            }}
            onClick={() => setSelectedCategory(cat.value)}
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Loading products...</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product._id} style={styles.card}>
              {product.featured && <div style={styles.featuredBadge}>⭐ Featured</div>}
              
              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  style={styles.productImage}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                />
              )}
              
              <div style={styles.cardBody}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.brand}>{product.brand}</p>
                <p style={styles.description}>{product.description}</p>
                
                <div style={styles.priceSection}>
                  <span style={styles.price}>₹{product.price}</span>
                  <span style={styles.stock}>
                    {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
                  </span>
                </div>

                <div style={styles.actions}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    style={styles.buyBtn}
                    onClick={() => handleBuyNow(product)}
                    disabled={product.stock === 0}
                  >
                    💳 Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <p style={styles.noProducts}>No products found in this category</p>
      )}

      {showBuyForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>📦 Order: {selectedProduct.name}</h2>
              <button style={styles.closeBtn} onClick={() => setShowBuyForm(false)}>✕</button>
            </div>

            <div style={styles.form}>
              <div style={styles.productInfo}>
                <p><strong>Product:</strong> {selectedProduct.name}</p>
                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              </div>

              <input
                type="text"
                placeholder="Your Name *"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                style={styles.input}
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                style={styles.input}
                maxLength="10"
              />

              <textarea
                placeholder="Delivery Address (Optional)"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                style={styles.textarea}
                rows="3"
              />

              <h3 style={{marginTop: '1.5rem', marginBottom: '1rem'}}>Choose Order Method:</h3>

              <button onClick={handleWhatsAppOrder} style={{...styles.submitBtn, background: '#25D366', marginBottom: '0.5rem'}}>
                📱 Order via WhatsApp
              </button>

              <button onClick={handleCallOrder} style={{...styles.submitBtn, background: '#4CAF50', marginBottom: '0.5rem'}}>
                📞 Call to Order (9012675213)
              </button>

              <button onClick={handleSMSOrder} style={{...styles.submitBtn, background: '#2196F3'}}>
                💬 Order via SMS
              </button>

              <p style={{textAlign: 'center', fontSize: '0.85rem', color: '#718096', marginTop: '1rem'}}>
                Admin: 9012675213
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px' },
  categories: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center' },
  categoryBtn: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '25px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' },
  categoryBtnActive: { background: '#667eea', color: 'white', borderColor: '#667eea' },
  categoryIcon: { fontSize: '1.2rem' },
  loading: { textAlign: 'center', fontSize: '1.2rem', color: '#718096' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative', transition: 'transform 0.3s', cursor: 'pointer' },
  featuredBadge: { position: 'absolute', top: '10px', right: '10px', background: '#fbbf24', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', zIndex: 1 },
  productImage: { width: '100%', height: '200px', objectFit: 'cover' },
  cardBody: { padding: '1.5rem' },
  productName: { fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2d3748' },
  brand: { color: '#667eea', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' },
  description: { color: '#718096', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' },
  priceSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' },
  price: { fontSize: '1.5rem', fontWeight: '700', color: '#48bb78' },
  stock: { fontSize: '0.8rem', color: '#718096' },
  actions: { display: 'flex', gap: '0.5rem' },
  cartBtn: { flex: 1, padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  buyBtn: { flex: 1, padding: '0.75rem', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  noProducts: { textAlign: 'center', fontSize: '1.2rem', color: '#718096', marginTop: '3rem' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096' },
  form: { padding: '1.5rem' },
  productInfo: { background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' },
  submitBtn: { width: '100%', padding: '1rem', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }
};

export default ProductsPage;
