import React, { useState } from 'react';

const initialReviews = [
  { name: 'Rajesh Kumar', rating: 5, comment: 'Excellent service! Fixed my washing machine quickly.', date: '2024-01-15' },
  { name: 'Priya Singh', rating: 4, comment: 'Good quality products at reasonable price.', date: '2024-01-20' },
  { name: 'Amit Sharma', rating: 5, comment: 'Best electrician in town! Highly recommended.', date: '2024-01-25' },
];

function CustomerReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  const addReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviews([{ ...newReview, date: new Date().toISOString().split('T')[0] }, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
    alert('✅ Review added! Thank you for your feedback.');
  };

  return (
    <div className="container">
      <h2 className="section-title">⭐ Customer Reviews</h2>
      <div className="grid">
        <div className="card">
          <h3>Write a Review</h3>
          <form onSubmit={addReview}>
            <input type="text" placeholder="Your Name" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} className="form-group" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
            <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="form-group" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}>
              {[5,4,3,2,1].map(r => <option key={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
            <textarea placeholder="Your experience..." value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} rows="3" className="form-group" style={{ width: '100%', marginBottom: '0.5rem' }}></textarea>
            <button type="submit" className="submit-btn">Submit Review</button>
          </form>
        </div>
        <div>
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="rating">{'⭐'.repeat(review.rating)}</div>
              <strong>{review.name}</strong> - <small>{review.date}</small>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerReviews;