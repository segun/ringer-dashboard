import React, { useMemo } from "react";
import { calculateDurations, type StatusEntry } from "../utils/timeUtils";

interface StatusTableProps {
  data: StatusEntry[];
}

const StatusTable: React.FC<StatusTableProps> = ({ data }) => {
  // Calculate durations between status changes using the utility function
  const dataWithDurations = useMemo(() => {
    return calculateDurations(data);
  }, [data]);

  return (
    <div>
      <h2>Connection Status History</h2>
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
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>{entry.date}</td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>{entry.time}</td>
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
                  {entry.location || "Unknown"}
                </td>
                <td style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                  {entry.manualLocation ? "Manual" : "Automatic"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTable;
