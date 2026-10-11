import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    featured: false
  });

  const categories = [
    { value: 'wiring-cable', label: '🔌 Wiring & Cable Products' },
    { value: 'lighting', label: '💡 Lighting Products' },
    { value: 'switches-boards', label: '🔘 Switches & Boards' },
    { value: 'fans-cooling', label: '🌀 Fans & Cooling' },
    { value: 'heating', label: '🔥 Heating Appliances' },
    { value: 'motors-pumps', label: '⚙️ Motors & Pumps' },
    { value: 'protection', label: '⚡ Protection Devices' },
    { value: 'tools-equipment', label: '🧰 Tools & Equipment' },
    { value: 'smart-devices', label: '📡 Smart & Advanced Devices' },
    { value: 'batteries-power', label: '🔋 Batteries & Power Backup' },
    { value: 'house-fitting', label: '🏠 House Fitting Materials' },
    { value: 'tv-internet', label: '📺 TV & Internet Accessories' },
    { value: 'miscellaneous', label: '🔔 Miscellaneous' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/products?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data.data);
    } catch (error) {
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting form:', formData);
    console.log('Editing product:', editingProduct);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login as admin first');
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingProduct) {
        console.log('Updating product:', editingProduct._id);
        const response = await axios.put(`${API_URL}/products/${editingProduct._id}`, formData, config);
        console.log('Update response:', response.data);
        alert('✅ Product updated successfully!');
      } else {
        console.log('Creating new product');
        const response = await axios.post(`${API_URL}/products`, formData, config);
        console.log('Create response:', response.data);
        alert('✅ Product added successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      featured: product.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      featured: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📦 Product Management</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          
          <input
            type="text"
            placeholder="Product Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            required
          />

          <textarea
            placeholder="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.textarea}
            required
          />

          <div style={styles.row}>
            <input
              type="number"
              placeholder="Price (₹) *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={styles.input}
              required
            />

            <input
              type="number"
              placeholder="Stock *"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.row}>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={styles.select}
              required
            >
              <option value="">Select Category *</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Brand *"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <span>Featured Product</span>
          </label>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Saving...' : (editingProduct ? '✅ Update Product' : '✅ Add Product')}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <div key={product._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>{product.name}</h3>
                {product.featured && <span style={styles.badge}>⭐ Featured</span>}
              </div>
              <p style={styles.desc}>{product.description}</p>
              <div style={styles.details}>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Category:</strong> {product.category}</p>
              </div>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEdit(product)}>
                  ✏️ Edit
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(product._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  addBtn: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  form: { background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem', minHeight: '100px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  checkbox: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' },
  submitBtn: { width: '100%', padding: '1rem', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  badge: { background: '#fbbf24', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' },
  desc: { color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' },
  details: { marginBottom: '1rem', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: { flex: 1, padding: '0.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { flex: 1, padding: '0.5rem', background: '#f56565', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default AdminProducts;
