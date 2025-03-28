import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { calculateDurations, type StatusEntry } from "../utils/timeUtils";

interface StatusGraphProps {
  data: StatusEntry[];
}

const StatusGraph: React.FC<StatusGraphProps> = ({ data }) => {
  const [xAxisMode, setXAxisMode] = useState<"time" | "duration">("time");
  
  // Process data to include durations
  const processedData = useMemo(() => calculateDurations(data), [data]);

  // Create formatter to display date and time together
  const formatXAxis = (value: string, index: number) => {
    if (xAxisMode === "time") {
      const item = processedData[index];
      return item ? `${item.date} ${item.time}` : value;
    } else {
      // For duration mode, simply display the duration from the processed data
      // This will match what's shown in the table
      const item = processedData[index];
      return item ? item.duration : value;
    }
  };

  return (
    <div>
      <h2>Power Status Over Time</h2>
      <div style={{ 
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontWeight: 500 }}>X-Axis Mode:</span>
        <div style={{
          display: 'flex',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          borderRadius: '30px',
          padding: '3px',
          width: '280px',
          height: '34px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div 
            style={{
              position: 'absolute',
              width: '50%',
              height: '28px',
              borderRadius: '30px',
              backgroundColor: '#fff',
              transition: 'transform 0.3s ease',
              transform: xAxisMode === 'time' ? 'translateX(0)' : 'translateX(100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              zIndex: 1
            }}
          />
          <button
            onClick={() => setXAxisMode("time")}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '30px',
              fontWeight: xAxisMode === 'time' ? 'bold' : 'normal',
              color: xAxisMode === 'time' ? '#333' : '#666',
              zIndex: 2,
              transition: 'all 0.3s ease'
            }}
          >
            Time
          </button>
          <button
            onClick={() => setXAxisMode("duration")}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '30px',
              fontWeight: xAxisMode === 'duration' ? 'bold' : 'normal',
              color: xAxisMode === 'duration' ? '#333' : '#666',
              zIndex: 2,
              transition: 'all 0.3s ease'
            }}
          >
            Duration
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }} // Increase bottom margin for rotated labels
        >
          <XAxis 
            dataKey={xAxisMode === "time" ? "time" : "index"}
            tickFormatter={formatXAxis}
            angle={-45} 
            textAnchor="end"
            height={70} 
            tick={{ fontSize: 12 }}
            label={{ 
              value: xAxisMode === "time" ? "Time" : "Duration Until Next Status Change", 
              position: "insideBottom", 
              offset: -40 
            }}
          />
          <YAxis 
            domain={[0, 1]} 
            ticks={[0, 1]} 
            tickFormatter={(tick) => (tick === 1 ? "ON" : "OFF")}
            tickCount={2}
          />
          <Tooltip 
            labelFormatter={(label, items) => {
              const item = items[0]?.payload;
              if (!item) return label;
              
              if (xAxisMode === "time") {
                return `${item.date} ${item.time}`;
              } else {
                return `Duration: ${item.duration}`;
              }
            }}
            formatter={(value, name, props) => {
              const status = props.payload.status;
              return [status === "Connected" ? "Connected" : "Disconnected", "Status"];
            }}
          />
          <Legend />
          <Line 
            type="stepAfter" 
            dataKey="power" 
            name="Power Status"
            stroke="green" 
            strokeWidth={2}
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusGraph;
