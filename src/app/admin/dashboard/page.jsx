// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';

// export default function AdminDashboard() {
//   const [form, setForm] = useState({
//     routeFrom: '',
//     routeTo: '',
//     date: '',
//     departureTime: '',
//     arrivalTime: '',
//     price: '',
//     totalSeats: '',
//     busType: '',
//   });

//   const [buses, setBuses] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const router = useRouter();

//   const cities = [
//     "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Peshawar", "Islamabad",
//     "Quetta", "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", "Sheikhupura", "Rahim Yar Khan",
//     "Jhang", "Dera Ghazi Khan", "Gujrat", "Sahiwal", "Wah Cantt", "Mardan", "Kasur", "Okara", "Mingora",
//     "Nawabshah", "Chiniot", "Kotri", "Kamoke", "Hafizabad", "Sadiqabad", "Mirpur Khas", "Burewala",
//     "Kohat", "Khanewal", "Jacobabad", "Shikarpur", "Muzaffargarh", "Khanpur", "Gojra", "Bahawalnagar",
//     "Abbottabad", "Muridke", "Pakpattan", "Tando Adam", "Khairpur", "Jhelum", "Dera Ismail Khan",
//     "Chakwal", "Vehari", "Mandi Bahauddin", "Turbat", "Lodhran", "Nowshera", "Charsadda", "Kamalia",
//     "Daska", "Timergara", "Gujranwala", "Swabi", "Attock", "Tando Allahyar", "Kot Addu", "Jaranwala",
//     "Chaman", "Layyah", "Kharian", "Tando Muhammad Khan", "Shahdadkot", "Hangu", "Shahkot", "Narowal",
//     "Mansehra", "Dadu", "Badin", "Ghotki", "Jampur", "Umerkot", "Zhob", "Pattoki", "Haripur",
//     "Ahmedpur East", "Sanghar", "Tando Bago", "Tank", "Khuzdar", "Jatoi", "Mian Channu", "Samundri",
//     "Chichawatni", "Basirpur", "Kotli", "Mirpur", "Skardu", "Gilgit", "Hunza", "Khairpur Nathan Shah",
//     "Dipalpur", "Farooqabad"
//   ];

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (!user) router.push('/admin/login');
//     });
//     return () => unsub();
//   }, [router]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'buses'), (snapshot) => {
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setBuses(data);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSubmit = async () => {
//     const {
//       routeFrom,
//       routeTo,
//       date,
//       departureTime,
//       arrivalTime,
//       price,
//       totalSeats,
//       busType
//     } = form;

//     if (!routeFrom || !routeTo || !date || !departureTime || !arrivalTime || !price || !totalSeats || !busType) {
//       alert('Please fill all fields');
//       return;
//     }

//     if (editId) {
//       await updateDoc(doc(db, 'buses', editId), {
//         routeFrom,
//         routeTo,
//         date,
//         departureTime,
//         arrivalTime,
//         price: Number(price),
//         totalSeats: Number(totalSeats),
//         busType,
//       });
//       setEditId(null);
//     } else {
//       await addDoc(collection(db, 'buses'), {
//         routeFrom,
//         routeTo,
//         date,
//         departureTime,
//         arrivalTime,
//         price: Number(price),
//         totalSeats: Number(totalSeats),
//         busType,
//         createdAt: serverTimestamp(),
//       });
//     }

//     setForm({
//       routeFrom: '',
//       routeTo: '',
//       date: '',
//       departureTime: '',
//       arrivalTime: '',
//       price: '',
//       totalSeats: '',
//       busType: '',
//     });
//   };

//   const handleEdit = (bus) => {
//     setForm({
//       routeFrom: bus.routeFrom,
//       routeTo: bus.routeTo,
//       date: bus.date,
//       departureTime: bus.departureTime,
//       arrivalTime: bus.arrivalTime,
//       price: bus.price,
//       totalSeats: bus.totalSeats,
//       busType: bus.busType || '',
//     });
//     setEditId(bus.id);
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, 'buses', id));
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push('/admin/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-blue-900">🚌 Admin Dashboard</h1>
//         <button onClick={handleLogout} className="btn-primary">Logout</button>
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-blue-800">{editId ? '✏️ Edit Bus' : '➕ Add New Bus'}</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select className="input-primary" value={form.routeFrom} onChange={(e) => setForm({ ...form, routeFrom: e.target.value })}>
//             <option value="">Select From</option>
//             {cities.map((city) => <option key={city} value={city}>{city}</option>)}
//           </select>

//           <select className="input-primary" value={form.routeTo} onChange={(e) => setForm({ ...form, routeTo: e.target.value })}>
//             <option value="">Select To</option>
//             {cities.map((city) => <option key={city} value={city}>{city}</option>)}
//           </select>

//           <input type="date" className="input-primary" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
//           <input type="time" className="input-primary" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
//           <input type="time" className="input-primary" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
//           <input type="number" placeholder="Price" className="input-primary" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
//           <input type="number" placeholder="Total Seats" className="input-primary" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />

//           {/* New Bus Type Dropdown */}
//           <select className="input-primary" value={form.busType} onChange={(e) => setForm({ ...form, busType: e.target.value })}>
//             <option value="">Select Bus Type</option>
//             <option value="Executive Class">Executive Class</option>
//             <option value="Business Class">Business Class</option>
//           </select>
//         </div>

//         <button onClick={handleSubmit} className="btn-primary mt-4">{editId ? 'Update Bus' : 'Add Bus'}</button>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <h2 className="text-xl font-semibold text-blue-800 mb-4">🧾 All Buses</h2>
//         <table className="w-full table-auto border text-sm">
//           <thead className="bg-blue-100 text-blue-900">
//             <tr>
//               <th className="px-2 py-1 border">From</th>
//               <th className="px-2 py-1 border">To</th>
//               <th className="px-2 py-1 border">Date</th>
//               <th className="px-2 py-1 border">Departure</th>
//               <th className="px-2 py-1 border">Arrival</th>
//               <th className="px-2 py-1 border">Price</th>
//               <th className="px-2 py-1 border">Seats</th>
//               <th className="px-2 py-1 border">Type</th>
//               <th className="px-2 py-1 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus) => (
//               <tr key={bus.id} className="text-center">
//                 <td className="border px-2 py-1">{bus.routeFrom}</td>
//                 <td className="border px-2 py-1">{bus.routeTo}</td>
//                 <td className="border px-2 py-1">{bus.date}</td>
//                 <td className="border px-2 py-1">{bus.departureTime}</td>
//                 <td className="border px-2 py-1">{bus.arrivalTime}</td>
//                 <td className="border px-2 py-1">Rs. {bus.price}</td>
//                 <td className="border px-2 py-1">{bus.totalSeats}</td>
//                 <td className="border px-2 py-1">{bus.busType}</td>
//                 <td className="border px-2 py-1 space-x-2">
//                   <button onClick={() => handleEdit(bus)} className="text-blue-600 hover:underline">Edit</button>
//                   <button onClick={() => handleDelete(bus.id)} className="text-red-600 hover:underline">Delete</button>
//                 </td>
//               </tr>
//             ))}
//             {buses.length === 0 && (
//               <tr>
//                 <td colSpan={9} className="text-center py-4 text-gray-500">No buses found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// Updated Admin Dashboard with Booked & Available Seats

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
//   onSnapshot,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';

// export default function AdminDashboard() {
//   const [form, setForm] = useState({
//     routeFrom: '',
//     routeTo: '',
//     date: '',
//     departureTime: '',
//     arrivalTime: '',
//     price: '',
//     totalSeats: '',
//     type: '',
//   });

//   const [buses, setBuses] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const router = useRouter();

//   const cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];
//   const busTypes = ["Executive Class", "Business Class"];

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (!user) router.push('/admin/login');
//     });
//     return () => unsub();
//   }, [router]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'buses'), (snapshot) => {
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setBuses(data);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSubmit = async () => {
//     const { routeFrom, routeTo, date, departureTime, arrivalTime, price, totalSeats, type } = form;
//     if (!routeFrom || !routeTo || !date || !departureTime || !arrivalTime || !price || !totalSeats || !type) {
//       alert('Please fill all fields');
//       return;
//     }

//     if (editId) {
//       await updateDoc(doc(db, 'buses', editId), {
//         routeFrom,
//         routeTo,
//         date,
//         departureTime,
//         arrivalTime,
//         price: Number(price),
//         totalSeats: Number(totalSeats),
//         type,
//       });
//       setEditId(null);
//     } else {
//       await addDoc(collection(db, 'buses'), {
//         routeFrom,
//         routeTo,
//         date,
//         departureTime,
//         arrivalTime,
//         price: Number(price),
//         totalSeats: Number(totalSeats),
//         bookedSeats: 0,
//         type,
//         createdAt: serverTimestamp(),
//       });
//     }

//     setForm({
//       routeFrom: '',
//       routeTo: '',
//       date: '',
//       departureTime: '',
//       arrivalTime: '',
//       price: '',
//       totalSeats: '',
//       type: '',
//     });
//   };

//   const handleEdit = (bus) => {
//     setForm({
//       routeFrom: bus.routeFrom,
//       routeTo: bus.routeTo,
//       date: bus.date,
//       departureTime: bus.departureTime,
//       arrivalTime: bus.arrivalTime,
//       price: bus.price,
//       totalSeats: bus.totalSeats,
//       type: bus.type,
//     });
//     setEditId(bus.id);
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, 'buses', id));
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push('/admin/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-blue-900">🚌 Admin Dashboard</h1>
//         <button onClick={handleLogout} className="btn-primary">Logout</button>
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-blue-800">{editId ? '✏️ Edit Bus' : '➕ Add New Bus'}</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select className="input-primary" value={form.routeFrom} onChange={(e) => setForm({ ...form, routeFrom: e.target.value })}>
//             <option value="">Select From</option>
//             {cities.map(city => <option key={city} value={city}>{city}</option>)}
//           </select>

//           <select className="input-primary" value={form.routeTo} onChange={(e) => setForm({ ...form, routeTo: e.target.value })}>
//             <option value="">Select To</option>
//             {cities.map(city => <option key={city} value={city}>{city}</option>)}
//           </select>

//           <input type="date" className="input-primary" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

//           <input type="time" className="input-primary" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />

//           <input type="time" className="input-primary" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />

//           <input type="number" placeholder="Price" className="input-primary" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

//           <input type="number" placeholder="Total Seats" className="input-primary" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />

//           <select className="input-primary" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
//             <option value="">Select Bus Type</option>
//             {busTypes.map(t => <option key={t} value={t}>{t}</option>)}
//           </select>
//         </div>

//         <button onClick={handleSubmit} className="btn-primary mt-4">{editId ? 'Update Bus' : 'Add Bus'}</button>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <h2 className="text-xl font-semibold text-blue-800 mb-4">🧾 All Buses</h2>
//         <table className="w-full table-auto border text-sm">
//           <thead className="bg-blue-100 text-blue-900">
//             <tr>
//               <th className="px-2 py-1 border">From</th>
//               <th className="px-2 py-1 border">To</th>
//               <th className="px-2 py-1 border">Date</th>
//               <th className="px-2 py-1 border">Departure</th>
//               <th className="px-2 py-1 border">Arrival</th>
//               <th className="px-2 py-1 border">Type</th>
//               <th className="px-2 py-1 border">Price</th>
//               <th className="px-2 py-1 border">Seats</th>
//               <th className="px-2 py-1 border">Booked</th>
//               <th className="px-2 py-1 border">Available</th>
//               <th className="px-2 py-1 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus) => (
//               <tr key={bus.id} className="text-center">
//                 <td className="border px-2 py-1">{bus.routeFrom}</td>
//                 <td className="border px-2 py-1">{bus.routeTo}</td>
//                 <td className="border px-2 py-1">{bus.date}</td>
//                 <td className="border px-2 py-1">{bus.departureTime}</td>
//                 <td className="border px-2 py-1">{bus.arrivalTime}</td>
//                 <td className="border px-2 py-1">{bus.type}</td>
//                 <td className="border px-2 py-1">Rs. {bus.price}</td>
//                 <td className="border px-2 py-1">{bus.totalSeats}</td>
//                 <td className="border px-2 py-1">{bus.bookedSeats || 0}</td>
//                 <td className="border px-2 py-1">{bus.totalSeats - (bus.bookedSeats || 0)}</td>
//                 <td className="border px-2 py-1 space-x-2">
//                   <button onClick={() => handleEdit(bus)} className="text-blue-600 hover:underline">Edit</button>
//                   <button onClick={() => handleDelete(bus.id)} className="text-red-600 hover:underline">Delete</button>
//                 </td>
//               </tr>
//             ))}
//             {buses.length === 0 && (
//               <tr>
//                 <td colSpan={11} className="text-center py-4 text-gray-500">No buses found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [form, setForm] = useState({
    routeFrom: '',
    routeTo: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    type: '',
  });

  const [buses, setBuses] = useState([]);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta'];
  const busTypes = ['Executive Class', 'Business Class'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buses'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBuses(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    const { routeFrom, routeTo, date, departureTime, arrivalTime, price, totalSeats, type } = form;
    if (!routeFrom || !routeTo || !date || !departureTime || !arrivalTime || !price || !totalSeats || !type) {
      alert('Please fill all fields');
      return;
    }

    if (editId) {
      await updateDoc(doc(db, 'buses', editId), {
        routeFrom,
        routeTo,
        date,
        departureTime,
        arrivalTime,
        price: Number(price),
        totalSeats: Number(totalSeats),
        type,
      });
      setEditId(null);
    } else {
      await addDoc(collection(db, 'buses'), {
        routeFrom,
        routeTo,
        date,
        departureTime,
        arrivalTime,
        price: Number(price),
        totalSeats: Number(totalSeats),
        bookedSeats: 0,
        type,
        createdAt: serverTimestamp(),
      });
    }

    setForm({
      routeFrom: '',
      routeTo: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      totalSeats: '',
      type: '',
    });
  };

  const handleEdit = (bus) => {
    setForm({
      routeFrom: bus.routeFrom,
      routeTo: bus.routeTo,
      date: bus.date,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price,
      totalSeats: bus.totalSeats,
      type: bus.type,
    });
    setEditId(bus.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'buses', id));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">🚌 Admin Dashboard</h1>
       
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">
          {editId ? '✏️ Edit Bus' : '➕ Add New Bus'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="bg-gray-700 text-white p-3 rounded"
            value={form.routeFrom}
            onChange={(e) => setForm({ ...form, routeFrom: e.target.value })}
          >
            <option value="">Select From</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            className="bg-gray-700 text-white p-3 rounded"
            value={form.routeTo}
            onChange={(e) => setForm({ ...form, routeTo: e.target.value })}
          >
            <option value="">Select To</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <input
            type="date"
            className="bg-gray-700 text-white p-3 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            type="time"
            className="bg-gray-700 text-white p-3 rounded"
            value={form.departureTime}
            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
          />

          <input
            type="time"
            className="bg-gray-700 text-white p-3 rounded"
            value={form.arrivalTime}
            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            className="bg-gray-700 text-white p-3 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Total Seats"
            className="bg-gray-700 text-white p-3 rounded"
            value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
          />

          <select
            className="bg-gray-700 text-white p-3 rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Bus Type</option>
            {busTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300"
        >
          {editId ? 'Update Bus' : 'Add Bus'}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">🧾 All Buses</h2>
        <table className="w-full table-auto text-sm text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-2 py-1">From</th>
              <th className="px-2 py-1">To</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Departure</th>
              <th className="px-2 py-1">Arrival</th>
              <th className="px-2 py-1">Type</th>
              <th className="px-2 py-1">Price</th>
              <th className="px-2 py-1">Seats</th>
              <th className="px-2 py-1">Booked</th>
              <th className="px-2 py-1">Available</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="text-center border-t border-gray-700">
                <td className="px-2 py-1">{bus.routeFrom}</td>
                <td className="px-2 py-1">{bus.routeTo}</td>
                <td className="px-2 py-1">{bus.date}</td>
                <td className="px-2 py-1">{bus.departureTime}</td>
                <td className="px-2 py-1">{bus.arrivalTime}</td>
                <td className="px-2 py-1">{bus.type}</td>
                <td className="px-2 py-1">Rs. {bus.price}</td>
                <td className="px-2 py-1">{bus.totalSeats}</td>
                <td className="px-2 py-1">{bus.bookedSeats || 0}</td>
                <td className="px-2 py-1">{bus.totalSeats - (bus.bookedSeats || 0)}</td>
                <td className="px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="text-yellow-300 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {buses.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-400">
                  No buses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
