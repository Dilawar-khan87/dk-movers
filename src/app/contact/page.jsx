'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'contacts'), {
        ...form,
        timestamp: serverTimestamp(),
      });
      alert('✅ Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-10">📞 Contact DK Movers</h1>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none"
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="bg-gray-700 text-white px-4 py-2 rounded w-full outline-none resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-300 transition w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Google Map & Social Links */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.087419618727!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f93005cb7a7%3A0x5b47035e1cc5c8c6!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1658831658031"
              width="100%"
              height="250"
              className="rounded"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="text-white space-y-3">
              <p><strong>📍 Address:</strong> Karachi, Pakistan</p>
              <p><strong>📞 Phone:</strong> <a href="tel:+923000060404" className="text-yellow-400 hover:underline">+92 300 0060404</a></p>
              <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/923000060404" className="text-yellow-400 hover:underline">Chat on WhatsApp</a></p>
              <p><strong>🌐 Facebook:</strong> <a href="https://facebook.com" target="_blank" className="text-yellow-400 hover:underline">/DKMovers</a></p>
              <p><strong>📸 Instagram:</strong> <a href="https://instagram.com" target="_blank" className="text-yellow-400 hover:underline">@DKMovers</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
