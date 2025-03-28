import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StatusGraphProps {
  data: {
    time: string;
    date: string;
    power: number;
    status: string;
  }[];
}

const StatusGraph: React.FC<StatusGraphProps> = ({ data }) => {
  // Create formatter to display date and time together
  const formatXAxis = (value: string, index: number) => {
    const item = data[index];
    return `${item.date} ${item.time}`;
  };

  return (
    <div>
      <h2>Power Status Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }} // Increase bottom margin for rotated labels
        >
          <XAxis 
            dataKey="time" 
            tickFormatter={formatXAxis}
            angle={-45} 
            textAnchor="end"
            height={70} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 1]} 
            ticks={[0, 1]} 
            tickFormatter={(tick) => (tick === 1 ? "ON" : "OFF")}
            tickCount={2}
          />
          <Tooltip labelFormatter={(label, items) => {
            const item = items[0]?.payload;
            return item ? `${item.date} ${item.time}` : label;
          }}/>
          <Line 
            type="stepAfter" 
            dataKey="power" 
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
