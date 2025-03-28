import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Login from "./Login";
import { API_URL } from "./lib/api";
import DashboardHeader from "./components/DashboardHeader";
import StatusGraph from "./components/StatusGraph";
import StatusTable from "./components/StatusTable";

interface StatusData {
  id: string;
  manualLocation: boolean;
  userId: string;
  isPluggedIn: boolean;
  userLocation: string;
  statusTime: number;
}

interface FormattedStatusData {
  time: string;
  date: string;
  power: number;
  status: string;
  location: string;
  manualLocation: boolean;
}

const App: React.FC = () => {
  const [data, setData] = useState<StatusData[]>([]);
  const [userId, setUserId] = useState<string>(() => {
    // Initialize userId from localStorage if available
    return localStorage.getItem('userId') || "";
  });
  const [showGraph, setShowGraph] = useState<boolean>(false);

  // Add state for date range
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to one month ago
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const [endDate, setEndDate] = useState<string>(() => {
    // Default to today
    return new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return; // Do not fetch unless logged in

    fetchData();
  }, [userId]); // Only run when userId changes

  // Save userId to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Use the selected date range
      const start = new Date(startDate).getTime();
      const end = new Date(endDate + 'T23:59:59').getTime(); // Include the full end date

      const response = await axios.post(`${API_URL}/charging/get-status`, {
        userId,
        startDate: start,
        endDate: end,
      });

      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUserId("");
  };

  const formattedData: FormattedStatusData[] = useMemo(() => 
    data.map((entry) => ({
      time: new Date(entry.statusTime).toLocaleTimeString(),
      date: new Date(entry.statusTime).toLocaleDateString(),
      power: entry.isPluggedIn ? 1 : 0,
      status: entry.isPluggedIn ? "Connected" : "Disconnected",
      location: entry.userLocation,
      manualLocation: entry.manualLocation
    })),
    [data] // Only recalculate when data changes
  );

  if (!userId) {
    return <Login onLogin={(id) => setUserId(id)} />;
  }

  return (
    <div style={{ width: "90%", margin: "auto", padding: "20px" }}>
      <DashboardHeader userId={userId} onLogout={handleLogout} />
      
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center", 
        flexWrap: "wrap",
        gap: "10px" 
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "15px",
          flexWrap: "wrap" 
        }}>
          <div>
            <label htmlFor="startDate" style={{ marginRight: "5px", fontWeight: "500" }}>Start Date:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" style={{ marginRight: "5px", fontWeight: "500" }}>End Date:</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          
          <button
            onClick={fetchData}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
        
        <button 
          onClick={() => setShowGraph(!showGraph)} 
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#4CAF50", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer" 
          }}
        >
          {showGraph ? "Show Table" : "Show Graph"}
        </button>
      </div>
      
      {data.length === 0 && !isLoading && (
        <div style={{ textAlign: "center", margin: "40px 0", color: "#666" }}>
          <p>No data found for the selected date range.</p>
        </div>
      )}
      
      {isLoading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          {showGraph ? (
            <StatusGraph data={formattedData} />
          ) : (
            <StatusTable data={formattedData} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
