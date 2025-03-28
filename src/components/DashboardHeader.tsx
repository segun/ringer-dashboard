import React from "react";

interface DashboardHeaderProps {
  userId: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userId, onLogout }) => {
  return (
    <header style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "20px", 
      padding: "10px 0", 
      borderBottom: "1px solid #eaeaea" 
    }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Ringer Dashboard</h1>
        <p style={{ color: "#666" }}>User ID: {userId}</p>
      </div>
      <button 
        onClick={onLogout}
        style={{ 
          padding: "8px 16px", 
          backgroundColor: "#f44336", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer" 
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default DashboardHeader;
