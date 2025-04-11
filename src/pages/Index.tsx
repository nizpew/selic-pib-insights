
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import EconomicDashboard from "@/components/EconomicDashboard";
import CodeEditor from "@/components/CodeEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Análise de Dados Econômicos: SELIC, PIB e IPCA
        </h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="code">Código Python</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <EconomicDashboard />
          </TabsContent>
          
          <TabsContent value="code">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4 text-gray-700">
                  Código Python pronto para ser utilizado no Google Colab. Copie e cole no seu notebook:
                </p>
                <CodeEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-blue-900 text-white p-4 text-center mt-12">
        <p>Análise Econômica - Ferramenta para Iniciação Científica &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
