// 'use client';
// import { useState } from 'react';
// import { db } from '@/lib/firebase';
// import { addDoc, doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';

// export default function BookingModal({ bus, onClose }) {
//   const total = 10 * 4;
//   const booked = bus.bookedSeats || 0;
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [step, setStep] = useState('seat');
//   const [name, setName] = useState('');
//   const [contact, setContact] = useState('');
//   const [loading, setLoading] = useState(false);

//   const toggleSeat = (num) => {
//     if (selectedSeats.includes(num)) {
//       setSelectedSeats(selectedSeats.filter(s => s !== num));
//     } else if (selectedSeats.length < (total - booked)) {
//       setSelectedSeats([...selectedSeats, num]);
//     }
//   };

//   const placeBooking = async () => {
//     setLoading(true);
//     const totalFare = selectedSeats.length * bus.price;
//     const bRef = await addDoc(collection(db, 'bookings'), {
//       busId: bus.id,
//       name,
//       contact,
//       seats: selectedSeats,
//       totalFare,
//       createdAt: serverTimestamp()
//     });
//     await updateDoc(doc(db, 'buses', bus.id), {
//       bookedSeats: booked + selectedSeats.length
//     });
//     setLoading(false);
//     alert(`Booking confirmed! ID: ${bRef.id}`);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         {step === 'seat' && (
//           <>
//             <h2 className="text-lg font-semibold mb-4">Select Your Seats</h2>
//             <div className="grid grid-cols-4 gap-2">
//               {[...Array(total)].map((_, idx) => {
//                 const num = idx + 1;
//                 return (
//                   <label key={num} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedSeats.includes(num)}
//                       disabled={num <= booked}
//                       onChange={() => toggleSeat(num)}
//                       className="h-4 w-4 accent-blue-600"
//                     />
//                     <span>#{num}</span>
//                   </label>
//                 );
//               })}
//             </div>
//             <button
//               disabled={!selectedSeats.length}
//               onClick={() => setStep('info')}
//               className="btn-primary w-full mt-4"
//             >
//               Continue
//             </button>
//             <button onClick={onClose} className="btn-secondary w-full mt-2">Cancel</button>
//           </>
//         )}

//         {step === 'info' && (
//           <>
//             <h2 className="text-xl font-bold mb-4">Passenger Info</h2>
//             <p>Seats Selected: {selectedSeats.map(n => `#${n}`).join(', ')}</p>
//             <input
//               placeholder="Name"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               className="input-primary w-full mb-3"
//             />
//             <input
//               placeholder="Contact"
//               value={contact}
//               onChange={e => setContact(e.target.value)}
//               className="input-primary w-full mb-3"
//             />
//             <button
//               onClick={placeBooking}
//               disabled={loading}
//               className="btn-primary w-full"
//             >
//               {loading ? 'Booking...' : `Pay Rs. ${selectedSeats.length * bus.price}`}
//             </button>
//             <button onClick={() => setStep('seat')} className="btn-secondary w-full mt-2">Back</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';

export default function BookingModal({ bus, onClose }) {
  const total = 10 * 4;
  const bookedSeats = Array.isArray(bus.bookedSeats) ? bus.bookedSeats : []; // ensure it's an array

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState('seat');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSeat = (num) => {
    if (selectedSeats.includes(num)) {
      setSelectedSeats(selectedSeats.filter(s => s !== num));
    } else if (!bookedSeats.includes(num)) {
      setSelectedSeats([...selectedSeats, num]);
    }
  };

  const placeBooking = async () => {
    setLoading(true);
    const totalFare = selectedSeats.length * bus.price;

    const bRef = await addDoc(collection(db, 'bookings'), {
      busId: bus.id,
      name,
      contact,
      seats: selectedSeats,
      totalFare,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'buses', bus.id), {
      bookedSeats: [...bookedSeats, ...selectedSeats],
    });

    generatePDF({
      bookingId: bRef.id,
      name,
      contact,
      seats: selectedSeats,
      totalFare,
      bus,
    });

    setLoading(false);
    alert(`Booking confirmed! ID: ${bRef.id}`);
    onClose();
  };

  const generatePDF = ({ bookingId, name, contact, seats, totalFare, bus }) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('🎫 Bus Ticket', 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 35);
    doc.text(`Name: ${name}`, 20, 45);
    doc.text(`Contact: ${contact}`, 20, 55);
    doc.text(`Route: ${bus.routeFrom} → ${bus.routeTo}`, 20, 65);
    doc.text(`Date: ${bus.date}`, 20, 75);
    doc.text(`Seats: ${seats.join(', ')}`, 20, 85);
    doc.text(`Total Fare: Rs. ${totalFare}`, 20, 95);
    doc.save(`Ticket_${bookingId}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        {step === 'seat' && (
          <>
            <h2 className="text-lg font-semibold mb-2">Select Your Seats</h2>
            <p className="text-sm mb-4">
              <strong>Available Seats:</strong> {total - bookedSeats.length}
              <br />
              <strong>Booked Seats:</strong> {bookedSeats.join(', ')}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(total)].map((_, idx) => {
                const num = idx + 1;
                return (
                  <label key={num} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSeats.includes(num)}
                      disabled={bookedSeats.includes(num)}
                      onChange={() => toggleSeat(num)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>#{num}</span>
                  </label>
                );
              })}
            </div>
            <button
              disabled={!selectedSeats.length}
              onClick={() => setStep('info')}
              className="btn-primary w-full mt-4"
            >
              Continue
            </button>
            <button onClick={onClose} className="btn-secondary w-full mt-2">
              Cancel
            </button>
          </>
        )}

        {step === 'info' && (
          <>
            <h2 className="text-xl font-bold mb-4">Passenger Info</h2>
            <p>Seats Selected: {selectedSeats.map(n => `#${n}`).join(', ')}</p>
            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-primary w-full mb-3"
            />
            <input
              placeholder="Contact"
              value={contact}
              onChange={e => setContact(e.target.value)}
              className="input-primary w-full mb-3"
            />
            <button
              onClick={placeBooking}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Booking...' : `Pay Rs. ${selectedSeats.length * bus.price}`}
            </button>
            <button onClick={() => setStep('seat')} className="btn-secondary w-full mt-2">
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
