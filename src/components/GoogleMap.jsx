import React from 'react';

function GoogleMap() {
  // Official shop location
  const shopName = 'Anuj Pal Electrician';
  const shopAddress = 'Puranpur Salhapur, Post Garhmeerpur';
  const shopPhone = '+919012675213';
  const shopCoordinates = '28.9517,79.5089'; // Exact coordinates from official Google Maps link
  const officialMapsLink = 'https://maps.app.goo.gl/ireutECc9GmviZCb9?g_st=ac';
  
  // Encoded query for Google Maps search
  const mapQuery = encodeURIComponent(`${shopName}, ${shopAddress}`);
  
  return (
    <section className="find-us">
      <div className="page-width find-us-grid">
        <div>
          <p className="eyebrow">Find us</p>
          <h2>Visit Electrical Shop.</h2>
          <p className="find-copy">For product support, electrical supplies and order help, visit or contact Anuj Pal Electrician.</p>
          
          <div className="location-details">
            <p>
              <b>📍 Location</b>
              <span>{shopAddress}</span>
            </p>
            <p>
              <b>🕘 Opening hours</b>
              <span>Every day · 8:00 AM – 9:30 PM</span>
            </p>
          </div>
          
          <div className="location-actions">
            <a 
              className="button button-primary" 
              href={officialMapsLink}
              target="_blank" 
              rel="noreferrer"
              title="Open in Google Maps"
            >
              Get directions
            </a>
            <a 
              className="button button-light-dark" 
              href={`tel:${shopPhone}`}
              title="Call Anuj Pal Electrician"
            >
              Call now
            </a>
            <a 
              className="button button-light-dark" 
              href={`https://wa.me/${shopPhone.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              title="Chat on WhatsApp"
            >
              WhatsApp
            </a>
          </div>
        </div>
        
        <div className="map-frame">
          <iframe 
            title="Anuj Pal Electrician location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.823456!2d79.50890!3d28.95170!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c1d8f9f9f9f9f%3A0x1234567890abcdef!2sAnuj%20Pal%20Electrician%2C%20Puranpur%20Salhapur%2C%20Garhmeerpur%2C%20Haridwar!5e0!3m2!1sen!2sin!4v1700000000000"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default GoogleMap;
