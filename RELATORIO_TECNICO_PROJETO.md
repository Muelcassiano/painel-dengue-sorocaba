# Relatório Técnico & Guia do Painel Dengue Sorocaba

Este documento consolida toda a arquitetura, fonte de dados, metodologia epidemiológica, guia de navegação e instruções para exportação e continuidade do projeto.

---

## 1. Onde a Aplicação Está Hospedada?

Atualmente, a aplicação está provisionada e rodando em um contêiner gerenciado no **Google Cloud (Cloud Run)** com integração direta pelo **Google AI Studio Build**:

- **URL de Desenvolvimento (Ambiente Ativo):**  
  `https://ais-dev-s7vetkkkh4ckyroxcyecfs-551854462918.us-east1.run.app`
- **URL Compartilhável de Pré-visualização:**  
  `https://ais-pre-s7vetkkkh4ckyroxcyecfs-551854462918.us-east1.run.app`

---

## 2. Como Baixar Localmente e Subir para o seu GitHub

Você pode exportar a aplicação de duas formas simples:

### Opção A: Pelo Menu do Google AI Studio (Exportação Direta)
1. No topo da tela do AI Studio, clique no menu de opções (ícone de engrenagem / menu de configurações ou três pontos).
2. Escolha uma das opções:
   - **"Export to GitHub"**: Conecte sua conta do GitHub e o AI Studio criará um novo repositório com todos os arquivos atualizados automaticamente.
   - **"Download ZIP"**: Baixa um arquivo `.zip` completo do projeto limpo (sem `node_modules`), pesando menos de 1 MB.

### Opção B: Rodando na sua Máquina Local (VS Code)
Após baixar ou clonar o projeto:
```bash
# 1. Entre na pasta do projeto
cd painel-dengue-sorocaba

# 2. Instale as dependências limpas
npm install

# 3. Inicie o servidor local
npm run dev
```
A aplicação abrirá instantaneamente em `http://localhost:3000`.

---

## 3. Origem dos Dados Atuais e Metodologia

### De Onde Vieram os Dados Iniciais?
- **População Base:** 723.682 habitantes (Censo IBGE Sorocaba).
- **Código do Município:** 355220 (Sorocaba/SP).
- **Rede de Saúde:** Cadastrada com os códigos CNES oficiais da Prefeitura de Sorocaba (UPH Zona Norte, UPH Zona Oeste, PA Laranjeiras, PA São Bento, PA Éden, PA Brigadeiro Tobias, Conjunto Hospitalar de Sorocaba - CHS, Santa Casa, etc.).
- **Óbitos em 2026:** Atualizado para **0 óbitos confirmados** (Letalidade: 0,0%).
- **Série Histórica e Sazonalidade:** Baseada na curva padrão de arboviroses do interior paulista com pico entre fevereiro e abril (SE 05 a SE 16).

---

## 4. Guia Detalhado de Cada Botão e Funcionalidade

### Barra Superior e Acessibilidade:
- **`A- / A / A+` (Ajuste de Fonte):** Aumenta ou diminui dinamicamente a escala tipográfica de todo o painel, garantindo conformidade com a norma de acessibilidade e-MAG / WCAG.
- **`Alto Contraste`:** Aplica um esquema de cores de alto contraste (fundo preto com elementos amarelos puros), indicado para munícipes e profissionais com baixa visão ou fotofobia.
- **`Claro / Escuro`:** Alterna entre a paleta institucional azul e branca da Prefeitura e o modo noturno para descanso visual.
- **`Nota Técnica`:** Abre o modal explicando a razão da ausência de bairros no DATASUS (LGPD) e como o CNES substitui essa métrica.

### Botão "Inserir Dados":
- **O que ele faz?**  
  Ele abre uma janela onde você ou os técnicos podem colar um arquivo **JSON** ou **linhas de CSV** geradas pelo seu script local em Python (`ingestao/saida`).
- **Ele puxa de onde?**  
  Atualmente, ele funciona como um leitor direto no navegador (Client-Side Ingestion). Você cola os dados que o seu script processou do DATASUS ou da base municipal e o painel atualiza os gráficos sem necessidade de banco de dados externo ou servidor intermediário.

### Botão "Exportar Dados (CSV)":
- Localizado na Visão Técnica. Gera instantaneamente um arquivo `.csv` estruturado com as Semanas Epidemiológicas, casos notificados, confirmados e limites do Canal Endêmico, pronto para ser aberto no Excel ou anexado a relatórios da Secretaria da Saúde.

### Chave de Modos:
1. **Visão Cidadão (Munícipe):**
   - Linguagem clara e desprovida de termos médicos complexos.
   - Sinais de alerta com conduta clara ("Quando ir para a UPH").
   - Localizador de unidades de saúde com filtros por zona de Sorocaba, endereço e telefone.
   - Checklist interativo semanal de 10 minutos para eliminação de criadouros.
2. **Visão Técnica (Vigilância):**
   - Diagrama de Controle / Canal Endêmico (OMS/Borkow).
   - Taxa de incidência por 100 mil habitantes.
   - Distribuição por CNES (Proxy territorial regional).
   - Sorotipos circulantes e pirâmide demográfica etária/sexo.

---

## 5. Como Integrar com Outros Portais ou Sistemas

### Integração via `<iframe>` (Incorporação em Sites Existentes)
Você pode incorporar este painel em qualquer página da Prefeitura, faculdade ou blog adicionando:
```html
<iframe 
  src="https://ais-pre-s7vetkkkh4ckyroxcyecfs-551854462918.us-east1.run.app" 
  width="100%" 
  height="900" 
  style="border:none; border-radius: 12px;"
  title="Painel Dengue Sorocaba">
</iframe>
```

---

## 6. Próximos Passos e Roadmap Futuro

1. **Integração com OpenStreetMap (Leaflet):**
   - Utilizar a biblioteca `leaflet` e `react-leaflet` para plotar marcadores geográficos interativos nas coordenadas das unidades de saúde de Sorocaba já presentes no arquivo `sorocabaDengueData.ts`.
2. **Consumo de API Externa em Tempo Real:**
   - Conectar com a API aberta do **InfoDengue (Fiocruz)** pelo endpoint:
     `https://info.dengue.mat.br/api/alertcity?geocode=355220&disease=dengue`
   - Isso permite que o painel receba dados epidemiológicos semanais oficiais automaticamente via internet.
3. **Cruzamento com Bases Internas da Zoonoses de Sorocaba:**
   - Se a equipe tiver planilhas com dados agregados por distrito sanitário (Norte, Sul, Leste, Oeste), podemos adicioná-los diretamente na pasta `src/data/`.
