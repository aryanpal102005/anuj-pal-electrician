import React, { useState, useEffect } from 'react';
import { productService } from '../../api/services';
import { usePagination } from '../../hooks/useApi';
import './ProductList.css';

const ProductList = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'createdAt',
    order: 'desc',
  });

  const {
    data: products,
    loading,
    error,
    pagination,
    loadPage,
    refresh,
  } = usePagination(productService.getProducts, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refresh();
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      // This would use cartService.addToCart
      // For now, just show an alert
      alert(`Added product ${productId} to cart!`);
    } catch (error) {
      alert('Error adding to cart: ' + error.message);
    }
  };

  if (loading && products.length === 0) {
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
        <p>Error loading products: {error}</p>
        <button onClick={refresh} className="btn btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        <form onSubmit={handleSearch} className="filters-form">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-row">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="wiring">Wiring</option>
              <option value="lighting">Lighting</option>
              <option value="tools">Tools</option>
              <option value="safety">Safety</option>
              <option value="appliances">Appliances</option>
              <option value="other">Other</option>
            </select>
            
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-row">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="filter-input"
            />
            
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="products-header">
          <h2>Products ({pagination.total})</h2>
          <div className="sort-controls">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="sort-select"
            >
              <option value="createdAt">Latest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-description">
                    {product.description.substring(0, 100)}...
                  </p>
                  
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-stock">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              onClick={() => loadPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <button
              onClick={() => loadPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
