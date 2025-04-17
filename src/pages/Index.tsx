
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import EconomicDashboard from "@/components/EconomicDashboard";
import CodeEditor from "@/components/CodeEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Análise de Dados Econômicos: SELIC, PIB e IPCA
        </h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-2 bg-white/80 backdrop-blur-lg p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="rounded-lg text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="code" className="rounded-lg text-sm">Código Python</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <EconomicDashboard />
          </TabsContent>
          
          <TabsContent value="code">
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="pt-6 p-0">
                <p className="mb-4 text-gray-700 px-6">
                  Código Python pronto para ser utilizado no Google Colab. Copie e cole no seu notebook:
                </p>
                <CodeEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Conclusões Práticas section */}
        <Card className="mt-8 border border-blue-100 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h2 className="text-2xl font-semibold text-white">Conclusões Práticas</h2>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Implicações Econômicas Gerais</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Efeitos da Política Monetária:</strong> A análise mostra como mudanças na taxa Selic afetam inflação e crescimento econômico, revelando trade-offs importantes.</li>
                  <li><strong>Efeitos Defasados:</strong> Ações monetárias têm impactos que podem levar 6-12 meses para se manifestarem plenamente na economia.</li>
                  <li><strong>Controle da Inflação:</strong> A Selic serve como instrumento para gerenciar pressões inflacionárias no Brasil.</li>
                  <li><strong>Crescimento Econômico:</strong> Taxas elevadas podem desestimular investimentos e consumo, reduzindo o crescimento.</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Decisões de Investimento e Negócios</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Planejamento Estratégico:</strong> Empresas podem usar insights para decisões mais informadas sobre investimentos futuros.</li>
                  <li><strong>Planejamento Financeiro:</strong> Famílias podem otimizar decisões sobre empréstimos e compras importantes.</li>
                  <li><strong>Gerenciamento de Risco:</strong> Instituições financeiras obtêm melhor compreensão dos riscos associados a mudanças nas taxas de juros.</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Recomendações de Política</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Forward Guidance:</strong> Bancos centrais podem usar comunicação clara para gerenciar expectativas e reduzir incertezas no mercado.</li>
                  <li><strong>Decisões Baseadas em Dados:</strong> Formuladores de políticas podem ajustar a Selic de forma mais precisa respondendo a indicadores econômicos.</li>
                  <li><strong>Coordenação:</strong> Política monetária eficaz requer coordenação com outras políticas econômicas, como a fiscal.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 text-center mt-12 rounded-t-xl">
        <p>Análise Econômica - Ferramenta para Iniciação Científica &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
