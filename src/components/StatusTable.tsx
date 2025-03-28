import React, { useMemo } from "react";

interface StatusTableProps {
  data: {
    time: string;
    date: string;
    power: number;
    status: string;
  }[];
}

const StatusTable: React.FC<StatusTableProps> = ({ data }) => {
  // Calculate durations between status changes
  const dataWithDurations = useMemo(() => {
    return data.map((entry, index) => {
      // For the first entry, we don't have a previous entry to compare with
      if (index === 0) {
        return { ...entry, duration: "N/A" };
      }

      try {
        // Parse date and time properly with error handling
        const [day, month, year] = entry.date.split('/');
        const [hour, minute, second] = entry.time.split(':');
        
        const [prevDay, prevMonth, prevYear] = data[index - 1].date.split('/');
        const [prevHour, prevMinute, prevSecond] = data[index - 1].time.split(':');
        
        // Create Date objects with explicit parameters to avoid parsing issues
        const currentDateTime = new Date(
          parseInt(year), parseInt(month) - 1, parseInt(day), 
          parseInt(hour), parseInt(minute), parseInt(second || '0')
        );
        
        const prevDateTime = new Date(
          parseInt(prevYear), parseInt(prevMonth) - 1, parseInt(prevDay), 
          parseInt(prevHour), parseInt(prevMinute), parseInt(prevSecond || '0')
        );
        
        if (isNaN(currentDateTime.getTime()) || isNaN(prevDateTime.getTime())) {
          return { ...entry, duration: "Invalid date" };
        }
        
        const diffMs = currentDateTime.getTime() - prevDateTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let duration = "";
        if (diffHours > 0) {
          duration += `${diffHours}h `;
        }
        duration += `${diffMinutes}m`;

        return { ...entry, duration };
      } catch (error) {
        console.error("Error calculating duration:", error);
        return { ...entry, duration: "Error" };
      }
    });
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTable;
