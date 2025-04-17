
import React from "react";
import { MoveRight, Github, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl shadow-lg mx-3 mt-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-white p-2 rounded-xl mr-3">
            <LineChart className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold">SELIC-PIB-IPCA Insights</h1>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg text-white border-white/20 hover:bg-white/20 rounded-xl"
            onClick={() => window.open("https://colab.research.google.com/", "_blank")}
          >
            Abrir no Google Colab
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg text-white border-white/20 hover:bg-white/20 rounded-xl"
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
