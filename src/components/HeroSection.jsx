import React from 'react';

function HeroSection({ onShop, onService }) {
  return (
    <section className="store-hero">
      <div className="page-width hero-content">
        <div>
          <p className="eyebrow">Trusted electrical supplies & service</p>
          <h1>Everything electrical,<br /><em>made simple.</em></h1>
          <p className="hero-copy">Shop reliable products for your home, or book a qualified electrician for the job.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={onShop}>Shop products</button>
            <button className="button button-light" onClick={onService}>Book a service</button>
          </div>
          <div className="hero-trust"><span>✓ Quality products</span><span>✓ Expert service</span><span>✓ Secure checkout</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-glow"></div><span className="bulb">💡</span><span className="bolt">⚡</span>
          <div className="hero-card"><b>20+ Years</b><small>of trusted service</small></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
