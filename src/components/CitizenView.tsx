import React, { useState } from 'react';
import { 
  SOROCABA_SUMMARY, 
  SOROCABA_HEALTH_UNITS, 
  WARNING_SIGNS, 
  PREVENTION_TIPS 
} from '../data/sorocabaDengueData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Droplet, 
  ShieldCheck, 
  Sprout, 
  Trash2, 
  ArrowRight,
  Info,
  Hospital
} from 'lucide-react';

interface CitizenViewProps {
  theme: 'light' | 'dark';
  highContrast: boolean;
}

export const CitizenView: React.FC<CitizenViewProps> = ({ theme, highContrast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredUnits = SOROCABA_HEALTH_UNITS.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          unit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          unit.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'Todas' || unit.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ['Todas', 'Zona Norte', 'Zona Oeste', 'Zona Leste', 'Centro / Regional'];

  const getCardBg = () => {
    if (highContrast) return 'bg-black text-white border-2 border-yellow-400';
    if (theme === 'dark') return 'bg-[#131F37] text-white border border-slate-700/80 shadow-md';
    return 'bg-white text-slate-800 border border-slate-200/90 shadow-sm';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Faixa de Alerta Epidemiológico e Resumo Amigável */}
      <section 
        id="citizen-alert-banner"
        className={`p-6 rounded-2xl border ${
          highContrast
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : theme === 'dark'
            ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-600/40 text-amber-100'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">
                  Alerta Ativo em Sorocaba
                </span>
                <span className="text-xs opacity-75">
                  Atualizado em {SOROCABA_SUMMARY.dataAtualizacao} (Semana Epid. {SOROCABA_SUMMARY.seAtual})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Situação da Dengue em nosso município: Nível de Atenção Reforçada
              </h2>
              <p className="text-sm mt-1 max-w-3xl opacity-90 leading-relaxed">
                As equipes de controle de zoonoses e agentes comunitários de saúde de Sorocaba estão nas ruas intensificando visitas domiciliares e nebulizações. O mosquito se reproduz em água parada dentro de nossas casas.
              </p>
            </div>
          </div>

          {/* Mini Indicadores Cidadão */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className={`p-3.5 rounded-xl border ${
              highContrast ? 'border-yellow-400' : theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-amber-200'
            }`}>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Casos Confirmados</div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                {SOROCABA_SUMMARY.totalConfirmados.toLocaleString('pt-BR')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ano de 2026 em Sorocaba</div>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              highContrast ? 'border-yellow-400' : theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-amber-200'
            }`}>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Notificações</div>
              <div className="text-xl sm:text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
                {SOROCABA_SUMMARY.totalNotificados.toLocaleString('pt-BR')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Casos suspeitos avaliados</div>
            </div>

            <div className={`p-3.5 rounded-xl border col-span-2 sm:col-span-1 ${
              highContrast ? 'border-yellow-400' : theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-amber-200'
            }`}>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Sorotipo Predominante</div>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                DENV-1 e 2
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Circulação ativa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sinais de Alarme vs. Quando ir à UPH */}
      <section id="citizen-warning-signs" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              Sinais de Alarme: Quando procurar a UPH ou PA imediatamente
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              A dengue pode evoluir para formas graves principalmente no momento em que a febre começa a baixar (entre o 3º e o 7º dia de sintomas).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WARNING_SIGNS.map((sign, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                highContrast 
                  ? 'bg-black border-red-500 text-white' 
                  : theme === 'dark' 
                  ? 'bg-red-950/20 border-red-900/60 hover:border-red-600/80' 
                  : 'bg-red-50/70 border-red-200 hover:border-red-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                    {sign.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {sign.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Dica de Hidratação Rápida */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            highContrast
              ? 'bg-black border-yellow-400 text-white'
              : theme === 'dark'
              ? 'bg-sky-950/20 border-sky-800/60'
              : 'bg-sky-50 border-sky-200'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" /> Conduta Essencial
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                Hidratação Oral Imediata
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                A hidratação abundante com soro caseiro, água e água de coco salva vidas e previne o agravamento do choque por dengue.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
              Procure a UPH mais próxima se houver intolerância oral ou vômitos.
            </div>
          </div>
        </div>
      </section>

      {/* Onde Buscar Atendimento em Sorocaba */}
      <section id="citizen-health-units" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Hospital className="w-5 h-5 text-amber-500" />
              Onde Buscar Atendimento em Sorocaba
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              UPHs funcionam 24h para urgências e emergências. As UBSs realizam acolhimento, triagem, teste rápido e hidratação.
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-units-input"
                type="text"
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-3 py-1.5 rounded-lg text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  highContrast
                    ? 'bg-black text-white border-yellow-400'
                    : theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-white text-slate-900 border-slate-300'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedRegion === reg
                      ? 'bg-[#003865] text-white font-bold'
                      : highContrast
                      ? 'bg-black text-white border border-yellow-400 hover:bg-yellow-400 hover:text-black'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Unidades de Sorocaba */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.length > 0 ? (
            filteredUnits.map((unit) => (
              <div 
                key={unit.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${getCardBg()}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      unit.type === 'UPH' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                        : unit.type === 'PA'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {unit.type} • {unit.region}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      CNES: {unit.cnes}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base mt-2">
                    {unit.name}
                  </h3>

                  <div className="space-y-1.5 mt-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{unit.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{unit.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{unit.type === 'UPH' || unit.type === 'PA' ? 'Atendimento 24 Horas' : 'Segunda a Sexta: 07h às 19h'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Notificações registradas:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {unit.notifiedCases.toLocaleString('pt-BR')} casos
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-slate-500 border rounded-xl">
              Nenhuma unidade de saúde encontrada com esses termos de busca.
            </div>
          )}
        </div>
      </section>

      {/* Checklist Interativo: 10 Minutos Contra a Dengue */}
      <section id="citizen-checklist" className={`p-6 rounded-2xl border ${getCardBg()}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Ação Comunitária Sorocaba
            </span>
            <h2 className="text-lg sm:text-xl font-bold mt-1">
              Checklist Semanal: 10 Minutos que Salvam Vidas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Mais de 80% dos focos do mosquito Aedes aegypti estão nos quintais das residências. Marque o que você já checou hoje:
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
            {Object.values(checkedItems).filter(Boolean).length} de {PREVENTION_TIPS.length} tarefas concluídas
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PREVENTION_TIPS.map((tip, idx) => {
            const isDone = !!checkedItems[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isDone 
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                    : 'hover:border-amber-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'
                }`}>
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`font-bold text-sm ${isDone ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-75' : ''}`}>
                    {tip.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {tip.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Canais Oficiais de Atendimento */}
      <section className={`p-5 rounded-2xl border ${
        highContrast ? 'bg-black border-yellow-400 text-white' : theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-500" />
              Canais da Prefeitura de Sorocaba para Dúvidas e Denúncias de Focos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Encontrou terrenos baldios com entulho ou imóveis abandonados acumulando água?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#003865] text-white text-xs font-bold">
              Central 156 Sorocaba
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold">
              Zoonoses: (15) 3229-7333
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
