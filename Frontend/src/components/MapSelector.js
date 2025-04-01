import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ coords, setCoords }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ latitude: lat, longitude: lng });
      console.log(coords);
    },
  });

  if (!coords) return null;

  return <Marker position={[coords.latitude, coords.longitude]} />;
}

function MapPanner({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView([coords.latitude, coords.longitude], 13, {
        animate: true,
      });
    }
  }, [coords, map]);

  return null;
}

function MapSelector({ coords, setCoords }) {
  return (
    <MapContainer
      center={[62.2426, 25.7473]}
      zoom={6}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPanner coords={coords} />
      <LocationMarker coords={coords} setCoords={setCoords} />
    </MapContainer>
  );
}

export default MapSelector;
