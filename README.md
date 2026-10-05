# Painel Interativo de Monitoramento Epidemiológico de Arboviroses (Dengue)
### Município de Sorocaba / SP • Código IBGE: 355220

[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![LGPD Compliant](https://img.shields.io/badge/LGPD-Compliant-008000.svg)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
[![WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG_AAA-brightgreen.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Projeto Desenvolvido por:** **Samuel Abreu**  
> *Engenharia da Computação & Ciência de Dados*  
> **Tema:** Vigilância Epidemiológica, Engenharia de Dados em Saúde Pública e Interfaces Humanizadas.

---

## 📌 Visão Geral do Projeto

O **Painel de Monitoramento Epidemiológico de Dengue de Sorocaba/SP** é uma solução completa de inteligência de dados em saúde pública, projetada para transformar microdados brutos e dispersos do **Sistema de Informação de Agravos de Notificação (SINAN)** em visualizações acionáveis, gráficos de controle e indicadores de tomada de decisão.

A aplicação atende simultaneamente a dois públicos estratégicos:
1. **Equipes de Saúde e Vigilância Epidemiológica (Visão Técnica):** Acesso a ferramentas analíticas consolidadas, como Diagrama de Controle (Canal Endêmico), taxa de incidência por 100 mil habitantes parametrizada pela série histórica de população (2010 a 2026), identificação de cepas virais (DENV-1 a 4), pirâmide demográfica e emissão dinâmica de Boletins Técnicos Oficiais para PDF.
2. **Munícipes e População de Sorocaba (Visão Cidadão):** Interface acessível e inclusiva, orientada à educação em saúde, reconhecimento precoce de sinais de alarme, guia de encaminhamento para unidades de pronto atendimento 24 horas (UPHs e PAs) e checklist semanal interativo de combate a focos do vetor *Aedes aegypti*.

---

## 🎯 Desafio Epidemiológico e Justificativa

A dengue permanece como um dos mais graves desafios sazonais de saúde coletiva no Brasil. Municípios de grande porte, como Sorocaba (população estimada em **766.390 habitantes**), enfrentam flutuações abruptas no volume de transmissão causadas por variações pluviométricas, oscilação de temperatura e introdução de novos sorotipos.

### O Problema da Supressão Territorial (LGPD)
Com o advento da **Lei Geral de Proteção de Dados (Lei nº 13.709/2018)**, as plataformas de dados abertos federais suprimiram variáveis de identificação pessoal, logradouro e bairro para resguardar a privacidade dos pacientes. Essa diretriz inviabilizou mapas de calor tradicionais por endereço.

### A Solução Metodológica: Proxy Territorial por CNES
Para resolver essa lacuna sem comprometer a privacidade do munícipe, este projeto estruturou uma abordagem inovadora: o uso do **Cadastro Nacional de Estabelecimentos de Saúde (CNES)** da unidade notificadora como **Proxy Territorial Regional**. Como a rede pública municipal é distribuída em bacias consolidadas de urgência e atenção primária (UPH Zona Norte, UPH Zona Oeste, PA Laranjeiras, PA Éden, PA São Bento, PA Brigadeiro Tobias e UBSs locais), o volume de atendimento por estabelecimento reflete como a melhor aproximação espacial da intensidade de transmissão de cada macrorregião da cidade.

---

## 🏗️ Arquitetura da Solução & Engenharia de Dados

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 SINAN Online (Sorocaba/SP)                  │
  │     Microdados Oficiais em Arquivos Locais (.dbf/.csv)      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │            Pipeline de Ingestão e Tratamento (Python)       │
  │  • Normalização de colunas essenciais                       │
  │  • Decodificação etária SINAN (horas/dias/meses -> anos)   │
  │  • Mitigação de dados sensíveis (LGPD)                      │
  │  • Zero Descartes: integridade total das notificações       │
  │  • Carga em lotes (batch chunks de 5.000)                   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │          Banco de Dados Relacional (PostgreSQL / Supabase)  │
  │  • Tabela unificada 'notificacoes_dengue' (2010 - 2026)    │
  │  • Tabela histórica de população IBGE (2010 a 2026)         │
  │  • Georreferenciamento de estabelecimentos (CNES)           │
  │  • Stored Procedures (RPCs) pré-agregadas em JSON           │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │             Aplicação Web (React + Vite + TypeScript)       │
  │  • Duplo Modo: Visão Cidadão / Visão Técnica                │
  │  • Canal Endêmico Recharts com limites de alerta/esperado   │
  │  • Gerador Dinâmico de Boletim Epidemiológico (PDF)         │
  │  • Acessibilidade WCAG AAA (Alto Contraste e Fonte Dinâmica)│
  └─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tecnologias Empregadas

### Front-End & Visualização
- **React 18**: Arquitetura modular baseada em componentes reutilizáveis e hooks declarativos.
- **TypeScript**: Tipagem estática rigorosa para garantir estabilidade e previsibilidade de dados clínicos e epidemiológicos.
- **Vite**: Ferramenta de build de última geração com bundling ultrarrápido baseado em ES Modules.
- **Tailwind CSS**: Estilização utilitária de alto desempenho, garantindo responsividade fluida em celulares, tablets e desktops.
- **Recharts**: Renderização de diagramas de controle, séries temporais, gráficos de dispersão e pirâmides etárias.
- **Lucide React**: Iconografia contextual para navegação intuitiva.

### Back-End & Engenharia de Dados
- **PostgreSQL 15+ (Supabase)**: Banco de dados relacional robusto com modelagem colunar compacta (média de ~45 bytes por registro), permitindo que **mais de 500.000 notificações históricas ocupem menos de 30 MB** (menos de 6% da cota gratuita de 500 MB).
- **Stored Procedures / RPCs**: Consultas complexas executadas no nível do banco que entregam respostas agregadas prontas em JSON (< 5 KB), poupando memória e tempo de execução.
- **Python (Pandas, SimpleDBF, DBFRead, Psycopg2)**: Pipeline local automatizado para ingestão contínua com técnica de Upsert idempotente (`ON CONFLICT (nu_notific, ano_notif) DO UPDATE`).

---

## 📊 Estrutura de Dados & Séries Oficiais

### Série Histórica Populacional (IBGE / SEADE)
Para garantir a exatidão no cálculo da Taxa de Incidência (casos por 100.000 habitantes), o sistema incorpora a série populacional de Sorocaba com atualização censitária:

| Período | População Estimada | Fonte Oficial |
| :---: | :---: | :---: |
| **2010** | 586.625 hab. | Censo Demográfico IBGE |
| **2015** | 644.919 hab. | Estimativa IBGE |
| **2020** | 687.357 hab. | Estimativa IBGE |
| **2022** | 723.574 hab. | Censo Demográfico IBGE |
| **2023** | 740.571 hab. | Estimativa IBGE |
| **2024** | 757.459 hab. | Estimativa IBGE |
| **2025** | 762.172 hab. | Estimativa IBGE |
| **2026** | **766.390 hab.** | Projeção Oficial |

---

## 🌟 Principais Funcionalidades da Aplicação

### 1. Visão Técnica (Vigilância em Saúde)
- **Canal Endêmico (Diagrama de Controle):** Acompanhamento semanal das notificações perante limites estatísticos (Zona de Sucesso, Esperado, Alerta e Epidêmico).
- **Taxa de Incidência por 100k hab.:** Classificação automática por faixas de risco do Ministério da Saúde (Baixa `<100`, Média `100-300`, Alta `>300`, Epidêmica `>500`).
- **Proxy Territorial CNES:** Tabela analítica com positividade, casos graves e total notificado por unidade notificadora regional.
- **Pirâmide Etária & Gênero:** Visualização da distribuição dos casos confirmados por faixa etária e sexo biológico.
- **Exportação de Dados:** Exportação da série temporal em formato CSV para modelagem estatística externa.
- **Boletim Técnico Dinâmico (PDF):** Página parametrizada com filtros dinâmicos de ano (2010 a 2026) e semana epidemiológica, formatada em layout A4 oficial para impressão ou salvamento em PDF.

### 2. Visão Cidadão (Munícipe)
- **Painel Resumo Sem Jargões:** Alertas claros sobre o cenário atual do município.
- **Guia Clínico de Sinais de Alarme:** Instruções visuais de urgência (dor abdominal intensa, sangramento de mucosas, vômitos persistentes e lipotimia).
- **Localizador de Unidades 24 Horas:** Consulta rápida aos polos de pronto atendimento (UPHs e PAs) com telefones e rotas.
- **Checklist Preventivo Semanal:** Lista de verificação em 10 minutos para eliminação de criadouros domésticos.

### 3. Acessibilidade Universal (e-MAG / WCAG 2.2 AAA)
Projetada em estrita conformidade com as diretrizes do **Modelo de Acessibilidade em Governo Eletrônico (e-MAG)** do Governo Federal brasileiro e os critérios de nível **AAA** da **Web Content Accessibility Guidelines (WCAG 2.2 / W3C)**, a aplicação implementa uma infraestrutura completa de inclusão digital para todos os perfis de munícipes:

#### 🔠 Motor de Escalabilidade Tipográfica Dinâmica (`A- / A / A+`)
Diferente de abordagens triviais baseadas em classes CSS pontuais ou zooms estáticos de navegador que quebram layouts, a aplicação utiliza um motor de escalabilidade tipográfica em tempo real que reescreve a raiz percentual do documento (`document.documentElement.style.fontSize`). Como todo o ecossistema visual (Tailwind CSS) está estruturado em unidades relativas `rem`, essa técnica garante redimensionamento proporcional e harmonioso de textos, botões, tabelas, espaçamentos e contêineres:

| Controle | Cliques Acumulados | Escala Percentual | Tamanho Base | Cenário de Uso Recomendado |
| :---: | :---: | :---: | :---: | :--- |
| **A-** | 2 cliques *(Limite Mínimo)* | **80%** (`step: -2`) | 12.8px | Visualização de alta densidade em monitores widescreen ou para usuários com visão aguçada. |
| **A-** | 1 clique | **90%** (`step: -1`) | 14.4px | Redução leve para visualização confortável de tabelas densas e séries históricas extensas. |
| **A** | *Reset Nominal* | **100%** (`step: 0`) | 16.0px | **Padrão Oficial de Fábrica:** Proporções nominais do design institucional de Sorocaba. |
| **A+** | 1 clique | **112,5%** (`step: +1`) | 18.0px | Primeiro nível de conforto óptico para leitura continuada sem esforço visual. |
| **A+** | 2 cliques | **125%** (`step: +2`) | 20.0px | Ampliação substancial recomendada para munícipes idosos ou com presbiopia/baixa visão moderada. |
| **A+** | 3 cliques *(Limite Máximo)* | **137,5%** (`step: +3`) | 22.0px | **Nível Máximo de Inclusão:** Leitura acessível para pessoas com baixa visão severa, sem sobreposição de textos ou perda de navegabilidade. |

- **Feedback Visual de Estado Ativo:** Os botões de controle contam com sinalização cromática imediata (`bg-amber-400 text-slate-950 font-black shadow-inner` quando `A-` ou `A+` estão ativos, e realce translúcido no `A` quando em estado nominal), além de atributos de acessibilidade para tecnologias assistivas (`aria-pressed`, `aria-label` e `role="group"`).
- **Persistência de Sessão (`localStorage`):** A escala escolhida pelo usuário é gravada automaticamente no navegador (`sorocaba_font_step`), assegurando que a navegação entre a Visão Cidadão, Visão Técnica e eventuais recarregamentos de página mantenham a preferência do usuário intacta.

#### 👁️ Modo Alto Contraste (High Contrast Mode)
- **Taxa de Contraste Superior a 7:1:** Supera a métrica exigida para WCAG AAA (7:1 para texto normal e 4.5:1 para texto grande) por meio de um fundo preto puro (`#000000`), tipografia e ícones em amarelo ouro de alta luminância (`#FACC15`) e contornos em alto realce.
- **Inclusão Oftalmológica:** Proporciona leitura imediata para cidadãos com daltonismo acentuado, catarata, retinopatia diabética ou fotofobia.
- **Sincronização Global:** Ativa a classe utilitária `.high-contrast` em toda a árvore do DOM e persiste o estado (`sorocaba_contrast`).

#### 🌓 Alternância Cromática Institucional (Modos Claro e Escuro)
- **Modo Claro (Padrão):** Paleta elegante fundamentada no azul brasão municipal de Sorocaba (`#003865`), azul céu (`#0284c7`) e âmbar alerta (`#f59e0b`).
- **Modo Escuro (Dark Mode):** Fundo repousante em azul ardósia profundo (`#0a0f1d` e `#0B1528`), minimizando a emissão de luz azul e a fadiga visual em turnos noturnos de trabalho da vigilância em saúde.

#### ⌨️ Navegação por Teclado e Tecnologias Assistivas
- **Semântica WAI-ARIA Integral:** Estruturação lógica com `role="tab"`, `role="tablist"`, `aria-selected`, `aria-controls` e rótulos contextuais explícitos.
- **Focus Rings Visíveis:** Foco de teclado nítido em todos os elementos clicáveis e campos de entrada de dados, viabilizando o uso exclusivo via tecla `Tab`.
- **Compatibilidade com Leitores de Tela:** Estrutura inspecionada e validada para leitura por NVDA, Orca, VoiceOver e TalkBack.

---

## 🔒 Conformidade com a LGPD e Segurança da Informação

- **Anonimização na Origem:** O pipeline de ingestão desconsidera nomes de pacientes, números de documentos (CPF/RG), nomes de responsáveis e dados residenciais de logradouro.
- **Chave Composta e Idempotência:** Prevenção de duplicidades de registros por meio de indexação única no par `(nu_notific, ano_notif)`.
- **Row Level Security (RLS):** Diretivas ativas no PostgreSQL garantindo permissões estritas de leitura anônima apenas para consultas públicas e proteção de chaves de serviço no backend.

---

## 👤 Autor

**Samuel Abreu**  
*Desenvolvedor de Software & Cientista de Dados*  
- **Email:** [samuel.abreux@gmail.com](mailto:samuel.abreux@gmail.com)  
- **Foco de Atuação:** Engenharia de Dados, Aplicações Web de Alta Performance, Arquitetura em Nuvem e Soluções para o Setor Público.

---

*Painel Interativo de Monitoramento Epidemiológico de Sorocaba/SP • Projeto Integrador IV • Univesp 2026*
