
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSeriesChart from "./TimeSeriesChart";
import CorrelationMatrix from "./CorrelationMatrix";
import DataTable from "./DataTable";
import { economicData } from "@/utils/economicData";

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa SELIC ao longo do tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart 
              data={filteredData} 
              dataKey="selic_anual" 
              stroke="#2563eb" 
              name="SELIC" 
              unit="%" 
            />
          </CardContent>
        </Card>
        
        <Card>
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
            />
          </CardContent>
        </Card>
        
        <Card>
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
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Correlação entre Variáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <CorrelationMatrix data={filteredData} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
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
