
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSeriesChart from "./TimeSeriesChart";
import DataTable from "./DataTable";
import { economicData } from "@/utils/economicData";
import InvestmentComparisonChart from "./InvestmentComparisonChart";
import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";

const EconomicDashboard = () => {
  const [timeRange, setTimeRange] = useState("5years");
  
  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "3years":
        cutoffDate.setFullYear(now.getFullYear() - 3);
        break;
      case "5years":
        cutoffDate.setFullYear(now.getFullYear() - 5);
        break;
      case "all":
      default:
        return economicData;
    }
    
    return economicData.filter(entry => new Date(entry.date) >= cutoffDate);
  };
  
  const filteredData = getFilteredData();
  
  // Find latest values
  const latestData = filteredData[filteredData.length - 1];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4 items-center">
        <div className="text-xl font-semibold text-blue-900">Resumo Econômico</div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-lg shadow-sm">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1year">Último Ano</SelectItem>
            <SelectItem value="3years">Últimos 3 Anos</SelectItem>
            <SelectItem value="5years">Últimos 5 Anos</SelectItem>
            <SelectItem value="all">Todo o Período</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Top KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-800 text-sm font-medium">Taxa SELIC</p>
                <h3 className="text-2xl font-bold text-blue-900">{latestData?.selic_anual.toFixed(2)}%</h3>
                <p className="text-xs text-blue-600">Taxa anual</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="bg-blue-100 h-2 w-full rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(latestData?.selic_anual * 5, 100)}%` }}></div>
              </div>
              <span className="ml-2 text-xs font-medium text-blue-900">{Math.min(latestData?.selic_anual * 5, 100).toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-md rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-800 text-sm font-medium">PIB</p>
                <h3 className="text-2xl font-bold text-green-900">{latestData?.pib.toFixed(2)}%</h3>
                <p className="text-xs text-green-600">Variação percentual</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="bg-green-100 h-2 w-full rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((latestData?.pib + 10) * 5, 100)}%` }}></div>
              </div>
              <span className="ml-2 text-xs font-medium text-green-900">{Math.min((latestData?.pib + 10) * 5, 100).toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-md rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-red-800 text-sm font-medium">IPCA</p>
                <h3 className="text-2xl font-bold text-red-900">{latestData?.ipca.toFixed(2)}%</h3>
                <p className="text-xs text-red-600">Inflação</p>
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="bg-red-100 h-2 w-full rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(latestData?.ipca * 10, 100)}%` }}></div>
              </div>
              <span className="ml-2 text-xs font-medium text-red-900">{Math.min(latestData?.ipca * 10, 100).toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Chart and Donut Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Evolução da Taxa SELIC ao longo do tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart 
              data={filteredData} 
              dataKey="selic_anual" 
              stroke="#2563eb" 
              name="SELIC" 
              unit="%" 
              showAverage={true}
              fillGradient={true}
            />
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Cenário Atual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-4xl font-bold">{latestData?.ipca < latestData?.selic_anual ? "70%" : "30%"}</p>
                <p className="text-sm text-gray-500">Favorável</p>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke={latestData?.ipca < latestData?.selic_anual ? "#3b82f6" : "#ef4444"} 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - (latestData?.ipca < latestData?.selic_anual ? 0.7 : 0.3))}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="grid grid-cols-3 w-full mt-4 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs">SELIC</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">PIB</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs">IPCA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Second Row Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>PIB (Variação Percentual)</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart 
              data={filteredData} 
              dataKey="pib" 
              stroke="#16a34a" 
              name="PIB" 
              unit="%" 
              showAverage={false}
              fillGradient={true}
            />
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>IPCA (Inflação)</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart 
              data={filteredData} 
              dataKey="ipca" 
              stroke="#dc2626" 
              name="IPCA" 
              unit="%" 
              showAverage={false}
              fillGradient={true}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Investment Comparison */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Comparação de Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <InvestmentComparisonChart data={filteredData} />
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Tabela de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicDashboard;
