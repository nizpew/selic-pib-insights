
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
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
        <span className="text-sm font-medium text-gray-700">Código Python</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={downloadPyFile} className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Download .py
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="rounded-full">
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
      </div>
      
      <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm max-h-[500px] overflow-y-auto">
        <code>{pythonCode}</code>
      </pre>
      
      <div className="p-4 bg-blue-50 border-t border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <span className="bg-blue-100 p-1 rounded-md mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </span>
          Como usar:
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Acesse o <a href="https://colab.research.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Colab</a></li>
          <li>Crie um novo notebook</li>
          <li>Cole o código acima ou baixe o arquivo .py e faça upload para o Colab</li>
          <li>Execute as células para realizar a análise</li>
          <li>Para instalar as dependências necessárias, execute no início do notebook:</li>
        </ol>
        <pre className="bg-gray-800 text-gray-100 p-3 rounded-md mt-3 overflow-x-auto text-sm">
          <code>!pip install pandas numpy plotly statsmodels bcb</code>
        </pre>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-3">
          <h4 className="font-medium text-yellow-800 flex items-center">
            <span className="bg-yellow-100 p-1 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" x2="12" y1="9" y2="13"></line>
                <line x1="12" x2="12.01" y1="17" y2="17"></line>
              </svg>
            </span>
            Requisitos:
          </h4>
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
