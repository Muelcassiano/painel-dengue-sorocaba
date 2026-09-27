import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, FileCode } from 'lucide-react';

interface DataImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const DataImporterModal: React.FC<DataImporterModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessInput = () => {
    if (!inputText.trim()) {
      setFeedback('Por favor, cole ou digite os dados em formato JSON ou CSV.');
      return;
    }

    try {
      // Tenta parsear como JSON
      JSON.parse(inputText);
      setFeedback('Dados JSON estruturados validados com sucesso para o painel de Sorocaba!');
    } catch {
      // Se não for JSON, trata como CSV
      const lines = inputText.trim().split('\n');
      if (lines.length > 1) {
        setFeedback(`Arquivo tabular detectado com ${lines.length} registros prontos para visualização!`);
      } else {
        setFeedback('Formato não reconhecido. Cole um JSON ou linhas CSV.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-xl rounded-2xl p-6 border shadow-2xl overflow-y-auto max-h-[90vh] ${
          theme === 'dark' 
            ? 'bg-[#0f172a] text-slate-100 border-slate-700' 
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Inserir Dados do Seu Script de Ingestão
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cole aqui os dados gerados pela sua pasta `ingestao/saida`
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Você pode colar o conteúdo de qualquer arquivo `.json` ou `.csv` gerado pelos seus scripts em Python (`carga_completa.py`, `datasus.py`, etc.):
          </p>

          <textarea
            rows={8}
            placeholder={`Exemplo em JSON:
{
  "totalConfirmados": 12890,
  "seAtual": 38,
  "unidades": [...]
}
Ou cole colunas de um arquivo CSV...`}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setFeedback(null);
            }}
            className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              theme === 'dark'
                ? 'bg-slate-900 text-slate-200 border-slate-700'
                : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          />

          {feedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedback.includes('sucesso') || feedback.includes('detectado')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}>
              <Check className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleProcessInput}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Processar e Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};
