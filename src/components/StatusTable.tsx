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

  // Helper function to calculate end time from start time and duration
  const calculateEndTime = (dateStr: string, timeStr: string, durationStr: string): string => {
    if (durationStr === "Current" || !dateStr || !timeStr) return "Current";
    
    try {
      // Parse the start date and time
      const [month, day, year] = dateStr.split('/').map(part => parseInt(part.trim(), 10));
      
      // Handle time parsing more safely
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      let isPM = false;
      
      // Check if time contains AM/PM
      if (timeStr.toUpperCase().includes('AM') || timeStr.toUpperCase().includes('PM')) {
        isPM = timeStr.toUpperCase().includes('PM');
        const timeParts = timeStr.replace(/\s*(AM|PM)\s*/i, '').split(':');
        
        hours = parseInt(timeParts[0] || '0', 10);
        minutes = parseInt(timeParts[1] || '0', 10);
        seconds = parseInt(timeParts[2] || '0', 10);
        
        // Convert 12-hour format to 24-hour
        if (isPM && hours < 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }
      } else {
        // Handle 24-hour format
        const timeParts = timeStr.split(':');
        hours = parseInt(timeParts[0] || '0', 10);
        minutes = parseInt(timeParts[1] || '0', 10);
        seconds = parseInt(timeParts[2] || '0', 10);
      }
      
      // Create a date object for the start time
      const startDateTime = new Date(year, month - 1, day);
      startDateTime.setHours(hours, minutes, seconds);
      
      // Parse the duration (assuming format like "2h 15m 30s" or some parts of it)
      const durationParts = durationStr.match(/(\d+)h|(\d+)m|(\d+)s/g) || [];
      let durationMs = 0;
      
      durationParts.forEach(part => {
        const num = parseInt(part, 10);
        if (part.endsWith('h')) {
          durationMs += num * 60 * 60 * 1000;
        } else if (part.endsWith('m')) {
          durationMs += num * 60 * 1000;
        } else if (part.endsWith('s')) {
          durationMs += num * 1000;
        }
      });
      
      // Calculate end time
      const endDateTime = new Date(startDateTime.getTime() + durationMs);
      
      // Format the end time
      return endDateTime.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error calculating end time:", error, { dateStr, timeStr, durationStr });
      return "Error";
    }
  };

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
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Start Time</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>End Time</th>
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
                  {`${entry.date} ${entry.time}`}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {calculateEndTime(entry.date, entry.time, entry.duration)}
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
