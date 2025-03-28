import React from "react";

interface DashboardHeaderProps {
  userId: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userId }) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1>Ringer Dashboard</h1>
      <p>Welcome, User {userId}! Here's your device status overview.</p>
    </div>
  );
};

export default DashboardHeader;
