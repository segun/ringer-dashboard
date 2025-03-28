import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import { API_URL } from "./lib/api";
import DashboardHeader from "./components/DashboardHeader";
import StatusGraph from "./components/StatusGraph";
import StatusTable from "./components/StatusTable";

interface StatusData {
  statusTime: number;
  isPluggedIn: boolean;
}

interface FormattedStatusData {
  time: string;
  date: string;
  power: number;
  status: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<StatusData[]>([]);
  const [userId, setUserId] = useState<string>(() => {
    // Initialize userId from localStorage if available
    return localStorage.getItem('userId') || "";
  });
  const [showGraph, setShowGraph] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return; // Do not fetch unless logged in

    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_URL}/charging/get-status`, {
          userId,
          startDate: 1742975000000, // Example timestamps
          endDate: Date.now(),
        });

        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [userId]);

  // Save userId to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const handleLogout = () => {
    setUserId("");
  };

  const formattedData: FormattedStatusData[] = data.map((entry) => ({
    time: new Date(entry.statusTime).toLocaleTimeString(),
    date: new Date(entry.statusTime).toLocaleDateString(),
    power: entry.isPluggedIn ? 1 : 0,
    status: entry.isPluggedIn ? "Connected" : "Disconnected"
  }));

  if (!userId) {
    return <Login onLogin={(id) => setUserId(id)} />;
  }

  return (
    <div style={{ width: "90%", margin: "auto", padding: "20px" }}>
      <DashboardHeader userId={userId} onLogout={handleLogout} />
      
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
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
      
      {showGraph ? (
        <StatusGraph data={formattedData} />
      ) : (
        <StatusTable data={formattedData} />
      )}
    </div>
  );
};

export default App;
