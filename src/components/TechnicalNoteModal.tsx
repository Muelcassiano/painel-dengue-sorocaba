import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface TechnicalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const TechnicalNoteModal: React.FC<TechnicalNoteModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-2xl rounded-2xl p-6 border shadow-2xl overflow-y-auto max-h-[90vh] ${
          theme === 'dark' 
            ? 'bg-[#0f172a] text-slate-100 border-slate-700' 
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Nota Técnica & Metodologia de Georreferenciamento
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Solução para a supressão de bairros e distritos no DATASUS / SINAN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs">
            <strong>O Desafio:</strong> Desde a aplicação das diretrizes da LGPD nos microdados públicos de arboviroses do DATASUS (SINAN), os campos de logradouro e bairro residencial são suprimidos ou generalizados para nível municipal (Código IBGE 355220).
          </div>

          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Como o Painel resolve o Georreferenciamento:
          </h4>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-slate-100">
                1. Proxy Territorial por Estabelecimento de Saúde Notificador (CNES):
              </strong>
              <p className="mt-1 text-xs">
                O SINAN preserva o código CNES da unidade onde o paciente realizou o primeiro atendimento (ex.: UPH Zona Norte, UPH Zona Oeste, PA Laranjeiras, PA Éden, PA Brigadeiro Tobias). Como a rede pública municipal de Sorocaba opera por bacias sanitárias regionais, a unidade notificadora atua como a melhor aproximação espacial das macrorregiões da cidade.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-slate-100">
                2. Canal Endêmico / Diagrama de Controle:
              </strong>
              <p className="mt-1 text-xs">
                Em vez de depender unicamente de mapas coropléticos pontuais, a vigilância epidemiológica moderna utiliza a análise de Séries Temporais por Semana Epidemiológica (SE 01 a 52) comparadas com a mediana e desvios padrão históricos, identificando o exato momento de inflexão para epidemia.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-slate-100">
                3. Camada Aberta para Ingestão Local:
              </strong>
              <p className="mt-1 text-xs">
                Se os técnicos da Prefeitura ou do Projeto Integrador possuírem bases internas com endereços ou distritos sanitários anonimizados, o painel disponibiliza o botão "Inserir Dados" para carregar tabelas personalizadas diretamente no navegador.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#003865] hover:bg-[#002b4d] text-white text-xs font-bold transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
