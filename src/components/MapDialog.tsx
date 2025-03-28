import React, { useEffect, useState } from "react";

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose, location }) => {
  // Move useState outside of any conditional blocks
  const [mapUrl, setMapUrl] = useState("");
  
  useEffect(() => {
    // Only proceed with fetching if the dialog is open
    if (isOpen && location) {
      // First, geocode the location using Nominatim API
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            // Use the first result's coordinates
            const { lat, lon } = data[0];
            // Create zoomed-in OpenStreetMap URL with the coordinates
            const zoom = 15; // Higher number = more zoom
            const bbox = calculateBbox(parseFloat(lat), parseFloat(lon), zoom);
            setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`);
          } else {
            // Fallback to the generic view with search query
            setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik&marker=${encodeURIComponent(location)}`);
          }
        })
        .catch(error => {
          console.error("Error geocoding location:", error);
          // Fallback URL
          setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik&marker=${encodeURIComponent(location)}`);
        });
    }
  }, [location, isOpen]); // Add isOpen to dependencies
  
  // Helper function to calculate bounding box for the map
  const calculateBbox = (lat: number, lon: number, zoom: number) => {
    // Simple calculation for a bounding box around the coordinates
    const offset = 0.01 * (16 - zoom); // Adjust size based on zoom level
    const minLon = lon - offset;
    const minLat = lat - offset;
    const maxLon = lon + offset;
    const maxLat = lat + offset;
    return `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`;
  };
  
  // If dialog is not open, return null but after hook declarations
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h2 style={{ margin: 0 }}>Location: {location}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            &times;
          </button>
        </div>
        
        <div style={{ height: '500px', width: '100%' }}>
          {mapUrl ? (
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={mapUrl}
              allowFullScreen
            ></iframe>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              Loading map...
            </div>
          )}
        </div>
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <a 
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0066cc', textDecoration: 'underline' }}
          >
            View on OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapDialog;
