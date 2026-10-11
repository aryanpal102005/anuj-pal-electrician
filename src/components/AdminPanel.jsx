import React, { useState, useEffect } from 'react';
import API from '../api/config';

const categories = [['wiring-cable','Wires & cables'],['lighting','Lights'],['switches-boards','Switches'],['fans-cooling','Fans'],['heating','Heating'],['motors-pumps','Motors & pumps'],['protection','MCB & safety'],['tools-equipment','Tools'],['smart-devices','Smart devices'],['batteries-power','Batteries & power'],['house-fitting','Fittings'],['tv-internet','TV & internet'],['miscellaneous','Accessories']];

function AdminPanel({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: [] });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchProducts();
    }
  }, [isAdminLoggedIn]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products?limit=100');
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminEmail === 'admin@electrician.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminEmail('');
      setAdminPassword('');
      alert('✅ Admin login successful!');
    } else {
      alert('❌ Invalid email or password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setEditingProductId(null);
    setEditingProduct(null);
    alert('✅ Logged out successfully!');
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseInt(newProduct.price),
        category: newProduct.category,
        brand: newProduct.brand || 'Generic',
        stock: parseInt(newProduct.stock) || 0,
        images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : ['https://placehold.co/640x480/eaf3ff/123b70?text=Electrical+Shop']
      };

      const { data } = await API.post('/products', productData);
      setProducts([...products, data.data]);
      setNewProduct({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: [] });
      alert('✅ Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.response?.data?.message || error.message));
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditingProduct({ ...product });
    setEditImagePreview(product.images?.[0] || '');
  };

  const updateProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: parseInt(editingProduct.price),
        category: editingProduct.category,
        brand: editingProduct.brand || 'Generic',
        stock: parseInt(editingProduct.stock) || 0,
        images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://placehold.co/640x480/eaf3ff/123b70?text=Electrical+Shop']
      };

      const { data } = await API.put(`/products/${editingProductId}`, productData);
      setProducts(products.map(p => p._id === editingProductId ? data.data : p));
      setEditingProductId(null);
      setEditingProduct(null);
      alert('✅ Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        alert('✅ Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct(null);
    setEditImagePreview('');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="container">
        <h2 className="section-title">👑 Admin Login</h2>
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <h3>Admin Access Required</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Please login with admin credentials to manage products and services.</p>
          
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            style={{ width: '100%', padding: '0.7rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
          />
          
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={{ width: '100%', padding: '0.7rem', marginBottom: '1.5rem', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
          />
          
          <button
            onClick={handleAdminLogin}
            style={{
              width: '100%',
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            🔐 Login
          </button>
          
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
            <strong>Demo Credentials:</strong><br/>
            Email: admin@electrician.com<br/>
            Password: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title">👑 Admin Panel</h2>
        <button
          onClick={handleAdminLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Add New Product Section */}
      <div className="card">
        <h3>➕ Add New Product</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Product Name *" 
            value={newProduct.name} 
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
            style={{ padding: '0.5rem' }} 
          />
          <input 
            type="text" 
            placeholder="Brand" 
            value={newProduct.brand} 
            onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} 
            style={{ padding: '0.5rem' }} 
          />
          <input 
            type="number" 
            placeholder="Price (₹) *" 
            value={newProduct.price} 
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
            style={{ padding: '0.5rem' }} 
          />
          <select 
            value={newProduct.category} 
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
            style={{ padding: '0.5rem' }}
          >
            <option value="">Select Category *</option>
            {categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Stock" 
            value={newProduct.stock} 
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
            style={{ padding: '0.5rem' }} 
          />
          <input 
            type="text" 
            placeholder="Image URL" 
            value={newProduct.images.join(',')} 
            onChange={(e) => {
              const url = e.target.value;
              setNewProduct({...newProduct, images: url ? [url] : []});
              setImagePreview(url);
            }} 
            style={{ padding: '0.5rem' }} 
          />
        </div>
        {imagePreview && (
          <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#666' }}>Image Preview:</p>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} onError={(e) => e.target.src = 'https://placehold.co/150x150'} />
          </div>
        )}
        <textarea 
          placeholder="Description" 
          value={newProduct.description} 
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', minHeight: '80px', fontFamily: 'inherit' }}
        />
        <button 
          className="submit-btn" 
          onClick={addProduct}
          style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ➕ Add Product
        </button>
      </div>

      {/* Manage Products Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>📦 Manage Products {loading && '(Loading...)'}</h3>
        {products.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No products found. Add your first product above!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Image</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Brand</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Stock</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <img 
                        src={product.images?.[0] || 'https://placehold.co/50x50'} 
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => e.target.src = 'https://placehold.co/50x50'}
                      />
                    </td>
                    <td style={{ padding: '0.8rem' }}>{product.name}</td>
                    <td style={{ padding: '0.8rem' }}>{product.brand || 'N/A'}</td>
                    <td style={{ padding: '0.8rem' }}>₹{product.price}</td>
                    <td style={{ padding: '0.8rem' }}>{product.category}</td>
                    <td style={{ padding: '0.8rem' }}>{product.stock}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => startEditProduct(product)}
                        style={{ background: '#ffc107', color: '#333', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontWeight: 'bold' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProductId && editingProduct && (
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
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>✏️ Edit Product</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="Product Name *" 
                value={editingProduct.name} 
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
                style={{ padding: '0.5rem' }} 
              />
              <input 
                type="text" 
                placeholder="Brand" 
                value={editingProduct.brand} 
                onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})} 
                style={{ padding: '0.5rem' }} 
              />
              <input 
                type="number" 
                placeholder="Price (₹) *" 
                value={editingProduct.price} 
                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} 
                style={{ padding: '0.5rem' }} 
              />
              <select 
                value={editingProduct.category} 
                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} 
                style={{ padding: '0.5rem' }}
              >
                <option value="">Select Category *</option>
                {categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
              <input 
                type="number" 
                placeholder="Stock" 
                value={editingProduct.stock} 
                onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} 
                style={{ padding: '0.5rem' }} 
              />
              <input 
                type="text" 
                placeholder="Image URL" 
                value={editingProduct.images?.join(',') || ''} 
                onChange={(e) => {
                  const url = e.target.value;
                  setEditingProduct({...editingProduct, images: url ? [url] : []});
                  setEditImagePreview(url);
                }} 
                style={{ padding: '0.5rem' }} 
              />
            </div>
            {editImagePreview && (
              <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#666' }}>Image Preview:</p>
                <img src={editImagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} onError={(e) => e.target.src = 'https://placehold.co/150x150'} />
              </div>
            )}
            <textarea 
              placeholder="Description" 
              value={editingProduct.description} 
              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} 
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', minHeight: '80px', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={updateProduct}
                style={{ flex: 1, background: '#28a745', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✅ Save Changes
              </button>
              <button 
                onClick={cancelEdit}
                style={{ flex: 1, background: '#6c757d', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
