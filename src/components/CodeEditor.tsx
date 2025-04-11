
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { pythonCode } from "@/utils/sampleCode";

const CodeEditor = () => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
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
      
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        <code>{pythonCode}</code>
      </pre>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Como usar:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Acesse o <a href="https://colab.research.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Colab</a></li>
          <li>Crie um novo notebook</li>
          <li>Cole o código acima</li>
          <li>Execute as células para realizar a análise</li>
          <li>Personalize os parâmetros conforme necessário para sua pesquisa</li>
        </ol>
      </div>
    </div>
  );
};

export default CodeEditor;
