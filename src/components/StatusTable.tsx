import React, { useMemo, useState, useEffect } from "react";
import { calculateDurations, type StatusEntry } from "../utils/timeUtils";
import MapDialog from "./MapDialog";

interface StatusTableProps {
  data: StatusEntry[];
}

const StatusTable: React.FC<StatusTableProps> = ({ data }) => {
  // Add state for current time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Calculate durations between status changes using the utility function
  const dataWithDurations = useMemo(() => {
    // Pass current time to use for the last entry's duration calculation
    return calculateDurations(data, new Date());
  }, [data]);

  // State for map dialog
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Set up timer to update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const handleLocationClick = (location: string | undefined) => {
    if (location && location !== "Unknown") {
      setSelectedLocation(location);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  // Format current date and time
  const formattedDate = currentDateTime.toLocaleDateString('en-US', { 
    weekday: 'short', // Changed from 'long' to 'short' for brevity
    year: 'numeric',
    month: 'short', // Changed from 'long' to 'short' for brevity
    day: 'numeric' 
  });
  
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px' // Added gap for better spacing when wrapped
      }}>
        <h2 style={{ margin: 0 }}>Connection Status History</h2>
        <div style={{
          fontFamily: "'Roboto', sans-serif",
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          padding: '8px 12px', // Reduced padding
          borderRadius: '6px', // Slightly reduced border radius
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Lighter shadow
          display: 'inline-flex', // Changed to inline-flex
          alignItems: 'center', // Center items vertically
          gap: '8px', // Gap between time and date
          maxWidth: '100%', // Ensure it doesn't overflow on small screens
          flexShrink: 0 // Prevent excessive shrinking
        }}>
          <div style={{ 
            fontSize: '1.1em', 
            fontWeight: 'bold',
            letterSpacing: '0.5px' // Add slight letter spacing for readability
          }}>{formattedTime}</div>
          <div style={{ 
            fontSize: '0.75em',
            opacity: 0.9 // Slightly transparent
          }}>{formattedDate}</div>
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Time</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Duration</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Location</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Location Source</th>
            </tr>
          </thead>
          <tbody>
            {dataWithDurations.map((entry, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.date}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.time}
                </td>
                <td style={{ 
                  padding: "8px", 
                  textAlign: "left", 
                  border: "1px solid #ddd",
                  color: entry.status === "Connected" ? "green" : "red"
                }}>
                  {entry.status}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.duration}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.location && entry.location !== "Unknown" ? (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleLocationClick(entry.location);
                      }}
                      style={{ 
                        color: '#0066cc', 
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      {entry.location}
                    </a>
                  ) : (
                    "Unknown"
                  )}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.manualLocation ? "Manual" : "Automatic"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Map Dialog */}
      <MapDialog
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        location={selectedLocation || ""} 
      />
    </div>
  );
};

export default StatusTable;
