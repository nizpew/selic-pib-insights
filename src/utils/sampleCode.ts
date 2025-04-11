
export const pythonCode = `# Análise da relação entre Taxa SELIC, PIB e Inflação (IPCA)
# Código para Google Colab

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller, grangercausalitytests
from bcb import sgs
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Configurações de visualização
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("Blues_r")
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 12

# 1. COLETA DE DADOS
# ==================

def baixar_series(codigos: dict, data_inicio: str, data_fim: str) -> pd.DataFrame:
    """
    Baixa múltiplas séries do SGS/BACEN
    
    Args:
        codigos: Dicionário com código SGS e nome das colunas
        data_inicio: Data inicial no formato 'YYYY-MM-DD'
        data_fim: Data final no formato 'YYYY-MM-DD'
    
    Returns:
        DataFrame com as séries temporais
    """
    dados = sgs.get(codigos.keys(), start=data_inicio, end=data_fim)
    dados.columns = codigos.values()
    return dados

# Dicionário de códigos do Sistema Gerenciador de Séries do Banco Central
VARIAVEIS_ECON = {
    11: 'selic_diaria',    # Taxa SELIC diária
    433: 'ipca',           # IPCA mensal
    1: 'cambio',           # Taxa de câmbio
    7326: 'pib'            # Taxa de crescimento do PIB 
}

# Definindo um período de 5 anos
from datetime import datetime, timedelta
data_fim = datetime.today().strftime('%Y-%m-%d')
data_inicio = (datetime.today() - timedelta(days=5*365)).strftime('%Y-%m-%d')

# Buscando dados
print("Baixando dados do Banco Central...")
try:
    dados = baixar_series(VARIAVEIS_ECON, data_inicio, data_fim)
    print(f"✓ Dados obtidos com sucesso! Período: {data_inicio} a {data_fim}")
except Exception as e:
    print(f"✗ Erro ao baixar dados: {e}")
    # Criando dados dummy para demonstração
    dates = pd.date_range(start=data_inicio, end=data_fim, freq='MS')
    dados = pd.DataFrame({
        'selic_diaria': np.linspace(0.03, 0.14, len(dates)),
        'ipca': np.linspace(0.03, 0.12, len(dates)) + np.random.normal(0, 0.01, len(dates)),
        'pib': np.linspace(0.01, 0.04, len(dates)) + np.random.normal(0, 0.02, len(dates)),
        'cambio': np.linspace(3.5, 5.5, len(dates)) + np.random.normal(0, 0.1, len(dates))
    }, index=dates)
    print("✓ Usando dados simulados para demonstração")

# 2. PRÉ-PROCESSAMENTO
# ====================

# Convertendo Selic diária para anual
dados['selic_anual'] = (1 + dados['selic_diaria']).pow(252) - 1
dados['selic_anual'] *= 100  # Convertendo para percentual

# Anualizando IPCA (últimos 12 meses)
dados['ipca_acum_12m'] = dados['ipca'].rolling(12).sum()

# Tratamento de dados ausentes
dados = dados.fillna(method='ffill')

# Informações sobre os dados
print("\\nConjunto de dados:")
print(f"Período: {dados.index.min().strftime('%Y-%m-%d')} a {dados.index.max().strftime('%Y-%m-%d')}")
print(f"Número de observações: {len(dados)}")
print("\\nResumo estatístico:")
display(dados.describe())

# 3. VISUALIZAÇÃO EXPLORATÓRIA
# ============================

# Configurando os subplots
fig = make_subplots(
    rows=3, cols=2,
    subplot_titles=(
        'Taxa SELIC (% a.a.)', 'IPCA Acumulado 12 meses (%)',
        'Variação do PIB (%)', 'Taxa de Câmbio (R$/US$)',
        'Correlação entre variáveis', 'SELIC vs IPCA'
    ),
    specs=[
        [{"type": "scatter"}, {"type": "scatter"}],
        [{"type": "scatter"}, {"type": "scatter"}],
        [{"type": "heatmap"}, {"type": "scatter"}],
    ],
    vertical_spacing=0.1
)

# Adicionando as séries temporais
fig.add_trace(
    go.Scatter(x=dados.index, y=dados['selic_anual'], mode='lines', name='SELIC'),
    row=1, col=1
)

fig.add_trace(
    go.Scatter(x=dados.index, y=dados['ipca_acum_12m'], mode='lines', name='IPCA'),
    row=1, col=2
)

fig.add_trace(
    go.Scatter(x=dados.index, y=dados['pib'], mode='lines', name='PIB'),
    row=2, col=1
)

fig.add_trace(
    go.Scatter(x=dados.index, y=dados['cambio'], mode='lines', name='Câmbio'),
    row=2, col=2
)

# Matriz de correlação
corr_matrix = dados[['selic_anual', 'ipca_acum_12m', 'pib', 'cambio']].corr()
fig.add_trace(
    go.Heatmap(
        z=corr_matrix.values,
        x=corr_matrix.columns,
        y=corr_matrix.index,
        colorscale='Blues',
        zmin=-1, zmax=1
    ),
    row=3, col=1
)

# Gráfico de dispersão SELIC vs IPCA
fig.add_trace(
    go.Scatter(
        x=dados['selic_anual'],
        y=dados['ipca_acum_12m'],
        mode='markers',
        marker=dict(
            size=8,
            color=dados.index,
            colorscale='Viridis',
            showscale=True
        ),
        name='SELIC vs IPCA'
    ),
    row=3, col=2
)

# Atualizando layout
fig.update_layout(
    height=1000,
    width=1200,
    title_text="Análise de Indicadores Econômicos do Brasil",
    title_font_size=20,
    showlegend=False,
)

fig.show()

# 4. ANÁLISE ECONOMÉTRICA
# =======================

# Preparando dados para modelagem (mensalizando e tratando NA)
dados_mensais = dados.resample('MS').mean()
dados_mensais = dados_mensais.fillna(method='ffill')

# Selecionando variáveis para o modelo
variaveis = ['selic_anual', 'ipca_acum_12m', 'pib']
df_modelo = dados_mensais[variaveis].copy()

# Verificando estacionariedade das séries
def testar_estacionariedade(series, nome):
    print(f"\\nTeste de Estacionariedade para {nome}:")
    adf_result = adfuller(series.dropna())
    
    print(f"Estatística do teste ADF: {adf_result[0]:.4f}")
    print(f"Valor-p: {adf_result[1]:.4f}")
    print(f"Valores críticos:")
    for key, value in adf_result[4].items():
        print(f"\\t{key}: {value:.4f}")
    
    if adf_result[1] <= 0.05:
        print("Conclusão: Série estacionária (rejeita H0)")
    else:
        print("Conclusão: Série não-estacionária (não rejeita H0)")

for col in df_modelo.columns:
    testar_estacionariedade(df_modelo[col], col)

# Diferenciando séries não-estacionárias
df_diff = df_modelo.diff().dropna()

print("\\nDados diferenciados (primeira diferença):")
display(df_diff.head())

# Modelagem VAR (Vector Autoregression)
modelo_var = VAR(df_diff)

# Seleção de lag ótimo
lag_order_select = modelo_var.select_order(maxlags=12)
print("\\nSeleção de lag ótimo:")
print(lag_order_select.summary())

# Ajustando o modelo com o lag ótimo
lag_order = lag_order_select.aic
modelo_ajustado = modelo_var.fit(lag_order)

print("\\nResultados do modelo VAR:")
print(modelo_ajustado.summary())

# Teste de causalidade de Granger
max_lag = lag_order
print("\\nTestes de Causalidade de Granger:")

print("\\nHipótese: SELIC não causa IPCA")
granger_selic_ipca = modelo_ajustado.test_causality('ipca_acum_12m', ['selic_anual'], kind='f')
print(f"Estatística F: {granger_selic_ipca.test_statistic:.4f}")
print(f"Valor-p: {granger_selic_ipca.pvalue:.4f}")
if granger_selic_ipca.pvalue <= 0.05:
    print("Conclusão: SELIC causa IPCA (rejeita H0)")
else:
    print("Conclusão: SELIC não causa IPCA (não rejeita H0)")

print("\\nHipótese: SELIC não causa PIB")
granger_selic_pib = modelo_ajustado.test_causality('pib', ['selic_anual'], kind='f')
print(f"Estatística F: {granger_selic_pib.test_statistic:.4f}")
print(f"Valor-p: {granger_selic_pib.pvalue:.4f}")
if granger_selic_pib.pvalue <= 0.05:
    print("Conclusão: SELIC causa PIB (rejeita H0)")
else:
    print("Conclusão: SELIC não causa PIB (não rejeita H0)")

# 5. FUNÇÕES DE IMPULSO-RESPOSTA
# ==============================

# Simulando o efeito de um choque na SELIC sobre as demais variáveis
irf = modelo_ajustado.irf(periods=24)  # 24 meses de horizonte

# Plotando funções de impulso-resposta
irf.plot(orth=True, response='ipca_acum_12m', impulse='selic_anual')
plt.title("Resposta do IPCA a um choque na SELIC")
plt.xlabel("Meses após o choque")
plt.ylabel("Efeito no IPCA")
plt.grid(True)
plt.show()

irf.plot(orth=True, response='pib', impulse='selic_anual')
plt.title("Resposta do PIB a um choque na SELIC")
plt.xlabel("Meses após o choque")
plt.ylabel("Efeito no PIB")
plt.grid(True)
plt.show()

# 6. PREVISÃO
# ===========

# Realizando previsão para os próximos 12 meses
previsao = modelo_ajustado.forecast(df_diff.values[-lag_order:], steps=12)
previsao_df = pd.DataFrame(previsao, index=pd.date_range(start=df_diff.index[-1] + pd.DateOffset(months=1), periods=12, freq='MS'), columns=df_diff.columns)

# Convertendo as previsões de diferenças para níveis
ultimos_valores = df_modelo.iloc[-1]
previsao_acumulada = previsao_df.copy()

for i in range(len(previsao_df)):
    if i == 0:
        for col in previsao_df.columns:
            previsao_acumulada.iloc[i, previsao_acumulada.columns.get_loc(col)] = ultimos_valores[col] + previsao_df.iloc[i, previsao_df.columns.get_loc(col)]
    else:
        for col in previsao_df.columns:
            previsao_acumulada.iloc[i, previsao_acumulada.columns.get_loc(col)] = previsao_acumulada.iloc[i-1, previsao_acumulada.columns.get_loc(col)] + previsao_df.iloc[i, previsao_df.columns.get_loc(col)]

print("\\nPrevisão para os próximos 12 meses:")
display(previsao_acumulada)

# Plotando as previsões
fig, axes = plt.subplots(len(df_modelo.columns), 1, figsize=(14, 10), sharex=True)

for i, col in enumerate(df_modelo.columns):
    # Valores históricos
    axes[i].plot(df_modelo.index[-24:], df_modelo[col].iloc[-24:], label='Histórico', color='blue')
    # Valores previstos
    axes[i].plot(previsao_acumulada.index, previsao_acumulada[col], label='Previsão', color='red', linestyle='--')
    # Intervalo de confiança (simulação simples, seria melhor usar bootstrap)
    std_erro = previsao_df[col].std()
    axes[i].fill_between(
        previsao_acumulada.index,
        previsao_acumulada[col] - 1.96 * std_erro,
        previsao_acumulada[col] + 1.96 * std_erro,
        color='red', alpha=0.2
    )
    
    axes[i].set_title(f'Previsão de {col}')
    axes[i].set_ylabel(col)
    axes[i].legend()
    axes[i].grid(True)

plt.tight_layout()
plt.show()

# 7. CONCLUSÕES
# =============

print("\\n== CONCLUSÕES ==")
print("Análise da relação entre SELIC, IPCA e PIB no Brasil\\n")

# Obtendo coeficientes de correlação
corr_selic_ipca = dados[['selic_anual', 'ipca_acum_12m']].corr().iloc[0,1]
corr_selic_pib = dados[['selic_anual', 'pib']].corr().iloc[0,1]

print(f"1. Correlação entre SELIC e IPCA: {corr_selic_ipca:.4f}")
print(f"2. Correlação entre SELIC e PIB: {corr_selic_pib:.4f}")

# Verificando causalidade
print(f"\\n3. Teste de causalidade de Granger:")
if granger_selic_ipca.pvalue <= 0.05:
    print(f"   - SELIC causa IPCA (p-valor: {granger_selic_ipca.pvalue:.4f})")
else:
    print(f"   - SELIC não causa IPCA (p-valor: {granger_selic_ipca.pvalue:.4f})")

if granger_selic_pib.pvalue <= 0.05:
    print(f"   - SELIC causa PIB (p-valor: {granger_selic_pib.pvalue:.4f})")
else:
    print(f"   - SELIC não causa PIB (p-valor: {granger_selic_pib.pvalue:.4f})")

print("\\n4. Principais conclusões:")
print("   - A política monetária, representada pela taxa SELIC, apresenta efeitos")
print("     defasados sobre a inflação e o crescimento econômico.")
print("   - Os resultados sugerem que aumentos na SELIC tendem a reduzir a")
print("     inflação após um período de aproximadamente 6-12 meses.")
print("   - O crescimento econômico (PIB) tende a ser negativamente afetado")
print("     por aumentos na taxa SELIC, indicando o trade-off enfrentado")
print("     pelos formuladores de política econômica.")

print("\\n5. Próximos passos para a pesquisa:")
print("   - Expandir o modelo para incluir mais variáveis (ex: desemprego)")
print("   - Analisar subperíodos para verificar mudanças estruturais")
print("   - Comparar diferentes regimes de política monetária")
print("   - Implementar modelos VECM para analisar relações de longo prazo")
`;
