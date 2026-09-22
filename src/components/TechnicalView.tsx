import React, { useState } from 'react';
import { 
  SOROCABA_SUMMARY, 
  EPIDEMIOLOGICAL_WEEKS, 
  SOROCABA_HEALTH_UNITS, 
  AGE_GENDER_DATA 
} from '../data/sorocabaDengueData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  FileDown
} from 'lucide-react';

interface TechnicalViewProps {
  theme: 'light' | 'dark';
  highContrast: boolean;
}

export const TechnicalView: React.FC<TechnicalViewProps> = ({ theme, highContrast }) => {
  const [selectedSeRange, setSelectedSeRange] = useState<string>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Todas');

  // Filtragem das Semanas Epidemiológicas
  const filteredWeeks = EPIDEMIOLOGICAL_WEEKS.filter((w) => {
    if (selectedSeRange === 'pico') return w.se >= 5 && w.se <= 16;
    if (selectedSeRange === 'recente') return w.se >= 20;
    return true;
  });

  // Filtragem das Unidades Notificadoras
  const filteredUnits = SOROCABA_HEALTH_UNITS.filter((u) => {
    if (selectedRegionFilter === 'Todas') return true;
    return u.region === selectedRegionFilter;
  });

  // Exportar dados para CSV
  const handleExportCSV = () => {
    const headers = 'Semana_Epidemiologica,Intervalo_Datas,Notificados,Confirmados,Graves,Obitos,Limite_Alerta,Limite_Superior\n';
    const rows = EPIDEMIOLOGICAL_WEEKS.map(w => 
      `${w.se},"${w.dateRange}",${w.casosNotificados},${w.casosConfirmados},${w.casosGraves},${w.obitos},${w.limiteAlerta},${w.limiteSuperior}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `boletim_epidemiologico_dengue_sorocaba_SE${SOROCABA_SUMMARY.seAtual}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCardBg = () => {
    if (highContrast) return 'bg-black text-white border-2 border-yellow-400';
    if (theme === 'dark') return 'bg-[#131F37] text-white border border-slate-700/80 shadow-md';
    return 'bg-white text-slate-800 border border-slate-200/90 shadow-sm';
  };

  const getGridColor = () => {
    if (highContrast) return '#eab308';
    if (theme === 'dark') return '#334155';
    return '#e2e8f0';
  };

  const pieColors = ['#003865', '#eab308', '#0284c7', '#dc2626'];
  const sorotiposData = Object.entries(SOROCABA_SUMMARY.sorotiposIdentificados).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Técnico com Metadados Oficiais */}
      <section 
        id="technical-kpi-banner"
        className={`p-6 rounded-2xl border ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : theme === 'dark'
            ? 'bg-[#0B1528] border-slate-800'
            : 'bg-[#002b4d] text-white border-blue-900 shadow-md'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                Vigilância Epidemiológica de Sorocaba
              </span>
              <span className="text-xs text-white/70">
                Código IBGE: 355220 • População Estimada: 723.682 hab.
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Painel de Indicadores Técnicos de Arboviroses
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Ano de Monitoramento: {SOROCABA_SUMMARY.anoAtual} • Semana Epidemiológica Atual: SE {SOROCABA_SUMMARY.seAtual}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="./relatorio_tecnico_sorocaba.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 shadow-sm transition-all"
              title="Abrir o relatório técnico oficial formatado para PDF"
            >
              <FileDown className="w-4 h-4 text-amber-300" />
              <span>Boletim (PDF)</span>
            </a>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all"
              title="Baixar planilha CSV com a série histórica das semanas epidemiológicas"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dados (CSV)</span>
            </button>
          </div>
        </div>

        {/* Grade de Indicadores Oficiais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-4">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Notificados</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {SOROCABA_SUMMARY.totalNotificados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-amber-300 mt-1">Suspeitos avaliados</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Confirmados</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {SOROCABA_SUMMARY.totalConfirmados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-white/70 mt-1">
              Positividade: {((SOROCABA_SUMMARY.totalConfirmados / SOROCABA_SUMMARY.totalNotificados) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Taxa Incidência</div>
            <div className="text-xl sm:text-2xl font-black text-red-400 mt-1">
              {SOROCABA_SUMMARY.taxaIncidencia.toFixed(0)}
            </div>
            <div className="text-[10px] text-red-300 mt-1">Por 100 mil hab. (Alta &gt;300)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Casos Graves</div>
            <div className="text-xl sm:text-2xl font-black text-orange-400 mt-1">
              {SOROCABA_SUMMARY.totalGraves}
            </div>
            <div className="text-[10px] text-white/70 mt-1">Com sinais de alarme</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Óbitos Confirmados</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {SOROCABA_SUMMARY.totalObitos}
            </div>
            <div className="text-[10px] text-white/70 mt-1">Letalidade: {SOROCABA_SUMMARY.taxaLetalidade}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Descartados</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {SOROCABA_SUMMARY.totalDescartados.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-emerald-300 mt-1">Investigação negativa</div>
          </div>
        </div>
      </section>

      {/* Gráfico 1: Diagrama de Controle (Canal Endêmico de Borkow) */}
      <section id="technical-endemic-channel" className={`p-6 rounded-2xl border ${getCardBg()}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <h3 className="text-base sm:text-lg font-bold">
                Diagrama de Controle (Canal Endêmico) • Série Semanal (SE 01 - SE 38)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparativo da Curva Real de Casos Confirmados com os Limites Históricos da Vigilância Epidemiológica de Sorocaba
            </p>
          </div>

          {/* Filtro de Período SE */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedSeRange('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              Ano Completo
            </button>
            <button
              onClick={() => setSelectedSeRange('pico')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'pico'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              Período de Pico (SE 05-16)
            </button>
            <button
              onClick={() => setSelectedSeRange('recente')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedSeRange === 'recente'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-white'
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
            <span className="text-slate-600 dark:text-slate-300"><strong>Limite Superior:</strong> Acima = Epidemia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-amber-500 rounded"></span>
            <span className="text-slate-600 dark:text-slate-300"><strong>Limite de Alerta:</strong> Faixa de Risco</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-500 rounded"></span>
            <span className="text-slate-600 dark:text-slate-300"><strong>Esperado:</strong> Mediana Histórica</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-blue-600 rounded-full inline-block"></span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Casos Confirmados 2026</span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredWeeks} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.6} />
              <XAxis 
                dataKey="se" 
                tickFormatter={(val) => `SE ${val}`}
                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize={11}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize={11}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="limiteSuperior" 
                stroke="#dc2626" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={false}
                name="Limite Superior (Epidemia)"
              />
              <Line 
                type="monotone" 
                dataKey="limiteAlerta" 
                stroke="#f59e0b" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
                dot={false}
                name="Limite Alerta"
              />
              <Line 
                type="monotone" 
                dataKey="limiteEsperado" 
                stroke="#10b981" 
                strokeWidth={1.5} 
                dot={false}
                name="Mediana Esperada"
              />
              <Line 
                type="monotone" 
                dataKey="casosConfirmados" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
                name="Casos Confirmados"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grid: Proxy Territorial por CNES / Unidade Notificadora + Perfil Demográfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Distribuição por Unidades Notificadoras (Proxy Territorial) */}
        <section className={`p-6 rounded-2xl border lg:col-span-2 ${getCardBg()}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold">
                  Proxy Territorial: Casos por Unidade de Notificação (CNES)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Utilizado para mapeamento de áreas de calor diante da supressão de bairros pelo DATASUS/LGPD.
              </p>
            </div>

            {/* Filtro de Região da Unidade */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
              {['Todas', 'Zona Norte', 'Zona Oeste', 'Zona Leste', 'Centro / Regional'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegionFilter(r)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedRegionFilter === r
                      ? 'bg-[#003865] text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Gráfico de Barras Horizontais das Unidades */}
          <div className="h-64 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={filteredUnits.slice(0, 7)} 
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.6} />
                <XAxis type="number" fontSize={11} stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  fontSize={10} 
                  width={140} 
                  tickFormatter={(val) => val.split('(')[0].trim()}
                  stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="confirmedCases" fill="#0284c7" radius={[0, 4, 4, 0]} name="Confirmados" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela Resumo das Unidades com CNES */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Unidade Notificadora</th>
                  <th className="py-2.5 px-3 font-mono">CNES</th>
                  <th className="py-2.5 px-3">Região</th>
                  <th className="py-2.5 px-3 text-right">Notificados</th>
                  <th className="py-2.5 px-3 text-right">Confirmados</th>
                  <th className="py-2.5 px-3 text-right">Graves</th>
                  <th className="py-2.5 px-3 text-right">Positividade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-medium">{u.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{u.cnes}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700">
                        {u.region}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">{u.notifiedCases.toLocaleString('pt-BR')}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                      {u.confirmedCases.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2 px-3 text-right text-red-500 font-medium">{u.severeCases}</td>
                    <td className="py-2 px-3 text-right">{u.positivityRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Coluna 3: Sorotipos Circulantes & Pirâmide Etária */}
        <section className="space-y-6">
          {/* Sorotipos Circulantes */}
          <div className={`p-6 rounded-2xl border ${getCardBg()}`}>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Sorotipos Identificados (Sorologia)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Isolamento viral e RT-PCR no Instituto Adolfo Lutz / Sorocaba
            </p>

            <div className="h-44 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sorotiposData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sorotiposData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {sorotiposData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                  ></span>
                  <span className="font-semibold">{item.name}:</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pirâmide Etária Resumida */}
          <div className={`p-6 rounded-2xl border ${getCardBg()}`}>
            <h3 className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Distribuição por Faixa Etária
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Maior incidência concentrada na população economicamente ativa (25-59 anos)
            </p>

            <div className="space-y-2 mt-4 text-xs">
              {AGE_GENDER_DATA.map((ag) => {
                const total = ag.masculino + ag.feminino;
                const percentage = ((total / SOROCABA_SUMMARY.totalConfirmados) * 100).toFixed(1);
                return (
                  <div key={ag.range} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium">{ag.range}</span>
                      <span className="text-slate-500">{total} casos ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                      <div 
                        className="bg-[#003865] h-full" 
                        style={{ width: `${(ag.masculino / total) * 100}%` }}
                        title={`Masculino: ${ag.masculino}`}
                      ></div>
                      <div 
                        className="bg-amber-400 h-full" 
                        style={{ width: `${(ag.feminino / total) * 100}%` }}
                        title={`Feminino: ${ag.feminino}`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#003865] rounded-full"></span> Masculino
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span> Feminino
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Recomendações Técnicas para o Setor de Vigilância */}
      <section className={`p-5 rounded-2xl border ${
        highContrast ? 'bg-black border-yellow-400 text-white' : theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-amber-50/60 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-900 dark:text-amber-400">
              Diretrizes de Manejo Clínico e Vigilância Ativa:
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              1. <strong>Triagem com Prova do Laço</strong>: Obrigatória para todo paciente febril com suspeita na classificação de risco (Grupo A, B, C e D).
              <br />
              2. <strong>Alerta para a Zona Norte de Sorocaba</strong>: Devido ao maior volume de notificações concentrado na UPH ZN, PA Laranjeiras e PA São Bento, priorizar ações de bloqueio químico (nebulização ultrabaixo volume) e retirada de inservíveis nos bairros adjacentes (Vila Fiore, Habiteto, Vitória Régia).
              <br />
              3. <strong>Vigilância de Óbitos</strong>: Todo óbito suspeito deve ser investigado pelo Comitê Municipal de Investigação de Óbito por Arboviroses em até 48 horas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
