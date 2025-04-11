
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Filter and paginate data
  const filteredData = data
    .filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const dateStr = new Date(item.date).toLocaleDateString('pt-BR');
      return (
        dateStr.includes(searchTermLower) ||
        item.selic_anual.toString().includes(searchTermLower) ||
        item.ipca.toString().includes(searchTermLower) ||
        item.pib.toString().includes(searchTermLower) ||
        item.cambio.toString().includes(searchTermLower)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  // Function to download data as CSV
  const downloadCSV = () => {
    // Headers
    const headers = ["Data", "SELIC (%)", "IPCA (%)", "PIB (%)", "Câmbio"];
    
    // Format data
    const csvData = data.map(item => [
      new Date(item.date).toLocaleDateString('pt-BR'),
      item.selic_anual.toFixed(2),
      item.ipca.toFixed(2),
      item.pib.toFixed(2),
      item.cambio.toFixed(2)
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados_economicos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={downloadCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar CSV
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>SELIC (%)</TableHead>
              <TableHead>IPCA (%)</TableHead>
              <TableHead>PIB (%)</TableHead>
              <TableHead>Câmbio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{item.selic_anual.toFixed(2)}</TableCell>
                  <TableCell>{item.ipca.toFixed(2)}</TableCell>
                  <TableCell>{item.pib.toFixed(2)}</TableCell>
                  <TableCell>{item.cambio.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Mostrando {(currentPage - 1) * rowsPerPage + 1} a {Math.min(currentPage * rowsPerPage, filteredData.length)} de {filteredData.length} registros
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
