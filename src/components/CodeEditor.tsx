
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { pythonCode } from "@/utils/sampleCode";

const CodeEditor = () => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadPyFile = () => {
    const blob = new Blob([pythonCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analise_economica.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button variant="outline" size="sm" onClick={downloadPyFile}>
          <Download className="h-4 w-4 mr-2" />
          Download .py
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </>
          )}
        </Button>
      </div>
      
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-[600px] overflow-y-auto">
        <code>{pythonCode}</code>
      </pre>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Como usar:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Acesse o <a href="https://colab.research.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Colab</a></li>
          <li>Crie um novo notebook</li>
          <li>Cole o código acima ou baixe o arquivo .py e faça upload para o Colab</li>
          <li>Execute as células para realizar a análise</li>
          <li>Para instalar as dependências necessárias, execute no início do notebook:</li>
        </ol>
        <pre className="bg-gray-800 text-gray-100 p-3 rounded-md mt-3 overflow-x-auto text-sm">
          <code>!pip install pandas numpy plotly statsmodels bcb</code>
        </pre>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
          <h4 className="font-medium text-yellow-800">Requisitos:</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
            <li>pandas - Para manipulação de dados</li>
            <li>numpy - Para cálculos matemáticos</li>
            <li>plotly - Para visualizações interativas</li>
            <li>statsmodels - Para análise estatística e econométrica</li>
            <li>bcb - API para obter dados do Banco Central do Brasil</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
