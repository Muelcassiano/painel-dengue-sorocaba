# Painel Dengue Sorocaba • Projeto Integrador IV

Aplicação web institucional de monitoramento epidemiológico e apoio à vigilância em saúde do município de Sorocaba/SP (Código IBGE 355220).

## Funcionalidades
- **Duplo Modo de Visualização**:
  - **Visão Cidadão**: Informações de prevenção, sinais de alarme e busca de unidades de saúde (UPHs, PAs e UBSs).
  - **Visão Técnica**: Diagrama de controle (Canal Endêmico), taxa de incidência, proxy territorial por CNES, pirâmide demográfica e sorotipos virais.
- **Acessibilidade e Usabilidade**:
  - Ajuste dinâmico de fonte (A-, A, A+).
  - Alto Contraste (WCAG AAA).
  - Modo Claro e Modo Escuro com as cores institucionais da Prefeitura de Sorocaba.
- **Metodologia Epidemiológica**:
  - Mitigação da supressão de bairros pelo DATASUS (LGPD) através de agrupamento por estabelecimentos de saúde notificadores.

## Como Executar Localmente
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Consulte o arquivo `RELATORIO_TECNICO_PROJETO.md` para documentação detalhada.
