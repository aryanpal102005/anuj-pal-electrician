import React, { useState } from 'react';

function ProductCatalog({ products, addToCart }) {
  const [category, setCategory] = useState('all');
  
  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);

  return (
    <div className="container">
      <h2 className="section-title">🛒 Shop Electrical Products</h2>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button className="submit-btn" onClick={() => setCategory('all')} style={{ margin: '0 5px' }}>All</button>
        <button className="submit-btn" onClick={() => setCategory('wire')} style={{ margin: '0 5px' }}>🔌 Wires</button>
        <button className="submit-btn" onClick={() => setCategory('bulb')} style={{ margin: '0 5px' }}>💡 Bulbs</button>
        <button className="submit-btn" onClick={() => setCategory('fan')} style={{ margin: '0 5px' }}>🌀 Fans</button>
        <button className="submit-btn" onClick={() => setCategory('switch')} style={{ margin: '0 5px' }}>🔘 Switches</button>
      </div>
      <div className="grid">
        {filteredProducts.map(product => (
          <div className="card" key={product.id} style={{ overflow: 'hidden' }}>
            {/* Product Image */}
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '1rem'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.name);
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                borderRadius: '8px 8px 0 0',
                marginBottom: '1rem'
              }}>
                {product.image || '📦'}
              </div>
            )}
            
            {/* Product Details */}
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
              {product.brand && (
                <p style={{ color: '#667eea', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}
              <p className="price" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#48bb78', marginBottom: '0.5rem' }}>
                ₹{product.price}
              </p>
              <p style={{ color: product.stock > 0 ? '#48bb78' : '#e53e3e', marginBottom: '1rem' }}>
                {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
              </p>
              <button 
                className="add-to-cart" 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                style={{
                  width: '100%',
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {product.stock > 0 ? 'Add to Cart 🛒' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;