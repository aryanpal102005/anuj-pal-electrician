import React, { useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const currency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

function Cart({ cart, removeFromCart, updateQuantity, onCheckout, onShop }) {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const summary = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedCoupon?.discount || 0;
    const shipping = 0;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }, [cart, appliedCoupon]);
  const applyCoupon = async () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const { data } = await axios.get(`${API_URL}/coupons/validate`, { params: { code: coupon, subtotal } });
      setAppliedCoupon(data.data); setCouponMessage(`${data.data.code} applied — save ${currency(data.data.discount)}.`);
    } catch (error) {
      setAppliedCoupon(null); setCouponMessage(error.response?.data?.message || 'Coupon could not be validated.');
    }
  };

  if (!cart.length) return <section className="page-width empty-cart"><span>🛒</span><h1>Your cart is empty</h1><p>Browse electrical products and add what you need.</p><button className="button button-primary" onClick={onShop}>Shop products</button></section>;
  return <section className="page-width cart-page"><div className="cart-heading"><div><p className="eyebrow">Your shopping cart</p><h1>Ready when you are.</h1></div><button className="link-button" onClick={onShop}>Continue shopping →</button></div><div className="cart-layout"><div className="cart-items">{cart.map((item) => <article className="cart-row" key={item.id}><img src={item.image || 'https://placehold.co/160x120/eaf3ff/123b70?text=Product'} alt="" onError={(event) => { event.currentTarget.src = 'https://placehold.co/160x120/eaf3ff/123b70?text=Product'; }} /><div className="cart-product"><h2>{item.name}</h2><p>{currency(item.price)} each</p><button onClick={() => removeFromCart(item.id)}>Remove</button></div><div className="quantity-control"><button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}>+</button></div><strong className="cart-line-total">{currency(item.price * item.quantity)}</strong></article>)}</div><aside className="cart-summary"><h2>Order summary</h2><div className="coupon-box"><label htmlFor="coupon">Discount coupon</label><div><input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Enter code" /><button onClick={applyCoupon}>Apply</button></div>{couponMessage && <small className={appliedCoupon ? 'success-message' : 'error-message'}>{couponMessage}</small>}</div><div className="summary-lines"><p><span>Subtotal</span><b>{currency(summary.subtotal)}</b></p>{summary.discount > 0 && <p className="discount"><span>Coupon discount</span><b>−{currency(summary.discount)}</b></p>}<p><span>Delivery</span><b>{summary.shipping ? currency(summary.shipping) : 'Free'}</b></p><p className="summary-total"><span>Total</span><b>{currency(summary.total)}</b></p></div><button className="button button-primary checkout-button" onClick={() => onCheckout(summary)}>Proceed to checkout</button><small className="summary-note">Cash on Delivery, UPI and QR payment options available.</small></aside></div></section>;
}

export default Cart;
