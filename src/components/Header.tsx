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
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  theme,
  toggleTheme,
  accessibility,
  setAccessibility,
  onOpenTechnicalNote,
}) => {
  const handleFontSizeChange = (delta: number) => {
    setAccessibility((prev) => {
      const nextStep = Math.max(-2, Math.min(3, prev.fontSizeStep + delta));
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
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-semibold tracking-wide uppercase text-amber-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Prefeitura de Sorocaba
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/80 hidden md:inline text-[11px]">
            Secretaria da Saúde • Divisão de Vigilância Epidemiológica • Zoonoses
          </span>
        </div>

        {/* Ferramentas de Acessibilidade */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto" aria-label="Controles de Acessibilidade">
          {/* Ajuste de Fonte com Indicador Visual Ativo */}
          <div 
            className="flex items-center bg-white/10 rounded overflow-hidden border border-white/15"
            role="group"
            aria-label="Controle de tamanho de fonte"
          >
            <button
              id="btn-font-decrease"
              type="button"
              onClick={() => handleFontSizeChange(-1)}
              className={`px-2 py-0.5 transition-colors font-bold text-xs ${
                accessibility.fontSizeStep < 0
                  ? 'bg-amber-400 text-slate-950 font-black shadow-inner'
                  : 'hover:bg-white/20 text-white'
              }`}
              title="Diminuir tamanho do texto (A-)"
              aria-label="Diminuir fonte"
              aria-pressed={accessibility.fontSizeStep < 0}
            >
              A-
            </button>
            <button
              id="btn-font-reset"
              type="button"
              onClick={() => setAccessibility((prev) => ({ ...prev, fontSizeStep: 0 }))}
              className={`px-2 py-0.5 transition-colors text-xs border-x border-white/15 ${
                accessibility.fontSizeStep === 0
                  ? 'bg-white/30 text-white font-black'
                  : 'hover:bg-white/20 text-white/90'
              }`}
              title="Tamanho padrão de fonte (A 100%)"
              aria-label="Fonte padrão"
              aria-pressed={accessibility.fontSizeStep === 0}
            >
              A
            </button>
            <button
              id="btn-font-increase"
              type="button"
              onClick={() => handleFontSizeChange(1)}
              className={`px-2 py-0.5 transition-colors font-bold text-xs ${
                accessibility.fontSizeStep > 0
                  ? 'bg-amber-400 text-slate-950 font-black shadow-inner'
                  : 'hover:bg-white/20 text-white'
              }`}
              title="Aumentar tamanho do texto (A+)"
              aria-label="Aumentar fonte"
              aria-pressed={accessibility.fontSizeStep > 0}
            >
              A+
            </button>
          </div>

          {/* Alto Contraste */}
          <button
            id="btn-high-contrast"
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors text-xs font-medium ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Alto contraste"
            aria-label="Alto contraste"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Contraste</span>
          </button>

          {/* Modo Claro / Escuro */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors text-xs"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-sky-200" />
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal do Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Identidade Visual */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md text-slate-950 font-bold shrink-0 ring-2 ring-white/20">
            <ShieldAlert className="w-6 h-6 text-[#003865]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Painel Dengue Sorocaba
              </h1>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-amber-400/30">
                Oficial 2026
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-200/80 line-clamp-1">
              Vigilância Epidemiológica de Arboviroses • Sorocaba/SP
            </p>
          </div>
        </div>

        {/* Abas Principais de Navegação e Ações (Design Estável sem Deslocamento) */}
        <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:gap-2 pt-1 md:pt-0 w-full md:w-auto">
          <nav 
            className="p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center w-full md:w-auto shrink-0"
            role="tablist"
            aria-label="Modo de Navegação do Painel"
          >
            <button
              id="tab-view-citizen"
              role="tab"
              aria-selected={viewMode === 'citizen'}
              onClick={() => setViewMode('citizen')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'citizen'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Visão Cidadão</span>
            </button>

            <button
              id="tab-view-surveillance"
              role="tab"
              aria-selected={viewMode === 'surveillance'}
              onClick={() => setViewMode('surveillance')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'surveillance'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Visão Técnica</span>
            </button>
          </nav>

          {/* Ações Auxiliares: Nota Técnica e Relatório PDF */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              id="btn-technical-note"
              onClick={onOpenTechnicalNote}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors shrink-0"
              title="Nota Técnica e Metodologia DATASUS / CNES"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Nota Técnica</span>
            </button>

            {/* No Mobile: Exibe Relatório PDF ocupando o outro lado da linha quando ativo */}
            {viewMode === 'citizen' && (
              <a
                id="btn-download-pdf-report-mobile"
                href="./relatorio_tecnico_sorocaba.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:hidden inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all whitespace-nowrap"
                title="Abrir o Relatório Oficial em PDF"
              >
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <span>Relatório PDF</span>
              </a>
            )}

            {/* No Desktop: Slot de largura fixa para o botão Relatório PDF (elimina deslocamento dos demais botões) */}
            <div className="hidden md:flex md:w-[130px] items-center justify-start shrink-0">
              {viewMode === 'citizen' && (
                <a
                  id="btn-download-pdf-report"
                  href="./relatorio_tecnico_sorocaba.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all whitespace-nowrap"
                  title="Abrir o Relatório Oficial em PDF"
                >
                  <FileDown className="w-3.5 h-3.5 shrink-0" />
                  <span>Relatório PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
