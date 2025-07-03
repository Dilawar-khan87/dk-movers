'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Get user profile data
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUserData(userDoc.data());

        // Get user bookings
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const userBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(userBookings);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

return (
  <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
        Welcome to Your Dashboard
      </h1>

      {userData && (
        <div className="mb-8">
          <p className="text-lg">
            <span className="text-yellow-300 font-semibold">Full Name:</span>{' '}
            {userData.fullName}
          </p>
          <p className="text-lg">
            <span className="text-yellow-300 font-semibold">Email:</span>{' '}
            {userData.email}
          </p>
          <p className="text-lg">
            <span className="text-yellow-300 font-semibold">City:</span>{' '}
            {userData.city}
          </p>
          <p className="text-lg">
            <span className="text-yellow-300 font-semibold">Phone:</span>{' '}
            {userData.phone}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/book')}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-md transition"
        >
          🚌 Book Your Seat
        </button>
      </div>

      <hr className="my-6 border-gray-700" />

      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">My Bookings</h2>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <p>
                <span className="font-semibold text-yellow-300">From:</span>{' '}
                {booking.routeFrom}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">To:</span>{' '}
                {booking.routeTo}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Date:</span>{' '}
                {booking.date}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Seat:</span>{' '}
                {booking.seatNumber}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Departure:</span>{' '}
                {booking.departureTime}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Arrival:</span>{' '}
                {booking.arrivalTime}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Price:</span>{' '}
                Rs {booking.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You have no bookings yet.</p>
      )}
    </div>
  </div>
);

}
