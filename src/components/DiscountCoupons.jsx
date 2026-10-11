import React from 'react';

const coupons = [
  { code: 'FIRST10', discount: '₹10 OFF', min: '₹100' },
  { code: 'SAVE50', discount: '₹50 OFF', min: '₹500' },
  { code: 'FREESHIP', discount: 'Free Shipping', min: '₹999' },
  { code: 'REPAIR20', discount: '20% OFF on Repair', min: 'Any repair' },
];

function DiscountCoupons() {
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon ${code} copied! Use at checkout.`);
  };

  return (
    <div className="container">
      <h2 className="section-title">🎟️ Discount Coupons</h2>
      <div className="coupons-grid">
        {coupons.map((coupon, index) => (
          <div className="coupon-card" key={index} onClick={() => copyCode(coupon.code)}>
            <h3>{coupon.code}</h3>
            <p>{coupon.discount}</p>
            <small>Min. Order: {coupon.min}</small>
            <p>📋 Click to copy</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscountCoupons;