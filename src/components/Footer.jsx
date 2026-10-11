import React from 'react';

function Footer({ onNavigate }) {
  const handleCall = () => {
    window.location.href = 'tel:+919012675213';
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/anujkumar7488', '_blank');
  };

  const handleFacebook = () => {
    window.open('https://www.facebook.com/profile.php?id=100010328017221', '_blank');
  };

  return (
    <footer className="footer">
      <div className="page-width footer-grid">
        <div>
          <h2>⚡ Electrical Shop</h2>
          <p>Quality electrical products for every home and project.</p>
          <p>© 2026 Anuj Pal Electrician.All rights reserved.</p>
        </div>
        
        <div>
          <b>Quick links</b>
          <button onClick={() => onNavigate?.('products')}>Products</button>
          <button onClick={() => onNavigate?.('services')}>Services</button>
          <button onClick={() => onNavigate?.('faq')}>FAQ</button>
          <button onClick={() => onNavigate?.('contact')}>Contact</button>
          <button onClick={() => onNavigate?.('privacy')}>Privacy Policy</button>
        </div>
        
        <div>
          <b>Contact</b>
          <button 
            onClick={handleCall}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              padding: 0,
              fontSize: '1rem'
            }}
          >
            📞 +91 9012675213
          </button>
          
          <span>📍Village : Puranpur Salhapur<br />Post office : Garhmeerpur <br/> District : Haridwar<br/>State : Uttarakhand</span>
        </div>
        
        <div>
          <b>Follow us</b>
          <button
            onClick={handleFacebook}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              padding: 0,
              fontSize: '1rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            👍 Facebook
          </button>
          <button
            onClick={handleInstagram}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              padding: 0,
              fontSize: '1rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            📸 Instagram
          </button>
          <a href="https://wa.me/919012675213" target="_blank" rel="noreferrer" style={{ display: 'block' }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
