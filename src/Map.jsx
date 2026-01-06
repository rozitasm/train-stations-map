
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import MapController from './MapController';
import { FaBars, FaTimes } from 'react-icons/fa';
import Loading from './Loading';
import markerIcon from './assets/marker-icon.png';
import markerShadow from './assets/marker-shadow.png';


function Map() {
  const [dataloc, setDataloc] = useState([]);
  const [city, setCity] = useState('');
  const [mapCenter, setMapCenter] = useState([51.1657, 10.4515]);
  const [mapZoom, setMapZoom] = useState(6);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  


  const trainIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

  useEffect(() => {

   const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('./stations.json');
      if (!res.ok) throw new Error('Failed to fetch stations');
      const data = await res.json();
      setDataloc(data);
    } catch (err) {
      setError(err.message);
    } finally {
     setLoading(false);
    }
  };
  fetchData();
  }, []);

  useEffect(() => {
    if (!city || city === 'null') return;

    const cityStations = dataloc.filter(d => d.city === city);
    if (cityStations.length > 0) {
      const avgLat =
        cityStations.reduce((sum, s) => sum + s.lat, 0) / cityStations.length;
      const avgLng =
        cityStations.reduce((sum, s) => sum + s.lng, 0) / cityStations.length;

      setMapCenter([avgLat, avgLng]);
      setMapZoom(10);
    }
  }, [city, dataloc]);

  const handleStationClick = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(14);
  };



return(
    <div className="relative w-screen h-screen overflow-hidden">

    {/* Hamburger */}
    <button
      className="fixed top-4 left-12 z-[9999] bg-white p-2 rounded shadow-lg"
      onClick={() => setSidebarOpen(true)}
    >
      <FaBars size={20} />
    </button>

    {/* Sidebar */}
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl
      transition-transform duration-300 z-[9999]
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold">Cities</h2>
        <button onClick={() => setSidebarOpen(false)}>
          <FaTimes />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <select
          className="w-full border rounded p-2 px-4 "
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="null">Select city</option>
          {[...new Set(dataloc.map(d => d.city))].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {dataloc
            .filter(d => d.city === city)
            .map(station => (
              <div
                key={station.id}
                className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => handleStationClick(station.lat, station.lng)}
              >
                {station.name}
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Map */}
    
    <div className="absolute inset-0 z-0 h-screen w-full">
         {(!mapReady || loading) &&  (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
      <Loading />
    </div>
  )}
      {!loading&&<MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100vh' }}
        whenReady={() => setMapReady(true)}

      >
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {dataloc.map(station => (
          <Marker  key={station.id} position={[station.lat, station.lng]}  icon={trainIcon}>
            <Popup>
              <b>{station.name}</b><br />
              {station.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>}
    </div>

  </div>
);
}
export default Map;