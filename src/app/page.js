"use client";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gray-900">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
          Fast, Safe & Reliable Bus Booking
        </h2>
        <p className="text-lg md:text-xl mb-6 text-gray-300">
          Travel smart with DK Movers. Book your seat now!
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-center text-sm py-4">
        <div className="mb-2">
          <span className="text-yellow-400 font-semibold">DK Movers</span> © {new Date().getFullYear()} All Rights Reserved
        </div>
        <div className="space-x-4">
          <a href="tel:+923001234567" className="hover:text-yellow-400">📞 Call</a>
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">💬 WhatsApp</a>
          <a href="https://facebook.com/dkmovers" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">📘 Facebook</a>
          <a href="https://instagram.com/dkmovers" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">📸 Instagram</a>
        </div>
      </footer>
    </div>
  );
}
