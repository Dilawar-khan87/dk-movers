'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Left side - Logo or User Name */}
        <h1 className="text-2xl font-bold text-yellow-400">
          {user ? `👤 ${user.displayName || user.email}` : 'DK Movers'}
        </h1>

        {/* Desktop Links */}
        <div className="space-x-6 hidden md:flex text-white items-center">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <Link href="/bus-schecules" className="hover:text-yellow-400">Bus Schedules</Link>
          <Link href="/bus-routes" className="hover:text-yellow-400">Bus Routes</Link>
          <Link href="/reviews" className="hover:text-yellow-400">Reviews</Link>
          <Link href="/contact" className="hover:text-yellow-400">Contact Us</Link>
          {!user ? (
            <Link href="/login" className="hover:text-yellow-400">Signup/Login</Link>
          ) : (
            <button onClick={handleLogout} className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300 transition">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {menuOpen && (
        <div className="mt-4 space-y-3 md:hidden text-white flex flex-col">
          <Link href="/" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/bus-schecules" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Bus Schedules</Link>
          <Link href="/reviews" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Reviews</Link>
          <Link href="/contact" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          {!user ? (
            <Link href="/login" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Signup/Login</Link>
          ) : (
            <button onClick={handleLogout} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
