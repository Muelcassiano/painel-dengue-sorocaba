import React from 'react';
import { ViewMode, ThemeMode, AccessibilityState } from '../types';
import { 
  Activity, 
  Users, 
  Sun, 
  Moon, 
  Eye, 
  HelpCircle,
  ShieldAlert,
  ArrowUpRight,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  accessibility: AccessibilityState;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilityState>>;
  onOpenTechnicalNote: () => void;
  onOpenImporter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  theme,
  toggleTheme,
  accessibility,
  setAccessibility,
  onOpenTechnicalNote,
  onOpenImporter,
}) => {
  const handleFontSizeChange = (delta: number) => {
    setAccessibility((prev) => {
      const nextStep = Math.max(-1, Math.min(2, prev.fontSizeStep + delta));
      return { ...prev, fontSizeStep: nextStep };
    });
  };

  const toggleHighContrast = () => {
    setAccessibility((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  return (
    <header
      id="main-header"
      className={`border-b transition-colors ${
        accessibility.highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : theme === 'dark'
          ? 'bg-[#0B1528] text-white border-slate-800'
          : 'bg-[#003865] text-white border-blue-900 shadow-sm'
      }`}
    >
      {/* Barra Superior Institucional e Acessibilidade */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide uppercase text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Prefeitura Municipal de Sorocaba
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/80 hidden sm:inline">
            Secretaria da Saúde • Divisão de Vigilância Epidemiológica (Zoonoses)
          </span>
        </div>

        {/* Ferramentas de Acessibilidade */}
        <div className="flex items-center gap-1.5 sm:gap-2" aria-label="Controles de Acessibilidade">
          <span className="text-white/60 text-[11px] hidden md:inline">Acessibilidade:</span>
          
          {/* Ajuste de Fonte */}
          <div className="flex items-center bg-white/10 rounded overflow-hidden">
            <button
              id="btn-font-decrease"
              onClick={() => handleFontSizeChange(-1)}
              className="px-2 py-1 hover:bg-white/20 transition-colors font-bold text-xs"
              title="Diminuir tamanho da fonte"
              aria-label="Diminuir tamanho da fonte"
            >
              A-
            </button>
            <button
              id="btn-font-reset"
              onClick={() => setAccessibility((prev) => ({ ...prev, fontSizeStep: 0 }))}
              className="px-2 py-1 hover:bg-white/20 transition-colors text-xs border-x border-white/10"
              title="Tamanho padrão de fonte"
              aria-label="Tamanho padrão de fonte"
            >
              A
            </button>
            <button
              id="btn-font-increase"
              onClick={() => handleFontSizeChange(1)}
              className="px-2 py-1 hover:bg-white/20 transition-colors font-bold text-xs"
              title="Aumentar tamanho da fonte"
              aria-label="Aumentar tamanho da fonte"
            >
              A+
            </button>
          </div>

          {/* Alto Contraste */}
          <button
            id="btn-high-contrast"
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors text-xs font-medium ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Alternar modo de alto contraste"
            aria-label="Alternar modo de alto contraste"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alto Contraste</span>
          </button>

          {/* Modo Claro / Escuro */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors text-xs"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label="Alternar tema claro e escuro"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-200" />
                <span className="hidden sm:inline">Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal do Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Identidade Visual */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-slate-950 font-bold text-xl ring-2 ring-white/20">
            <ShieldAlert className="w-7 h-7 text-[#003865]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Painel Dengue Sorocaba
              </h1>
              <span className="bg-amber-400/20 text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-400/30">
                Oficial • 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200/80">
              Monitoramento Epidemiológico, Vigilância Sanitária e Informações à População
            </p>
          </div>
        </div>

        {/* Seleção de Modo de Visão: Munícipe vs Técnico */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div 
            className="p-1 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10 flex items-center"
            role="tablist"
            aria-label="Modo de Visualização"
          >
            <button
              id="tab-view-citizen"
              role="tab"
              aria-selected={viewMode === 'citizen'}
              onClick={() => setViewMode('citizen')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'citizen'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Visão Cidadão</span>
            </button>

            <button
              id="tab-view-surveillance"
              role="tab"
              aria-selected={viewMode === 'surveillance'}
              onClick={() => setViewMode('surveillance')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'surveillance'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Visão Técnica / Vigilância</span>
            </button>
          </div>

          {/* Botão Nota Técnica DATASUS/LGPD */}
          <button
            id="btn-technical-note"
            onClick={onOpenTechnicalNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            title="Entenda a metodologia do DATASUS e o georreferenciamento por Unidade"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Nota Técnica</span>
          </button>

          {/* Botão Baixar Relatório PDF */}
          <a
            id="btn-download-pdf-report"
            href="./relatorio_tecnico_sorocaba.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-colors"
            title="Abrir e salvar o Relatório Técnico Epidemiológico em PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Relatório PDF</span>
          </a>

          {/* Botão Importar / Testar Dados Locais */}
          <button
            id="btn-open-importer"
            onClick={onOpenImporter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
            title="Carregar arquivo CSV ou JSON gerado pelo seu script de ingestão"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Inserir Dados</span>
          </button>
        </div>
      </div>
    </header>
  );
};
