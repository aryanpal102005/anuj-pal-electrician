import React, { useState, useEffect } from 'react';
import { productService } from '../../api/services';
import './ProductList.css';

function ProductListWithImages() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: '🛒 All Products' },
    { value: 'wiring-cable', label: '🔌 Wiring & Cable' },
    { value: 'lighting', label: '💡 Lighting' },
    { value: 'switches-boards', label: '🔘 Switches & Boards' },
    { value: 'fans-cooling', label: '🌀 Fans & Cooling' },
    { value: 'heating', label: '🔥 Heating' },
    { value: 'motors-pumps', label: '⚙️ Motors & Pumps' },
    { value: 'protection', label: '⚡ Protection' },
    { value: 'tools-equipment', label: '🧰 Tools & Equipment' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 100 });
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('⚠️ Please login to add items to cart');
        return;
      }

      await productService.addToCart({ productId: product._id, quantity: 1 });
      alert(`✅ ${product.name} added to cart!`);
    } catch (err) {
      alert('❌ Failed to add to cart: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ {error}</p>
        <button onClick={fetchProducts} className="retry-btn">🔄 Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Header */}
      <div className="product-header">
        <h1>🛒 Electrical Products Shop</h1>
        <p>Quality products at best prices</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search products by name, brand, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div className="products-count">
        <p>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>😕 No products found</p>
          <button onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }} className="reset-btn">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              {/* Featured Badge */}
              {product.featured && (
                <div className="featured-badge">⭐ Featured</div>
              )}

              {/* Product Image */}
              <div className="product-image-container">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    📦
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                
                <p className="product-brand">
                  <strong>Brand:</strong> {product.brand}
                </p>

                <p className="product-description">
                  {product.description.length > 80 
                    ? product.description.substring(0, 80) + '...' 
                    : product.description}
                </p>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="product-rating">
                    <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
                    <span className="rating-text">
                      {product.rating} ({product.numReviews} reviews)
                    </span>
                  </div>
                )}

                {/* Price & Stock */}
                <div className="product-footer">
                  <div className="price-section">
                    <span className="product-price">₹{product.price}</span>
                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListWithImages;
