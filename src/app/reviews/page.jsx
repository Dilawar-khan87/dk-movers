'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    message: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(fetched);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, city, message, rating } = form;
    if (!name || !email || !city || !message || rating === 0) {
      alert('Please fill all fields and select a rating.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm({ name: '', email: '', city: '', message: '', rating: 0 });
    } catch (err) {
      alert('Error submitting review.');
    }
    setLoading(false);
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
        Customer Reviews
      </h1>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg max-w-xl mx-auto mb-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none"
        />
        <textarea
          placeholder="Your message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none h-28 resize-none"
        />

        {/* Rating Stars */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Your Rating:</span>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`cursor-pointer text-2xl ${
                form.rating >= num ? 'text-yellow-400' : 'text-gray-600'
              }`}
              onClick={() => setForm({ ...form, rating: num })}
            >
              ★
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded w-full transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Customer Name:{review.name}</h3>
            <p className="text-sm text-gray-400 mb-2">City:{review.city}</p>
            <div className="mb-2 text-lg">Rating-
              {renderStars(review.rating || 0)}
            </div>
            <p className="text-gray-300 text-sm">Review:{review.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
