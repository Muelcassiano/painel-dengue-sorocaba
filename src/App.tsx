/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, ThemeMode, AccessibilityState } from './types';
import { Header } from './components/Header';
import { CitizenView } from './components/CitizenView';
import { TechnicalView } from './components/TechnicalView';
import { TechnicalNoteModal } from './components/TechnicalNoteModal';
import { DataImporterModal } from './components/DataImporterModal';
import { ShieldCheck, Heart, ExternalLink, Activity } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('citizen');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    fontSizeStep: 0,
    highContrast: false,
    reducedMotion: false,
  });

  const [isTechnicalNoteOpen, setIsTechnicalNoteOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Font size multiplier based on accessibility state
  const getFontSizeClass = () => {
    if (accessibility.fontSizeStep === -1) return 'text-[14px]';
    if (accessibility.fontSizeStep === 1) return 'text-[17px]';
    if (accessibility.fontSizeStep === 2) return 'text-[19px]';
    return 'text-[16px]';
  };

  return (
    <div
      id="app-root"
      className={`min-h-screen transition-colors duration-200 flex flex-col font-sans ${getFontSizeClass()} ${
        accessibility.highContrast
          ? 'bg-black text-white'
          : theme === 'dark'
          ? 'bg-[#0a0f1d] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Header Institucional de Sorocaba */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        toggleTheme={toggleTheme}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
        onOpenTechnicalNote={() => setIsTechnicalNoteOpen(true)}
        onOpenImporter={() => setIsImporterOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {viewMode === 'citizen' ? (
          <CitizenView theme={theme} highContrast={accessibility.highContrast} />
        ) : (
          <TechnicalView theme={theme} highContrast={accessibility.highContrast} />
        )}
      </main>

      {/* Rodapé Institucional */}
      <footer
        id="main-footer"
        className={`border-t py-8 px-4 sm:px-6 text-xs transition-colors ${
          accessibility.highContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : theme === 'dark'
            ? 'bg-[#0B1528] border-slate-800 text-slate-400'
            : 'bg-[#002b4d] border-blue-950 text-slate-300'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#003865] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">
                Prefeitura Municipal de Sorocaba • Secretaria da Saúde (SES)
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                Divisão de Vigilância em Saúde • Seção de Controle de Zoonoses • Projeto Integrador IV
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsTechnicalNoteOpen(true)}
              className="hover:underline flex items-center gap-1"
            >
              Metodologia DATASUS / LGPD
            </button>
            <span>•</span>
            <a 
              href="https://www.sorocaba.sp.gov.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              Portal da Prefeitura <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              Desenvolvido com <Heart className="w-3 h-3 text-red-400 inline" /> para Sorocaba/SP
            </span>
          </div>
        </div>
      </footer>

      {/* Modais */}
      <TechnicalNoteModal
        isOpen={isTechnicalNoteOpen}
        onClose={() => setIsTechnicalNoteOpen(false)}
        theme={theme}
      />

      <DataImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        theme={theme}
      />
    </div>
  );
}
