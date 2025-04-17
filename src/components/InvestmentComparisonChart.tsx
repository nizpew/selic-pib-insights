
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface InvestmentComparisonChartProps {
  data: any[];
}

const InvestmentComparisonChart: React.FC<InvestmentComparisonChartProps> = ({ data }) => {
  // Calculate investment returns based on economic indicators
  const investmentData = useMemo(() => {
    // Get the latest data point
    const latestData = data[data.length - 1];
    const selicRate = latestData?.selic_anual || 0;
    const inflationRate = latestData?.ipca || 0;
    
    // Calculate returns for different investments
    // These são cálculos simplificados para fins ilustrativos
    const tesouroDiretoData = [
      {
        name: "Tesouro Selic",
        return: selicRate * 0.95, // Aproximadamente 95% do CDI
        color: "#3b82f6"
      },
      {
        name: "Tesouro IPCA+",
        return: inflationRate + 4.5, // IPCA + spread médio
        color: "#22c55e"
      },
      {
        name: "Tesouro Prefixado",
        return: selicRate * 0.90, // Rendimento prefixado estimado
        color: "#eab308"
      },
      {
        name: "Poupança",
        return: selicRate > 8.5 ? 0.5 + (selicRate * 0.7) : 4.55, // Regra atual da poupança
        color: "#f97316"
      },
      {
        name: "CDB",
        return: selicRate * 0.9, // 90% do CDI
        color: "#8b5cf6"
      },
      {
        name: "LCI/LCA",
        return: selicRate * 0.85, // 85% do CDI
        color: "#ec4899"
      }
    ];
    
    // Sort by return in descending order
    return tesouroDiretoData.sort((a, b) => b.return - a.return);
  }, [data]);
  
  // Calculate real returns (adjusted for inflation)
  const latestData = data[data.length - 1];
  const inflationRate = latestData?.ipca || 0;
  
  const realReturnsData = investmentData.map(item => ({
    ...item,
    realReturn: item.return - inflationRate,
    name: item.name
  }));
  
  return (
    <div className="h-[350px] w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Rentabilidade de Investimentos de Renda Fixa</h3>
          <p className="text-xs text-gray-500">Retornos anuais estimados baseados na SELIC atual ({latestData?.selic_anual.toFixed(2)}%) e IPCA ({latestData?.ipca.toFixed(2)}%)</p>
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Retorno Bruto</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
            <span>Retorno Real</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={realReturnsData}
          layout="vertical"
          margin={{
            top: 10,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax + 2']} 
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Retorno']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: 'none',
              padding: '8px 12px'
            }}
          />
          <Bar 
            dataKey="return" 
            name="Retorno Bruto"
            radius={[0, 4, 4, 0]}
            barSize={24}
          >
            {realReturnsData.map((entry, index) => (
              <LabelList
                key={`label-${index}`}
                dataKey="return"
                position="right"
                formatter={(value: number) => `${value.toFixed(1)}%`}
                style={{ fontSize: 12, fill: '#374151' }}
              />
            ))}
            {realReturnsData.map((entry, index) => (
              <rect 
                key={`rect-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Bar>
          <Bar 
            dataKey="realReturn" 
            name="Retorno Real"
            radius={[0, 4, 4, 0]}
            barSize={24}
            fill="#8b5cf6"
            fillOpacity={0.6}
          >
            {realReturnsData.map((entry, index) => (
              <rect 
                key={`rect-real-${index}`} 
                fill={entry.realReturn >= 0 ? '#8b5cf6' : '#f43f5e'} 
                fillOpacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex justify-center">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            {inflationRate > latestData?.selic_anual ? 
              "⚠️ Cenário de Atenção: A inflação está acima da taxa SELIC, afetando o retorno real dos investimentos." :
              "✅ Cenário Favorável: A taxa SELIC está acima da inflação, proporcionando retornos reais positivos."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentComparisonChart;
