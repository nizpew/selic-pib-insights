
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TimeSeriesChartProps {
  data: any[];
  dataKey: string;
  stroke: string;
  name: string;
  unit: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  dataKey, 
  stroke, 
  name,
  unit 
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getFullYear()}`;
  };

  const formatValue = (value: number) => `${value.toFixed(2)}${unit}`;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            tick={{ fontSize: 12 }} 
            angle={-45} 
            textAnchor="end"
          />
          <YAxis tickFormatter={(value) => `${value}${unit}`} />
          <Tooltip 
            formatter={formatValue}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short'
              });
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            name={name}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
