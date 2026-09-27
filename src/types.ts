export type ViewMode = 'citizen' | 'surveillance';

export type ThemeMode = 'light' | 'dark';

export type AccessibilityState = {
  fontSizeStep: number; // -1 (small), 0 (normal), 1 (large), 2 (extra large)
  highContrast: boolean;
  reducedMotion: boolean;
};

export type SeverityLevel = 'normal' | 'alerta' | 'emergencia';

export interface HealthUnit {
  id: string;
  cnes: string;
  name: string;
  type: 'UPH' | 'PA' | 'UBS' | 'Hospital';
  region: 'Zona Norte' | 'Zona Oeste' | 'Zona Leste' | 'Zona Sul' | 'Centro / Regional';
  address: string;
  phone: string;
  notifiedCases: number;
  confirmedCases: number;
  severeCases: number;
  positivityRate: number; // percentage
  lat: number;
  lng: number;
}

export interface EpidemiologicalWeek {
  se: number;
  dateRange: string;
  casosNotificados: number;
  casosConfirmados: number;
  obitos: number;
  casosGraves: number;
  // Canal endêmico (Limites de Borkow / Média histórica dos últimos anos)
  limiteInferior: number;
  limiteEsperado: number;
  limiteAlerta: number;
  limiteSuperior: number;
}

export interface AgeGenderDistribution {
  range: string;
  masculino: number;
  feminino: number;
}

export interface SorocabaEpidemiologicalSummary {
  municipio: string;
  ibgeCode: string;
  populacaoEstimada: number;
  anoAtual: number;
  seAtual: number;
  dataAtualizacao: string;
  statusAlerta: SeverityLevel;
  totalNotificados: number;
  totalConfirmados: number;
  totalDescartados: number;
  totalEmInvestigacao: number;
  totalObitos: number;
  totalGraves: number;
  taxaIncidencia: number; // por 100 mil hab
  taxaLetalidade: number; // %
  comparativoAnoAnterior: number; // % variação
  sorotiposIdentificados: { [key: string]: number };
}
