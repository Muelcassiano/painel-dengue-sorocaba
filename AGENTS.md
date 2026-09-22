# Projeto Integrador IV - Painel Dengue Sorocaba

## Informações do Projeto
- **Autor/Usuário**: Samuel Abreu (samuel.abreux@gmail.com)
- **Tema**: Painel de Vigilância Epidemiológica de Arboviroses (Dengue) de Sorocaba/SP (IBGE 355220)
- **Applet ID**: `4a1c0bb8-e825-4779-b2bb-2cafc77dc400`
- **Ano Base**: 2026 (Semana Epidemiológica atual: SE 38)
- **População Estimada (IBGE)**: 723.682 hab.
- **Óbitos Confirmados em 2026**: 0 (Taxa de letalidade: 0,0%)

## Regras e Metodologias do Projeto
1. **Supressão de Bairros no DATASUS / LGPD**:
   - Como o DATASUS removeu dados de logradouro e bairros, o painel utiliza o código de estabelecimento notificador (**CNES**) como **Proxy Territorial Regional** (UPH Zona Norte, UPH Zona Oeste, PA Laranjeiras, PA Éden, PA Brigadeiro Tobias, PA São Bento, CHS, etc.).
2. **Duplo Público**:
   - Visão Cidadão (alertas, unidades de saúde 24h, checklist de 10 minutos).
   - Visão Técnica (Canal Endêmico, taxa de incidência/100k, exportação CSV e boletim PDF).
3. **Deploy & Hospedagem**:
   - Cloud Run (Google AI Studio Build).
   - Compatível com GitHub Pages (`base: './'` em `vite.config.ts` e `.github/workflows/deploy.yml` configurado).
   - Futuras integrações planejadas: OpenStreetMap (Leaflet) e API InfoDengue/Fiocruz.
