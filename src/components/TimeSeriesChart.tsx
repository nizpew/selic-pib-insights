
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TimeSeriesChartProps {
  data: any[];
  dataKey: string;
  stroke: string;
  name: string;
  unit: string;
  showAverage?: boolean;
  fillGradient?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  dataKey, 
  stroke, 
  name,
  unit,
  showAverage = false,
  fillGradient = false
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
  };

  const formatValue = (value: number) => `${value.toFixed(2)}${unit}`;
  
  // Calculate average for reference line
  const average = showAverage ? 
    data.reduce((sum, item) => sum + item[dataKey], 0) / data.length : 
    null;
  
  // Find max value for highlighted dot
  const maxValue = Math.max(...data.map(item => item[dataKey]));
  const maxPoint = data.find(item => item[dataKey] === maxValue);
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.2} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(value) => `${value}${unit}`} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            formatter={formatValue}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short'
              });
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: 'none',
              padding: '8px 12px'
            }}
          />
          {showAverage && average !== null && (
            <ReferenceLine 
              y={average} 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
              label={{ 
                value: `Média: ${average.toFixed(2)}${unit}`, 
                position: 'top',
                fill: '#64748b',
                fontSize: 12
              }} 
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            name={name}
            strokeWidth={3}
            dot={({ cx, cy, payload }) => {
              // Special styling for the maximum value point
              if (showAverage && payload[dataKey] === maxValue) {
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={6} fill="#0f172a" />
                    <circle cx={cx} cy={cy} r={3} fill={stroke} />
                    <text x={cx} y={cy - 15} textAnchor="middle" fill="#0f172a" fontSize="12">
                      {payload[dataKey].toFixed(2) + unit}
                    </text>
                  </g>
                );
              }
              return <circle cx={cx} cy={cy} r={0} fill="transparent" />;
            }}
            activeDot={{ r: 6, fill: stroke, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-in-out"
            {...(fillGradient && {
              fill: `url(#gradient-${name})`,
            })}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
