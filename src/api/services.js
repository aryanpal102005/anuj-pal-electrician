import API from './config';

// Authentication services
export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await API.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await API.post('/users/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await API.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await API.put('/users/profile', userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await API.put('/users/password', passwordData);
    return response.data;
  },

  // Get wallet balance
  getWalletBalance: async () => {
    const response = await API.get('/users/wallet');
    return response.data;
  },
};

// Product services
export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeatured: async () => {
    const response = await API.get('/products/featured');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await API.get('/products/categories');
    return response.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },
};

// Cart services
export const cartService = {
  // Get user cart
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (itemData) => {
    const response = await API.post('/cart/add', itemData);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await API.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  // Update cart item quantity
  updateQuantity: async (productId, quantity) => {
    const response = await API.put(`/cart/update/${productId}`, { quantity });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await API.delete('/cart/clear');
    return response.data;
  },

  // Get cart count
  getCartCount: async () => {
    const response = await API.get('/cart/count');
    return response.data;
  },
};

// Order services
export const orderService = {
  // Get user orders
  getOrders: async (params = {}) => {
    const response = await API.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await API.put(`/orders/${id}/cancel`, { cancellationReason: reason });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await API.get('/orders/stats');
    return response.data;
  },
};

// Recharge services
export const rechargeService = {
  // Get recharge history
  getRecharges: async (params = {}) => {
    const response = await API.get('/recharge', { params });
    return response.data;
  },

  // Create recharge (mobile/DTH/datacard/wallet)
  createRecharge: async (rechargeData) => {
    const response = await API.post('/recharge', rechargeData);
    return response.data;
  },

  // Get single recharge
  getRecharge: async (id) => {
    const response = await API.get(`/recharge/${id}`);
    return response.data;
  },

  // Get recharge statistics
  getRechargeStats: async () => {
    const response = await API.get('/recharge/stats');
    return response.data;
  },
};

// Admin services
export const adminService = {
  // Get dashboard stats
  getDashboard: async () => {
    const response = await API.get('/admin/dashboard');
    return response.data;
  },

  // Get all users
  getUsers: async (params = {}) => {
    const response = await API.get('/admin/users', { params });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await API.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  // Get all orders
  getAllOrders: async (params = {}) => {
    const response = await API.get('/admin/orders', { params });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, statusData) => {
    const response = await API.put(`/admin/orders/${id}/status`, statusData);
    return response.data;
  },

  // Get all recharges
  getAllRecharges: async (params = {}) => {
    const response = await API.get('/admin/recharges', { params });
    return response.data;
  },

  // Approve recharge
  approveRecharge: async (id) => {
    const response = await API.put(`/admin/recharges/${id}/approve`);
    return response.data;
  },

  // Reject recharge
  rejectRecharge: async (id, reason) => {
    const response = await API.put(`/admin/recharges/${id}/reject`, { reason });
    return response.data;
  },
};

// Booking services
export const bookingService = {
  // Create booking (no auth required)
  createBooking: async (bookingData) => {
    const response = await API.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getBookings: async (params = {}) => {
    const response = await API.get('/bookings', { params });
    return response.data;
  },

  // Get single booking
  getBookingById: async (id) => {
    const response = await API.get(`/bookings/${id}`);
    return response.data;
  },

  // Get bookings by phone
  getBookingsByPhone: async (phone) => {
    const response = await API.get(`/bookings/phone/${phone}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, data) => {
    const response = await API.put(`/bookings/${id}/cancel`, data);
    return response.data;
  },

  // Get booking stats
  getBookingStats: async () => {
    const response = await API.get('/bookings/stats');
    return response.data;
  },
};

// Service services
export const serviceService = {
  // Get all services
  getServices: async (params = {}) => {
    const response = await API.get('/services', { params });
    return response.data;
  },

  // Get single service
  getServiceById: async (id) => {
    const response = await API.get(`/services/${id}`);
    return response.data;
  },

  // Get service by slug
  getServiceBySlug: async (slug) => {
    const response = await API.get(`/services/slug/${slug}`);
    return response.data;
  },

  // Get featured services
  getFeaturedServices: async () => {
    const response = await API.get('/services/featured');
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category) => {
    const response = await API.get(`/services/category/${category}`);
    return response.data;
  },
};

// Review services
export const reviewService = {
  // Get reviews
  getReviews: async (params = {}) => {
    const response = await API.get('/reviews', { params });
    return response.data;
  },

  // Get featured reviews
  getFeaturedReviews: async () => {
    const response = await API.get('/reviews/featured');
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await API.post('/reviews', reviewData);
    return response.data;
  },

  // Get single review
  getReviewById: async (id) => {
    const response = await API.get(`/reviews/${id}`);
    return response.data;
  },
};
