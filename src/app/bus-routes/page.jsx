// 'use client';

// import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import { useEffect } from 'react';
// import 'leaflet/dist/leaflet.css';

// const cities = {
//   Karachi: [24.8607, 67.0011],
//   Lahore: [31.5497, 74.3436],
//   Islamabad: [33.6844, 73.0479],
//   Quetta: [30.1798, 66.9750],
//   Peshawar: [34.0151, 71.5249],
// };

// const routes = [
//   { from: 'Karachi', to: 'Islamabad' },
//   { from: 'Karachi', to: 'Lahore' },
//   { from: 'Karachi', to: 'Quetta' },
//   { from: 'Karachi', to: 'Peshawar' },
//   { from: 'Lahore', to: 'Islamabad' },
// ];

// // Helper function to calculate Haversine distance in km
// function haversineDistance([lat1, lon1], [lat2, lon2]) {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const R = 6371; // Earth radius in km
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return Math.round(R * c);
// }

// const busIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61231.png',
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// export default function BusRoutes() {
//   useEffect(() => {
//     delete L.Icon.Default.prototype._getIconUrl;
//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//       iconUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//       shadowUrl:
//         'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//     });
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white p-4">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
//         🗺️ Bus Routes Overview
//       </h1>

//       <MapContainer
//         center={[30.3753, 69.3451]}
//         zoom={5}
//         style={{ height: '75vh', borderRadius: '1rem' }}
//         className="shadow-lg"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />

//         {/* City markers */}
//         {Object.entries(cities).map(([city, coords]) => (
//           <Marker key={city} position={coords} icon={busIcon}>
//             <Popup>
//               <strong>{city}</strong>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Route Lines with clickable Popups */}
//         {routes.map((route, index) => {
//           const fromCoord = cities[route.from];
//           const toCoord = cities[route.to];
//           const distance = haversineDistance(fromCoord, toCoord);
//           const estTime = Math.round(distance / 80); // assuming 80 km/h

//           return (
//             <Polyline
//               key={index}
//               positions={[fromCoord, toCoord]}
//               color="yellow"
//               weight={4}
//               opacity={0.8}
//               dashArray="8"
//             >
//               <Popup>
//                 <div className="text-sm text-black">
//                   <strong>{route.from} → {route.to}</strong><br />
//                   📏 Distance: {distance} km<br />
//                   🕒 Est. Time: {estTime} hours
//                 </div>
//               </Popup>
//             </Polyline>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }


'use client';

import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const cities = {
  Karachi: [24.8607, 67.0011],
  Lahore: [31.5497, 74.3436],
  Islamabad: [33.6844, 73.0479],
  Quetta: [30.1798, 66.9750],
  Peshawar: [34.0151, 71.5249],
};

const routes = [
  { from: 'Karachi', to: 'Islamabad' },
  { from: 'Karachi', to: 'Lahore' },
  { from: 'Karachi', to: 'Quetta' },
  { from: 'Karachi', to: 'Peshawar' },
  { from: 'Lahore', to: 'Islamabad' },
];

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// ✅ Bus icon
const busIcon = new L.Icon({
  //  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61231.png',
   iconUrl: '/bus.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function BusRoutes() {
  const [url, setUrl] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // ✅ Safe usage of window inside useEffect
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
      setScreenWidth(window.innerWidth);
    }
  }, []);
  useEffect(() => {
    // delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61231.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
        🗺️ Bus Routes Overview
      </h1>

      <MapContainer
        center={[30.3753, 69.3451]}
        zoom={5}
        style={{ height: '75vh', borderRadius: '1rem' }}
        className="shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* City Markers with Bus Icon */}
        {Object.entries(cities).map(([city, coords]) => (
     <Marker key={city} position={coords} icon={busIcon}>
  <Popup>{city}</Popup>
</Marker>
        ))}

        {/* Routes with distance/time popup */}
        {routes.map((route, index) => {
          const fromCoord = cities[route.from];
          const toCoord = cities[route.to];
          const distance = haversineDistance(fromCoord, toCoord);
          const estTime = Math.round(distance / 80);

          return (
            <Polyline
              key={index}
              positions={[fromCoord, toCoord]}
              color="Green"
              weight={4}
              opacity={0.8}
              dashArray="6"
            >
              <Popup>
                <div className="text-sm text-black">
                  <strong>{route.from} → {route.to}</strong><br />
                  📏 Distance: {distance} km<br />
                  🕒 Est. Time: {estTime} hours
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
}
