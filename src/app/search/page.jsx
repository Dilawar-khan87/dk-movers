'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SearchResultsPage() {
  const params = useSearchParams();
  const from = params.get('from');
  const to = params.get('to');
  const date = params.get('date');

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuses() {
      setLoading(true);
      const q = query(
        collection(db, 'buses'),
        where('routeFrom', '==', from),
        where('routeTo', '==', to),
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBuses(data);
      setLoading(false);
    }

    if (from && to && date) {
      fetchBuses();
    } else {
      setLoading(false);
    }
  }, [from, to, date]);

  if (loading) return <div className="p-6 text-center">Loading buses...</div>;

  if (!buses.length) {
    return <div className="p-6 text-center text-red-600 font-semibold">❌ No buses found on this route/day</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Available Buses: {from} → {to} on {date}
      </h2>
      <div className="space-y-4">
        {buses.map((bus) => (
          <div key={bus.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-lg font-semibold">
                  {bus.departureTime} → {bus.arrivalTime}
                </div>
                <div className="text-sm text-gray-600">{bus.busType}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">Rs. {bus.price}</div>
                <div className="text-sm text-gray-600">
                  Available: {bus.totalSeats - (bus.bookedSeats || 0)}
                </div>
              </div>
            </div>
            <button className="btn-primary mt-2">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
