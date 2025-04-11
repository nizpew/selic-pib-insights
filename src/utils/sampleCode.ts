
export const pythonCode = `# Análise de Variáveis Econômicas: SELIC, PIB, IPCA e Câmbio
# Código para Google Colab - Iniciação Científica

import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller
from bcb import sgs
from datetime import datetime

class AnaliseEconomica:
    def __init__(self):
        # Dicionário de códigos do Sistema Gerenciador de Séries Temporais (SGS) do Banco Central
        self.codigos_sgs = {
            11: 'selic_diaria',     # Taxa Selic diária
            4189: 'pib',            # PIB mensal - Valores correntes
            433: 'ipca',            # IPCA - Variação mensal
            1: 'cambio'             # Taxa de câmbio - Livre - Dólar americano (compra) - Média de período
        }
        self.dados = None
        self.dados_mensais = None
        
    def carregar_dados(self, data_inicio='2010-01-01', data_fim=None):
        """Carrega os dados do SGS/BCB para o período especificado"""
        if data_fim is None:
            data_fim = datetime.today().strftime('%Y-%m-%d')
            
        print(f"Baixando dados econômicos de {data_inicio} até {data_fim}...")
        try:
            # Baixa os dados do BCB
            self.dados = sgs.get(self.codigos_sgs.keys(), start=data_inicio, end=data_fim)
            self.dados.columns = self.codigos_sgs.values()
            
            # Processa os dados
            self._processar_dados()
            print(f"Dados carregados com sucesso! {len(self.dados)} registros encontrados.")
            return True
        except Exception as e:
            print(f"Erro ao carregar dados: {e}")
            return False
    
    def _processar_dados(self):
        """Realiza o pré-processamento e transformações dos dados"""
        # Transformando Selic diária para anualizada
        self.dados['selic_anual'] = (1 + self.dados['selic_diaria']/100).pow(252) - 1
        self.dados['selic_anual'] *= 100
        
        # Preenchendo valores ausentes com o último valor disponível
        self.dados = self.dados.fillna(method='ffill')
        
        # Criando versão mensal dos dados para compatibilidade
        self.dados_mensais = self.dados.resample('MS').mean()
        
        # Calculando variação percentual do PIB
        self.dados_mensais['pib_var'] = self.dados_mensais['pib'].pct_change() * 100
        
        # IPCA acumulado 12 meses
        self.dados_mensais['ipca_acum12m'] = self.dados_mensais['ipca'].rolling(12).sum()
        
        # Removendo linhas com valores ausentes após transformações
        self.dados_mensais = self.dados_mensais.dropna()
    
    def testar_estacionaridade(self, serie):
        """Testa a estacionaridade da série temporal usando o teste ADF"""
        result = adfuller(self.dados_mensais[serie].dropna())
        print(f'Teste ADF para {serie}:')
        print(f'Estatística ADF: {result[0]}')
        print(f'Valor p: {result[1]}')
        print(f'Valores Críticos:')
        for key, value in result[4].items():
            print(f'   {key}: {value}')
        
        if result[1] <= 0.05:
            print("Conclusão: A série é estacionária (rejeita a hipótese nula)")
        else:
            print("Conclusão: A série não é estacionária (não rejeita a hipótese nula)")
    
    def visualizar_series(self):
        """Cria um dashboard interativo com as séries temporais"""
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=(
                'Taxa SELIC Anualizada (%)',
                'Inflação - IPCA (%)',
                'Variação do PIB (%)',
                'Taxa de Câmbio (BRL/USD)'
            ),
            shared_xaxes=True
        )
        
        # SELIC
        fig.add_trace(
            go.Scatter(
                x=self.dados_mensais.index, 
                y=self.dados_mensais['selic_anual'],
                mode='lines',
                name='SELIC',
                line=dict(color='#1f77b4', width=2)
            ),
            row=1, col=1
        )
        
        # IPCA
        fig.add_trace(
            go.Scatter(
                x=self.dados_mensais.index,
                y=self.dados_mensais['ipca'],
                mode='lines',
                name='IPCA Mensal',
                line=dict(color='#d62728', width=2)
            ),
            row=1, col=2
        )
        
        fig.add_trace(
            go.Scatter(
                x=self.dados_mensais.index,
                y=self.dados_mensais['ipca_acum12m'],
                mode='lines',
                name='IPCA Acum. 12 meses',
                line=dict(color='#ff7f0e', width=2, dash='dash')
            ),
            row=1, col=2
        )
        
        # PIB
        fig.add_trace(
            go.Scatter(
                x=self.dados_mensais.index,
                y=self.dados_mensais['pib_var'],
                mode='lines',
                name='Variação do PIB',
                line=dict(color='#2ca02c', width=2)
            ),
            row=2, col=1
        )
        
        # Câmbio
        fig.add_trace(
            go.Scatter(
                x=self.dados_mensais.index,
                y=self.dados_mensais['cambio'],
                mode='lines',
                name='Taxa de Câmbio',
                line=dict(color='#9467bd', width=2)
            ),
            row=2, col=2
        )
        
        # Layout
        fig.update_layout(
            height=800,
            width=1000,
            title_text='Indicadores Econômicos Brasileiros',
            showlegend=True,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
            template='plotly_white',
            hovermode='x unified'
        )
        
        # Adicionar rangeslider
        fig.update_xaxes(rangeslider_visible=True, row=2, col=1)
        fig.update_xaxes(rangeslider_visible=True, row=2, col=2)
        
        fig.show()
    
    def matriz_correlacao(self):
        """Cria uma matriz de correlação interativa entre as variáveis"""
        # Selecionando as variáveis relevantes
        vars_correlacao = ['selic_anual', 'ipca', 'pib_var', 'cambio']
        df_corr = self.dados_mensais[vars_correlacao].copy()
        
        # Calculando a matriz de correlação
        corr_matrix = df_corr.corr()
        
        # Criando o heatmap
        fig = px.imshow(
            corr_matrix,
            text_auto=True,
            color_continuous_scale='RdBu_r',
            zmin=-1, zmax=1,
            title='Matriz de Correlação entre Variáveis Econômicas'
        )
        
        fig.update_layout(
            height=600,
            width=700,
            template='plotly_white'
        )
        
        fig.show()
    
    def analise_dispersao(self):
        """Cria gráficos de dispersão entre as variáveis"""
        # SELIC vs IPCA
        fig = px.scatter(
            self.dados_mensais, 
            x='selic_anual', 
            y='ipca',
            color=self.dados_mensais.index.year,
            size='cambio',
            hover_name=self.dados_mensais.index.strftime('%b %Y'),
            trendline='ols',
            title='Relação entre Taxa SELIC e IPCA',
            labels={
                'selic_anual': 'SELIC Anualizada (%)',
                'ipca': 'IPCA Mensal (%)'
            }
        )
        
        fig.update_layout(
            height=600,
            width=800,
            template='plotly_white'
        )
        
        fig.show()
        
        # Equação da regressão e estatísticas
        import statsmodels.api as sm
        X = sm.add_constant(self.dados_mensais['selic_anual'])
        model = sm.OLS(self.dados_mensais['ipca'], X).fit()
        print(model.summary())
    
    def modelo_var(self, lags=3):
        """Estima um modelo VAR (Vetores Autorregressivos)"""
        # Selecionar variáveis para o modelo
        model_data = self.dados_mensais[['selic_anual', 'ipca', 'pib_var']].dropna()
        
        # Testar estacionaridade de cada série
        for col in model_data.columns:
            self.testar_estacionaridade(col)
            
        # Diferenciação se necessário (descomente se as séries não forem estacionárias)
        # model_data = model_data.diff().dropna()
            
        # Ajustar o modelo VAR
        model = VAR(model_data)
        results = model.fit(lags)
        
        print(results.summary())
        
        # Funções impulso-resposta
        irf = results.irf(10)
        irf.plot(orth=True, response='selic_anual')
        
        # Decomposição da variância
        fevd = results.fevd(10)
        fevd.plot()
        
        return results
    
    def gerar_relatorio(self):
        """Executa a análise completa e gera visualizações"""
        self.visualizar_series()
        self.matriz_correlacao()
        self.analise_dispersao()
        
        print("="*80)
        print("ANÁLISE ECONOMÉTRICA - MODELO VAR")
        print("="*80)
        self.modelo_var(lags=3)
        
        print("\\n")
        print("="*80)
        print("SUGESTÕES PARA APROFUNDAMENTO DA PESQUISA:")
        print("="*80)
        print("1. Teste de causalidade de Granger entre SELIC e IPCA")
        print("2. Decomposição de séries temporais (tendência, sazonalidade, resíduos)")
        print("3. Cointegração e modelos VECM para relações de longo prazo")
        print("4. Inclusão de variáveis exógenas como expectativas de mercado")
        print("5. Análise de quebras estruturais em períodos de crise")


# Exemplo de uso
if __name__ == "__main__":
    # Criar a instância da classe de análise
    analise = AnaliseEconomica()
    
    # Carregar os dados (últimos 10 anos)
    data_inicio = '2013-01-01'
    analise.carregar_dados(data_inicio)
    
    # Executar análise completa
    analise.gerar_relatorio()
`;
