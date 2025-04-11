
import React from "react";
import { MoveRight, Github, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-blue-900 text-white py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <LineChart className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">SELIC-PIB-IPCA Insights</h1>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-blue-800"
            onClick={() => window.open("https://colab.research.google.com/", "_blank")}
          >
            Abrir no Google Colab
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-blue-800"
            onClick={() => window.open("https://github.com/bcb-sgs/sgs-api", "_blank")}
          >
            <Github className="mr-2 h-4 w-4" />
            SGS API
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
