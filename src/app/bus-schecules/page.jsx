'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import BookingModal from '@/app/components/BookingModal';

const cities = [
  "Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta",
  "Multan", "Faisalabad", "Hyderabad", "Rawalpindi", "Sialkot"
];

export default function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [infoBus, setInfoBus] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    let unsub;

    const fetchBuses = () => {
      if (!from || !to || !date) return;

      setLoading(true);
      const q = query(
        collection(db, 'buses'),
        where('routeFrom', '==', from),
        where('routeTo', '==', to),
        where('date', '==', date)
      );

      unsub = onSnapshot(q, (snap) => {
        const results = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBuses(results);
        setLoading(false);
        setSearched(true);
      });
    };

    fetchBuses();

    return () => {
      if (unsub) unsub();
    };
  }, [from, to, date]);

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert('Please fill all fields.');
      return;
    }
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          🚌 Book Your Bus Ticket
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <select value={from} onChange={e => setFrom(e.target.value)} className="bg-gray-900 text-white border border-gray-600 rounded px-4 py-2">
            <option value="">From</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          <select value={to} onChange={e => setTo(e.target.value)} className="bg-gray-900 text-white border border-gray-600 rounded px-4 py-2">
            <option value="">To</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-gray-900 text-white border border-gray-600 rounded px-4 py-2" />
          <button onClick={handleSearch} className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition">
            Search
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        {loading && <div className="text-center text-gray-400 py-4">Loading buses...</div>}

        {!loading && searched && buses.length === 0 && (
          <div className="text-center text-red-400 font-semibold py-4">
            ❌ No buses found on this route/day
          </div>
        )}

        {!loading && buses.length > 0 && (
          <div className="space-y-6">
            {buses.map(bus => {
              const booked = Array.isArray(bus.bookedSeats) ? bus.bookedSeats.length : 0;
              const available = bus.totalSeats - booked;

              return (
                <div key={bus.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="text-xl font-semibold text-yellow-400">
                        {bus.departureTime} → {bus.arrivalTime}
                      </div>
                      <div className="text-sm text-gray-400">{bus.busType}</div>
                      <div className="text-sm text-gray-400 mt-1">{bus.routeFrom} → {bus.routeTo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-300">Rs. {bus.price}</div>
                      <div className="text-sm text-gray-400">
                        Available Seats: {available}
                      </div>
                      <button
                        className="mt-2 bg-yellow-400 text-black font-medium px-4 py-1 rounded hover:bg-yellow-300 transition"
                        onClick={() => setInfoBus(bus)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Seat info popup */}
      {infoBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-sm border border-gray-600">
            <h2 className="text-lg font-bold mb-4 text-yellow-400">🪑 Bus Seat Info</h2>
            <p className="text-sm mb-2">
              <strong>Available Seats:</strong>{' '}
              {infoBus.totalSeats - (Array.isArray(infoBus.bookedSeats) ? infoBus.bookedSeats.length : 0)}
            </p>
            <p className="text-sm mb-4">
              <strong>Booked Seats:</strong>{' '}
              {Array.isArray(infoBus.bookedSeats) && infoBus.bookedSeats.length > 0
                ? infoBus.bookedSeats.join(', ')
                : 'None'}
            </p>
            <button
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
              onClick={() => {
                setSelectedBus(infoBus);
                setInfoBus(null);
              }}
            >
              Proceed to Booking
            </button>
            <button
              className="w-full mt-2 border border-yellow-400 text-yellow-400 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
              onClick={() => setInfoBus(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Booking modal */}
      {selectedBus && (
        <BookingModal
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
        />
      )}
    </div>
  );
}
