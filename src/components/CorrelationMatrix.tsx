
import React, { useMemo } from "react";

interface CorrelationMatrixProps {
  data: any[];
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data }) => {
  const correlations = useMemo(() => {
    const variables = ["selic_anual", "ipca", "pib", "cambio"];
    const result: { [key: string]: { [key: string]: number } } = {};
    
    // Initialize result with empty objects
    variables.forEach(var1 => {
      result[var1] = {};
      variables.forEach(var2 => {
        result[var1][var2] = 0;
      });
    });
    
    // Calculate correlations
    variables.forEach(var1 => {
      variables.forEach(var2 => {
        // Mean calculation
        const mean1 = data.reduce((sum, item) => sum + (item[var1] || 0), 0) / data.length;
        const mean2 = data.reduce((sum, item) => sum + (item[var2] || 0), 0) / data.length;
        
        // Covariance and variance calculation
        let covariance = 0;
        let variance1 = 0;
        let variance2 = 0;
        
        data.forEach(item => {
          const val1 = item[var1] || 0;
          const val2 = item[var2] || 0;
          
          covariance += (val1 - mean1) * (val2 - mean2);
          variance1 += Math.pow(val1 - mean1, 2);
          variance2 += Math.pow(val2 - mean2, 2);
        });
        
        // Correlation calculation
        const correlation = covariance / (Math.sqrt(variance1) * Math.sqrt(variance2)) || 0;
        result[var1][var2] = correlation;
      });
    });
    
    return result;
  }, [data]);
  
  const variableNames = {
    selic_anual: "SELIC",
    ipca: "IPCA",
    pib: "PIB",
    cambio: "Câmbio"
  };
  
  const variables = Object.keys(variableNames);
  
  // Function to get color based on correlation value
  const getColorForCorrelation = (value: number) => {
    // Value ranges from -1 to 1
    if (value > 0.7) return "bg-green-600 text-white";
    if (value > 0.3) return "bg-green-300";
    if (value > -0.3) return "bg-gray-100";
    if (value > -0.7) return "bg-red-300";
    return "bg-red-600 text-white";
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100"></th>
            {variables.map(variable => (
              <th key={variable} className="border p-2 bg-gray-100 font-medium">
                {variableNames[variable as keyof typeof variableNames]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variables.map(var1 => (
            <tr key={var1}>
              <th className="border p-2 bg-gray-100 font-medium text-left">
                {variableNames[var1 as keyof typeof variableNames]}
              </th>
              {variables.map(var2 => (
                <td 
                  key={`${var1}-${var2}`} 
                  className={`border p-2 text-center ${getColorForCorrelation(correlations[var1][var2])}`}
                >
                  {correlations[var1][var2].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CorrelationMatrix;
