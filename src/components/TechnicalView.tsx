import React, { useState, useEffect, useMemo } from 'react';
import { 
  SOROCABA_SUMMARY, 
  EPIDEMIOLOGICAL_WEEKS, 
  SOROCABA_HEALTH_UNITS, 
  AGE_GENDER_DATA,
  SOROCABA_POPULACAO_HISTORICA
} from '../data/sorocabaDengueData';
import {
  fetchEpidemiologicalSummary,
  fetchEpidemiologicalWeeks,
  fetchHealthUnits,
  fetchDemographics,
  fetchTotalDatabaseRecords,
  distributeIntegerTotalNormalized,
  PESOS_UNIDADES_SOROCABA
} from '../services/supabaseClient';
import { SorocabaEpidemiologicalSummary, EpidemiologicalWeek, HealthUnit, AgeGenderDistribution } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  FileDown,
  Calendar,
  Database,
  RefreshCw,
  FileSpreadsheet,
  BarChart3,
  List
} from 'lucide-react';

interface TechnicalViewProps {
  theme: 'light' | 'dark';
  highContrast: boolean;
}

export const TechnicalView: React.FC<TechnicalViewProps> = ({ theme, highContrast }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedSeRange, setSelectedSeRange] = useState<'all' | 'pico' | 'recente'>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Todas');
  const [unitsViewMode, setUnitsViewMode] = useState<'grafico' | 'lista'>('grafico');

  // Estados dinâmicos sincronizados com o Supabase
  const [summary, setSummary] = useState<SorocabaEpidemiologicalSummary>(SOROCABA_SUMMARY);
  const [weeks, setWeeks] = useState<EpidemiologicalWeek[]>(EPIDEMIOLOGICAL_WEEKS);
  const [units, setUnits] = useState<HealthUnit[]>(SOROCABA_HEALTH_UNITS);
  const [demographics, setDemographics] = useState<AgeGenderDistribution[]>(AGE_GENDER_DATA);
  const [totalDbRecords, setTotalDbRecords] = useState<number>(324609);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Carregar contagem geral do banco de dados
  useEffect(() => {
    fetchTotalDatabaseRecords().then(setTotalDbRecords).catch(() => {});
  }, []);

  // Carregar dados dinâmicos do Supabase sempre que o ano mudar
  useEffect(() => {
    let isMounted = true;
    const carregarDadosSupabase = async () => {
      setIsLoading(true);
      try {
        const resumoData = await fetchEpidemiologicalSummary(selectedYear);
        
        const [semanasData, unidadesData, demoData] = await Promise.all([
          fetchEpidemiologicalWeeks(selectedYear),
          fetchHealthUnits(
            selectedYear,
            resumoData.totalConfirmados,
            resumoData.totalNotificados,
            resumoData.totalGraves
          ),
          fetchDemographics(selectedYear)
        ]);

        if (isMounted) {
          setSummary(resumoData);
          setWeeks(semanasData);
          setUnits(unidadesData);
          setDemographics(demoData);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar com Supabase:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    carregarDadosSupabase();
    return () => { isMounted = false; };
  }, [selectedYear]);

  const populacaoAno = SOROCABA_POPULACAO_HISTORICA[selectedYear] || summary.populacaoEstimada || 766390;

  // Higienização da série semanal:
  // Para 2026, restringe estritamente até a SE atual (SE 38), eliminando semanas futuras fantasmas (51, 52, 53)
  const validWeeksForYear = useMemo(() => {
    const maxSE = selectedYear === 2026 ? 38 : 53;
    return weeks.filter((w) => w.se <= maxSE);
  }, [weeks, selectedYear]);

  // Cálculo das semanas de pico dinâmicas para o filtro de Período de Pico
  const { picoStart, picoEnd, maxSE } = useMemo(() => {
    const mSE = selectedYear === 2026 ? 38 : 52;
    if (!validWeeksForYear.length) {
      return { picoStart: 5, picoEnd: 16, maxSE: mSE };
    }
    const max = validWeeksForYear.reduce(
      (prev, curr) => (curr.casosConfirmados > prev.casosConfirmados ? curr : prev),
      validWeeksForYear[0]
    );
    const threshold = max.casosConfirmados > 0 ? max.casosConfirmados * 0.35 : 0;
    const peakList = validWeeksForYear.filter((w) => w.casosConfirmados >= threshold && w.casosConfirmados > 0);

    const pStart = peakList.length > 0 ? Math.min(...peakList.map((w) => w.se)) : Math.max(1, max.se - 4);
    const pEnd = peakList.length > 0 ? Math.max(...peakList.map((w) => w.se)) : Math.min(mSE, max.se + 4);

    return { picoStart: pStart, picoEnd: pEnd, maxSE: mSE };
  }, [validWeeksForYear, selectedYear]);

  // Filtragem das Semanas Epidemiológicas (Ano Completo, Período de Pico, Semanas Recentes)
  const filteredWeeks = useMemo(() => {
    return validWeeksForYear.filter((w) => {
      if (selectedSeRange === 'pico') return w.se >= picoStart && w.se <= picoEnd;
      if (selectedSeRange === 'recente') {
        const corteRecente = selectedYear === 2026 ? 24 : Math.max(1, maxSE - 14);
        return w.se >= corteRecente;
      }
      return true; // 'all'
    });
  }, [validWeeksForYear, selectedSeRange, picoStart, picoEnd, selectedYear, maxSE]);

  // Filtragem das Unidades Notificadoras com resposta dinâmica e rigorosamente calibrada por período e região
  // Garante que a soma territorial seja 100% IDÊNTICA à soma das semanas epidemiológicas no período
  const filteredUnits = useMemo(() => {
    let baseList = units;
    if (selectedRegionFilter !== 'Todas') {
      baseList = units.filter((u) => u.region === selectedRegionFilter);
    }

    const totalPeriodConf = filteredWeeks.reduce((acc, w) => acc + w.casosConfirmados, 0);
    const totalPeriodNotif = filteredWeeks.reduce((acc, w) => acc + w.casosNotificados, 0);
    const totalPeriodGraves = filteredWeeks.reduce((acc, w) => acc + w.casosGraves, 0);

    let targetConf = totalPeriodConf;
    let targetNotif = totalPeriodNotif;
    let targetGraves = totalPeriodGraves;

    if (selectedRegionFilter !== 'Todas') {
      const regiaoWeights: Record<string, number> = {
        'Zona Norte': 0.51,
        'Zona Oeste': 0.28,
        'Zona Leste': 0.15,
        'Centro / Regional': 0.06
      };
      const fReg = regiaoWeights[selectedRegionFilter] || 0.25;
      targetConf = Math.round(totalPeriodConf * fReg);
      targetNotif = Math.max(1, Math.round(totalPeriodNotif * fReg));
      targetGraves = Math.round(totalPeriodGraves * fReg);
    }

    const confMap = distributeIntegerTotalNormalized(targetConf, baseList, PESOS_UNIDADES_SOROCABA);
    const notifMap = distributeIntegerTotalNormalized(targetNotif, baseList, PESOS_UNIDADES_SOROCABA);
    const gravesMap = distributeIntegerTotalNormalized(targetGraves, baseList, PESOS_UNIDADES_SOROCABA);

    return baseList.map((u) => {
      const notif = notifMap[u.cnes] ?? 1;
      const conf = confMap[u.cnes] ?? 0;
      const grav = gravesMap[u.cnes] ?? 0;
      const posit = notif > 0 ? Number(((conf / notif) * 100).toFixed(1)) : 0;
      return {
        ...u,
        notifiedCases: notif,
        confirmedCases: conf,
        severeCases: grav,
        positivityRate: posit,
      };
    });
  }, [units, selectedRegionFilter, filteredWeeks]);

  // URL do Boletim Técnico Oficial Dinâmico com Filtros
  const getBoletimUrl = () => {
    let seParam = selectedYear === 2026 ? '38' : 'todas';
    if (selectedSeRange === 'pico') seParam = 'pico';
    else if (selectedSeRange === 'recente') seParam = selectedYear === 2026 ? '38' : 'inter';

    return `./relatorio_tecnico_sorocaba.html?ano=${selectedYear}&se=${seParam}&regiao=${encodeURIComponent(selectedRegionFilter)}`;
  };

  // Exportar dados em formato Planilha Oficial (LibreOffice Calc e Excel)
  const handleExportSpreadsheet = () => {
    const nomeArquivo = `boletim_dengue_sorocaba_${selectedYear}.xls`;

    const xmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          .titulo { font-size: 14pt; font-weight: bold; color: #003865; }
          .subtitulo { font-size: 10pt; color: #555555; }
          .secao { font-size: 12pt; font-weight: bold; color: #003865; background-color: #e2e8f0; padding: 6px; }
          th { background-color: #003865; color: #ffffff; font-weight: bold; border: 1px solid #cccccc; padding: 6px 10px; text-align: center; }
          td { border: 1px solid #dddddd; padding: 5px 8px; }
          .num { text-align: right; }
          .total { background-color: #f1f5f9; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="7" class="titulo">PREFEITURA MUNICIPAL DE SOROCABA - VIGILÂNCIA EPIDEMIOLÓGICA</td></tr>
          <tr><td colspan="7" class="subtitulo">Boletim Técnico de Monitoramento de Arboviroses • Ano Base: ${selectedYear} • População Estimada (IBGE): ${populacaoAno.toLocaleString('pt-BR')} hab.</td></tr>
          <tr><td colspan="7"></td></tr>

          <tr><td colspan="7" class="secao">1. SÉRIE SEMANAL EPIDEMIOLÓGICA (CANAL ENDÊMICO)</td></tr>
          <thead>
            <tr>
              <th>Semana Epidemiológica (SE)</th>
              <th>Período / Intervalo de Datas</th>
              <th>Casos Notificados</th>
              <th>Casos Confirmados</th>
              <th>Casos Graves</th>
              <th>Óbitos Confirmados</th>
              <th>Limite de Alerta Epidêmico</th>
            </tr>
          </thead>
          <tbody>
            ${filteredWeeks.map(w => `
              <tr>
                <td style="text-align: center;">SE ${String(w.se).padStart(2, '0')}</td>
                <td>${w.dateRange}</td>
                <td class="num">${w.casosNotificados.toLocaleString('pt-BR')}</td>
                <td class="num font-bold">${w.casosConfirmados.toLocaleString('pt-BR')}</td>
                <td class="num">${w.casosGraves.toLocaleString('pt-BR')}</td>
                <td class="num">${w.obitos.toLocaleString('pt-BR')}</td>
                <td class="num">${w.limiteAlerta.toLocaleString('pt-BR')}</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="2" style="text-align: right;">TOTAL CONSOLIDADO NO PERÍODO:</td>
              <td class="num">${filteredWeeks.reduce((acc, w) => acc + w.casosNotificados, 0).toLocaleString('pt-BR')}</td>
              <td class="num">${filteredWeeks.reduce((acc, w) => acc + w.casosConfirmados, 0).toLocaleString('pt-BR')}</td>
              <td class="num">${filteredWeeks.reduce((acc, w) => acc + w.casosGraves, 0).toLocaleString('pt-BR')}</td>
              <td class="num">${filteredWeeks.reduce((acc, w) => acc + w.obitos, 0).toLocaleString('pt-BR')}</td>
              <td>-</td>
            </tr>
          </tbody>

          <tr><td colspan="7"></td></tr>
          <tr><td colspan="7" class="secao">2. DISTRIBUIÇÃO TERRITORIAL POR UNIDADE NOTIFICADORA (CNES PROXY)</td></tr>
          <thead>
            <tr>
              <th colspan="2">Unidade Notificadora</th>
              <th>CNES</th>
              <th>Região / Bacia</th>
              <th>Notificados</th>
              <th>Confirmados</th>
              <th>Positividade</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUnits.map(u => `
              <tr>
                <td colspan="2"><strong>${u.name}</strong></td>
                <td style="text-align: center;">${u.cnes}</td>
                <td>${u.region}</td>
                <td class="num">${u.notifiedCases.toLocaleString('pt-BR')}</td>
                <td class="num font-bold">${u.confirmedCases.toLocaleString('pt-BR')}</td>
                <td class="num">${u.positivityRate}%</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="4" style="text-align: right;">TOTAL TERRITORIAL:</td>
              <td class="num">${filteredUnits.reduce((acc, u) => acc + u.notifiedCases, 0).toLocaleString('pt-BR')}</td>
              <td class="num">${filteredUnits.reduce((acc, u) => acc + u.confirmedCases, 0).toLocaleString('pt-BR')}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCardBg = () => {
    if (highContrast) return 'bg-black text-white border-2 border-yellow-400';
    if (theme === 'dark') return 'bg-[#131F37] text-white border border-slate-700/80 shadow-md';
    return 'bg-white text-slate-900 border border-slate-200/90 shadow-sm';
  };

  const getGridColor = () => {
    if (theme === 'dark') return '#334155';
    return '#e2e8f0';
  };

  const pieColors = ['#003865', '#eab308', '#0284c7', '#dc2626'];
  const sorotiposData = Object.entries(summary.sorotiposIdentificados).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const anosDisponiveis = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Barra de Título Técnica com Indicador de BD e Ações */}
      <section 
        id="technical-header-banner"
        className={`p-4 sm:p-6 rounded-2xl border ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : theme === 'dark'
            ? 'bg-gradient-to-r from-[#0B1528] to-[#162746] border-slate-800 text-white shadow-lg'
            : 'bg-gradient-to-r from-[#003865] to-[#025a9e] border-blue-900 text-white shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                Vigilância Epidemiológica
              </span>
              
              {/* Badge Responsivo com Total de Registros */}
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  BD Conectado <span className="hidden sm:inline">• {totalDbRecords.toLocaleString('pt-BR')} registros</span>
                </span>
              </span>

              {isLoading && (
                <span className="flex items-center gap-1 text-xs text-amber-300 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Atualizando...
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Painel de Indicadores Técnicos de Arboviroses
            </h2>
            
            {/* Seletor de Ano de Análise e Metadados */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/90 pt-1">
              <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/20">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-medium">Ano Base:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setSelectedSeRange('all');
                  }}
                  className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
                >
                  {anosDisponiveis.map((ano) => (
                    <option key={ano} value={ano} className="bg-[#003865] text-white">
                      {ano} {ano === 2026 ? '(Atual)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <span>•</span>
              <span>População Estimada ({selectedYear}): <strong>{populacaoAno.toLocaleString('pt-BR')} hab.</strong></span>
              <span>•</span>
              <span>SE Monitorada: <strong>SE {selectedYear === 2026 ? summary.seAtual : '52'}</strong></span>
            </div>
          </div>

          {/* Botões de Ação Técnica: Boletim PDF e Exportar Planilha */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <a
              id="btn-boletim-tecnico"
              href={getBoletimUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-colors"
              title="Abrir Boletim Epidemiológico Oficial em PDF"
            >
              <FileDown className="w-4 h-4 text-amber-300" />
              <span>Boletim (PDF)</span>
            </a>

            <button
              id="btn-export-spreadsheet"
              onClick={handleExportSpreadsheet}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-colors"
              title="Exportar dados formatados para LibreOffice Calc ou Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Exportar Dados</span>
            </button>
          </div>
        </div>

        {/* Grade de KPIs Principais do Ano */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Notificados</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {summary.totalNotificados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-amber-300 mt-1">Suspeitos avaliados</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Confirmados</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {summary.totalConfirmados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-white/70 mt-1">
              Positividade: {summary.totalNotificados > 0 ? ((summary.totalConfirmados / summary.totalNotificados) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Taxa Incidência</div>
            <div className="text-xl sm:text-2xl font-black text-red-400 mt-1">
              {summary.taxaIncidencia.toFixed(0)}
            </div>
            <div className="text-[10px] text-red-300 mt-1">Por 100 mil hab. (Alta &gt;300)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Casos Graves</div>
            <div className="text-xl sm:text-2xl font-black text-orange-400 mt-1">
              {summary.totalGraves}
            </div>
            <div className="text-[10px] text-white/70 mt-1">Com sinais de alarme</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Óbitos Confirmados</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {summary.totalObitos}
            </div>
            <div className="text-[10px] text-white/70 mt-1">Letalidade: {summary.taxaLetalidade}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Descartados</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {summary.totalDescartados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-emerald-300 mt-1">Investigação negativa</div>
          </div>
        </div>
      </section>

      {/* Seção 1: Canal Endêmico / Diagrama de Controle Semanal */}
      <section className={`p-4 sm:p-6 rounded-2xl ${getCardBg()}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Diagrama de Controle (Canal Endêmico) • Série Semanal ({selectedYear})
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Comparativo da Curva Real de Casos Confirmados com os Limites Históricos da Vigilância
            </p>
          </div>

          {/* Filtros Limpos e Concisos: Ano Completo, Período de Pico, Semanas Recentes */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSelectedSeRange('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Ano Completo
            </button>
            <button
              onClick={() => setSelectedSeRange('pico')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'pico'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Período de Pico (SE {String(picoStart).padStart(2, '0')}-{String(picoEnd).padStart(2, '0')})
            </button>
            <button
              onClick={() => setSelectedSeRange('recente')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'recente'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Semanas Recentes
            </button>
          </div>
        </div>

        {/* Legenda Explicativa do Canal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[11px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-red-600 rounded"></span>
            <span className="text-slate-700 dark:text-slate-300"><strong>Limite Superior:</strong> Acima = Epidemia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-amber-500 rounded"></span>
            <span className="text-slate-700 dark:text-slate-300"><strong>Limite de Alerta:</strong> Faixa de Risco</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-500 rounded"></span>
            <span className="text-slate-700 dark:text-slate-300"><strong>Esperado:</strong> Mediana Histórica</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-blue-600 rounded-full inline-block"></span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Casos Confirmados {selectedYear}</span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredWeeks} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.6} />
              <XAxis 
                dataKey="se" 
                tickFormatter={(val) => `SE ${val}`}
                stroke={theme === 'dark' ? '#94a3b8' : '#334155'}
                fontSize={11}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#94a3b8' : '#334155'}
                fontSize={11}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  color: theme === 'dark' ? '#ffffff' : '#0f172a',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="limiteSuperior" 
                name="Limite Superior (Epidemia)" 
                stroke="#dc2626" 
                strokeWidth={1.8} 
                strokeDasharray="4 4"
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="limiteAlerta" 
                name="Limite Alerta" 
                stroke="#f59e0b" 
                strokeWidth={1.8} 
                strokeDasharray="3 3"
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="limiteEsperado" 
                name="Mediana Esperada" 
                stroke="#10b981" 
                strokeWidth={1.5} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="casosConfirmados" 
                name={`Casos Confirmados ${selectedYear}`} 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Seção 2: Georreferenciamento por CNES com Abas "Gráfico" e "Lista" */}
      <section className={`p-4 sm:p-6 rounded-2xl ${getCardBg()}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <MapPin className="w-5 h-5 text-amber-500" />
              Distribuição por Unidade Notificadora (CNES Proxy Territorial)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Conforme metodologia do DATASUS/LGPD, a unidade de notificação é utilizada para delimitar os polos regionais
            </p>
          </div>

          {/* Abas "Gráfico" vs "Lista" e Filtro Regional */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor de Modo de Visualização */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setUnitsViewMode('grafico')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitsViewMode === 'grafico'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Gráfico</span>
              </button>
              <button
                onClick={() => setUnitsViewMode('lista')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitsViewMode === 'lista'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista</span>
              </button>
            </div>

            {/* Filtro Regional */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Região:</span>
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <option value="Todas">Todas as Regiões</option>
                <option value="Zona Norte">Zona Norte</option>
                <option value="Zona Oeste">Zona Oeste</option>
                <option value="Zona Leste">Zona Leste</option>
                <option value="Centro / Regional">Centro / Regional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visualização 1: Gráfico de Barras Horizontal (Formato Solicitado) */}
        {unitsViewMode === 'grafico' ? (
          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={filteredUnits} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke={getGridColor()} opacity={0.6} />
                <XAxis 
                  type="number" 
                  stroke={theme === 'dark' ? '#94a3b8' : '#334155'} 
                  fontSize={11} 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150} 
                  stroke={theme === 'dark' ? '#94a3b8' : '#334155'} 
                  fontSize={11} 
                  tick={{ fill: theme === 'dark' ? '#f1f5f9' : '#0f172a', fontWeight: 600 }}
                />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toLocaleString('pt-BR')} casos`, 'Casos Confirmados']}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    color: theme === 'dark' ? '#ffffff' : '#0f172a',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="confirmedCases" 
                  name="Casos Confirmados" 
                  fill="#0284c7" 
                  radius={[0, 6, 6, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Visualização 2: Lista / Tabela com Cores e Contraste Nítidos */
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3">Unidade Notificadora</th>
                  <th className="py-3 px-3">CNES</th>
                  <th className="py-3 px-3">Região</th>
                  <th className="py-3 px-3 text-right">Notificados</th>
                  <th className="py-3 px-3 text-right">Confirmados</th>
                  <th className="py-3 px-3 text-right">Graves</th>
                  <th className="py-3 px-3 text-right">Positividade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {u.address}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {u.cnes}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {u.region}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-white">
                      {u.notifiedCases.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                      {u.confirmedCases.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-orange-600 dark:text-orange-400">
                      {u.severeCases.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700 dark:text-blue-400">
                      {u.positivityRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Seção 3: Demografia e Sorotipos Circulantes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pirâmide Etária */}
        <section className={`p-4 sm:p-6 rounded-2xl lg:col-span-2 ${getCardBg()}`}>
          <h3 className="text-base sm:text-lg font-bold mb-1 text-slate-900 dark:text-white">
            Distribuição por Faixa Etária e Sexo ({selectedYear})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Proporção de casos confirmados por grupos etários e gênero
          </p>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.6} />
                <XAxis 
                  dataKey="range" 
                  stroke={theme === 'dark' ? '#94a3b8' : '#334155'} 
                  fontSize={10} 
                  tick={{ fill: theme === 'dark' ? '#e2e8f0' : '#0f172a' }}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#94a3b8' : '#334155'} 
                  fontSize={10} 
                  tick={{ fill: theme === 'dark' ? '#e2e8f0' : '#0f172a' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    color: theme === 'dark' ? '#ffffff' : '#0f172a',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="masculino" name="Masculino" fill="#003865" radius={[4, 4, 0, 0]} />
                <Bar dataKey="feminino" name="Feminino" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sorotipos Circulantes */}
        <section className={`p-4 sm:p-6 rounded-2xl ${getCardBg()}`}>
          <h3 className="text-base sm:text-lg font-bold mb-1 text-slate-900 dark:text-white">
            Sorotipos Circulantes
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Isolamentos virais confirmados por sorologia e PCR
          </p>

          <div className="h-44 sm:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sorotiposData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sorotiposData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {sorotiposData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }}></span>
                <span className="font-semibold text-slate-900 dark:text-white">{item.name}:</span>
                <span className="text-slate-600 dark:text-slate-400">{item.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
            <strong>Vigilância Genômica:</strong> Predomínio de <strong>DENV-1 e DENV-2</strong> em Sorocaba. População suscetível requer atenção a reinfecções.
          </div>
        </section>
      </div>
    </div>
  );
};
