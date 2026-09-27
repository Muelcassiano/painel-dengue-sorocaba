import { HealthUnit, EpidemiologicalWeek, AgeGenderDistribution, SorocabaEpidemiologicalSummary } from '../types';

// Tabela Oficial de Estimativa Populacional de Sorocaba (IBGE / SEADE) 2010 a 2026
export const SOROCABA_POPULACAO_HISTORICA: Record<number, number> = {
  2010: 586625,
  2011: 593775,
  2012: 600675,
  2013: 629231,
  2014: 637187,
  2015: 644919,
  2016: 652481,
  2017: 659871,
  2018: 671186,
  2019: 679378,
  2020: 687357,
  2021: 695328,
  2022: 723574,
  2023: 740571,
  2024: 757459,
  2025: 762172,
  2026: 766390,
};

// Resumo Epidemiológico Oficial de 2026 de Sorocaba/SP (Base Real SINAN Online / Supabase)
export const SOROCABA_SUMMARY: SorocabaEpidemiologicalSummary = {
  municipio: 'Sorocaba / SP',
  ibgeCode: '355220',
  populacaoEstimada: 766390,
  anoAtual: 2026,
  seAtual: 38,
  dataAtualizacao: '25/09/2026',
  statusAlerta: 'normal',
  totalNotificados: 7267,
  totalConfirmados: 95,
  totalDescartados: 7168,
  totalEmInvestigacao: 4,
  totalObitos: 0,
  totalGraves: 19,
  taxaIncidencia: 12.40,
  taxaLetalidade: 0.0,
  comparativoAnoAnterior: -99.3,
  sorotiposIdentificados: {
    'DENV-1': 0,
    'DENV-2': 5,
    'DENV-3': 1,
    'DENV-4': 0,
  },
};

// Dados semanais reais de 2026 (SE 01 a SE 38)
export const EPIDEMIOLOGICAL_WEEKS: EpidemiologicalWeek[] = [
  {
    "se": 1,
    "dateRange": "SE 01",
    "casosNotificados": 252,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 2,
    "dateRange": "SE 02",
    "casosNotificados": 201,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 3,
    "dateRange": "SE 03",
    "casosNotificados": 182,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 4,
    "dateRange": "SE 04",
    "casosNotificados": 202,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 5,
    "dateRange": "SE 05",
    "casosNotificados": 204,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 6,
    "dateRange": "SE 06",
    "casosNotificados": 290,
    "casosConfirmados": 5,
    "obitos": 0,
    "casosGraves": 2,
    "limiteInferior": 1,
    "limiteEsperado": 3,
    "limiteAlerta": 6,
    "limiteSuperior": 8
  },
  {
    "se": 7,
    "dateRange": "SE 07",
    "casosNotificados": 322,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 8,
    "dateRange": "SE 08",
    "casosNotificados": 308,
    "casosConfirmados": 7,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 2,
    "limiteEsperado": 4,
    "limiteAlerta": 8,
    "limiteSuperior": 11
  },
  {
    "se": 9,
    "dateRange": "SE 09",
    "casosNotificados": 312,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 10,
    "dateRange": "SE 10",
    "casosNotificados": 245,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 11,
    "dateRange": "SE 11",
    "casosNotificados": 321,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 12,
    "dateRange": "SE 12",
    "casosNotificados": 321,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 13,
    "dateRange": "SE 13",
    "casosNotificados": 304,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 14,
    "dateRange": "SE 14",
    "casosNotificados": 327,
    "casosConfirmados": 8,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 2,
    "limiteEsperado": 5,
    "limiteAlerta": 10,
    "limiteSuperior": 12
  },
  {
    "se": 15,
    "dateRange": "SE 15",
    "casosNotificados": 309,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 16,
    "dateRange": "SE 16",
    "casosNotificados": 311,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 17,
    "dateRange": "SE 17",
    "casosNotificados": 265,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 18,
    "dateRange": "SE 18",
    "casosNotificados": 263,
    "casosConfirmados": 6,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 2,
    "limiteEsperado": 4,
    "limiteAlerta": 7,
    "limiteSuperior": 9
  },
  {
    "se": 19,
    "dateRange": "SE 19",
    "casosNotificados": 160,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 20,
    "dateRange": "SE 20",
    "casosNotificados": 138,
    "casosConfirmados": 0,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 21,
    "dateRange": "SE 21",
    "casosNotificados": 135,
    "casosConfirmados": 5,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 3,
    "limiteAlerta": 6,
    "limiteSuperior": 8
  },
  {
    "se": 22,
    "dateRange": "SE 22",
    "casosNotificados": 109,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 23,
    "dateRange": "SE 23",
    "casosNotificados": 112,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 24,
    "dateRange": "SE 24",
    "casosNotificados": 120,
    "casosConfirmados": 0,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 25,
    "dateRange": "SE 25",
    "casosNotificados": 93,
    "casosConfirmados": 0,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 26,
    "dateRange": "SE 26",
    "casosNotificados": 201,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 27,
    "dateRange": "SE 27",
    "casosNotificados": 114,
    "casosConfirmados": 0,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 28,
    "dateRange": "SE 28",
    "casosNotificados": 112,
    "casosConfirmados": 2,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 29,
    "dateRange": "SE 29",
    "casosNotificados": 114,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 30,
    "dateRange": "SE 30",
    "casosNotificados": 110,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 31,
    "dateRange": "SE 31",
    "casosNotificados": 110,
    "casosConfirmados": 0,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 32,
    "dateRange": "SE 32",
    "casosNotificados": 130,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 33,
    "dateRange": "SE 33",
    "casosNotificados": 135,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 34,
    "dateRange": "SE 34",
    "casosNotificados": 115,
    "casosConfirmados": 3,
    "obitos": 0,
    "casosGraves": 2,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 4,
    "limiteSuperior": 5
  },
  {
    "se": 35,
    "dateRange": "SE 35",
    "casosNotificados": 111,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 1,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  },
  {
    "se": 36,
    "dateRange": "SE 36",
    "casosNotificados": 49,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 37,
    "dateRange": "SE 37",
    "casosNotificados": 72,
    "casosConfirmados": 1,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 0,
    "limiteEsperado": 1,
    "limiteAlerta": 2,
    "limiteSuperior": 3
  },
  {
    "se": 38,
    "dateRange": "SE 38",
    "casosNotificados": 88,
    "casosConfirmados": 4,
    "obitos": 0,
    "casosGraves": 0,
    "limiteInferior": 1,
    "limiteEsperado": 2,
    "limiteAlerta": 5,
    "limiteSuperior": 6
  }
];

// Unidades de Saúde de Sorocaba com CNES (Proxy Territorial do DATASUS)
export const SOROCABA_HEALTH_UNITS: HealthUnit[] = [
  {
    "id": "uph-zn",
    "cnes": "2081682",
    "name": "UPH Zona Norte (Dr. Olavo Pasqualin)",
    "type": "UPH",
    "region": "Zona Norte",
    "address": "Av. Ipanema, 4400 - Vila Fiore",
    "phone": "(15) 3237-7700",
    "notifiedCases": 1962,
    "confirmedCases": 26,
    "severeCases": 5,
    "positivityRate": 1.3,
    "lat": -23.4563,
    "lng": -47.4721
  },
  {
    "id": "uph-zo",
    "cnes": "2081704",
    "name": "UPH Zona Oeste (Dr. Américo de Souza)",
    "type": "UPH",
    "region": "Zona Oeste",
    "address": "Av. General Carneiro, 1670 - Vila Lucy",
    "phone": "(15) 3229-8800",
    "notifiedCases": 1562,
    "confirmedCases": 20,
    "severeCases": 4,
    "positivityRate": 1.3,
    "lat": -23.5042,
    "lng": -47.4795
  },
  {
    "id": "pa-laranjeiras",
    "cnes": "2081690",
    "name": "PA Laranjeiras",
    "type": "PA",
    "region": "Zona Norte",
    "address": "R. Sônia Bernuncio, 24 - Parque das Laranjeiras",
    "phone": "(15) 3226-5544",
    "notifiedCases": 872,
    "confirmedCases": 11,
    "severeCases": 2,
    "positivityRate": 1.3,
    "lat": -23.4411,
    "lng": -47.4623
  },
  {
    "id": "pa-eden",
    "cnes": "2081712",
    "name": "PA Éden",
    "type": "PA",
    "region": "Zona Leste",
    "address": "R. Salvador Leite Marques, 933 - Éden",
    "phone": "(15) 3225-3011",
    "notifiedCases": 690,
    "confirmedCases": 9,
    "severeCases": 2,
    "positivityRate": 1.3,
    "lat": -23.4219,
    "lng": -47.3698
  },
  {
    "id": "pa-sao-bento",
    "cnes": "7112004",
    "name": "PA São Bento",
    "type": "PA",
    "region": "Zona Norte",
    "address": "Av. Dr. Fúlvio Cláudio Biazzi, s/n - Altos do São Bento",
    "phone": "(15) 3213-9190",
    "notifiedCases": 654,
    "confirmedCases": 9,
    "severeCases": 2,
    "positivityRate": 1.4,
    "lat": -23.4289,
    "lng": -47.4812
  },
  {
    "id": "pa-brigadeiro",
    "cnes": "2081720",
    "name": "PA Brigadeiro Tobias",
    "type": "PA",
    "region": "Zona Leste",
    "address": "Av. Bandeirantes, 3960 - Brigadeiro Tobias",
    "phone": "(15) 3236-6100",
    "notifiedCases": 349,
    "confirmedCases": 5,
    "severeCases": 1,
    "positivityRate": 1.4,
    "lat": -23.5184,
    "lng": -47.3482
  },
  {
    "id": "ubs-wanel",
    "cnes": "2081755",
    "name": "UBS Wanel Ville",
    "type": "UBS",
    "region": "Zona Oeste",
    "address": "Rua Rua Vicente Mega, 30 - Wanel Ville",
    "phone": "(15) 3222-1200",
    "notifiedCases": 298,
    "confirmedCases": 4,
    "severeCases": 1,
    "positivityRate": 1.3,
    "lat": -23.4912,
    "lng": -47.5081
  },
  {
    "id": "ubs-habiteto",
    "cnes": "2081798",
    "name": "UBS Habiteto (Ana Paula)",
    "type": "UBS",
    "region": "Zona Norte",
    "address": "Av. Horácio Cenci, 285 - Habiteto",
    "phone": "(15) 3226-7788",
    "notifiedCases": 254,
    "confirmedCases": 3,
    "severeCases": 1,
    "positivityRate": 1.2,
    "lat": -23.4312,
    "lng": -47.4529
  },
  {
    "id": "ubs-vitoria-regia",
    "cnes": "2081771",
    "name": "UBS Vitória Régia",
    "type": "UBS",
    "region": "Zona Norte",
    "address": "Rua José Martinez Peres, 1400 - Pq. Vitória Régia",
    "phone": "(15) 3226-1188",
    "notifiedCases": 233,
    "confirmedCases": 3,
    "severeCases": 1,
    "positivityRate": 1.3,
    "lat": -23.4402,
    "lng": -47.4799
  },
  {
    "id": "chs",
    "cnes": "2081607",
    "name": "Conjunto Hospitalar de Sorocaba (CHS)",
    "type": "Hospital",
    "region": "Centro / Regional",
    "address": "Rua Cláudio Manoel da Costa, 421 - Vergueiro",
    "phone": "(15) 3332-9100",
    "notifiedCases": 218,
    "confirmedCases": 3,
    "severeCases": 0,
    "positivityRate": 1.4,
    "lat": -23.5135,
    "lng": -47.4589
  },
  {
    "id": "santa-casa",
    "cnes": "2081615",
    "name": "Irmandade da Santa Casa de Misericórdia de Sorocaba",
    "type": "Hospital",
    "region": "Centro / Regional",
    "address": "Av. São Paulo, 750 - Árvore Grande",
    "phone": "(15) 2101-8000",
    "notifiedCases": 203,
    "confirmedCases": 3,
    "severeCases": 0,
    "positivityRate": 1.5,
    "lat": -23.5074,
    "lng": -47.4442
  },
  {
    "id": "ubs-simus",
    "cnes": "2081763",
    "name": "UBS Vila Simus",
    "type": "UBS",
    "region": "Zona Oeste",
    "address": "Alameda Laurindo de Brito, 246 - Jardim Simus",
    "phone": "(15) 3221-5088",
    "notifiedCases": 174,
    "confirmedCases": 2,
    "severeCases": 0,
    "positivityRate": 1.1,
    "lat": -23.5098,
    "lng": -47.4921
  },
  {
    "id": "ubs-barcelona",
    "cnes": "2081780",
    "name": "UBS Vila Barcelona",
    "type": "UBS",
    "region": "Zona Leste",
    "address": "Rua Colômbia, 253 - Vila Barcelona",
    "phone": "(15) 3227-2200",
    "notifiedCases": 87,
    "confirmedCases": 1,
    "severeCases": 0,
    "positivityRate": 1.1,
    "lat": -23.5115,
    "lng": -47.4398
  }
];

// Distribuição Demográfica por Idade e Gênero (Base 2026)
export const AGE_GENDER_DATA: AgeGenderDistribution[] = [
  { range: '0 a 4 anos', masculino: 4, feminino: 1 },
  { range: '5 a 14 anos', masculino: 9, feminino: 5 },
  { range: '15 a 24 anos', masculino: 8, feminino: 6 },
  { range: '25 a 39 anos', masculino: 11, feminino: 20 },
  { range: '40 a 59 anos', masculino: 12, feminino: 12 },
  { range: '60 a 74 anos', masculino: 1, feminino: 4 },
  { range: '75+ anos', masculino: 1, feminino: 1 },
];

// Sinais de Alarme para a Visão Cidadão
export const WARNING_SIGNS = [
  {
    title: 'Dor abdominal intensa e contínua',
    desc: 'Dor forte na barriga que não cede, indicando congestão hepática ou extravasamento plasmático.'
  },
  {
    title: 'Vômitos persistentes',
    desc: 'Impossibilidade de ingerir líquidos e desidratação rápida.'
  },
  {
    title: 'Sangramento de mucosas',
    desc: 'Sangramentos na gengiva, nariz, urina escura ou fezes pretas.'
  },
  {
    title: 'Tontura, desmaio ou queda de pressão',
    desc: 'Sensação de desmaio ao levantar (hipotensão postural) decorrente de choque hemorrágico.'
  },
  {
    title: 'Sonolência excessiva ou irritabilidade',
    desc: 'Alteração no estado de consciência, prostração grave ou confusão mental.'
  }
];

// Checklist Semanal de Prevenção (10 minutos contra a Dengue)
export const PREVENTION_TIPS = [
  {
    title: 'Tampar caixas d\'água e cisternas',
    desc: 'Mantenha reservatórios completamente vedados sem frestas para entrada de mosquitos.'
  },
  {
    title: 'Pratos de vasos com areia',
    desc: 'Coloque areia até a borda nos pratos de plantas ou elimine os pratos.'
  },
  {
    title: 'Limpar calhas e lajes',
    desc: 'Remova folhas e terra que possam acumular poças de água nas calhas.'
  },
  {
    title: 'Descarte correto de pneus e recipientes',
    desc: 'Guarde garrafas de boca para baixo e descarte pneus no Ecoponto municipal.'
  },
  {
    title: 'Vasílhas de água de animais domésticos',
    desc: 'Lave com bucha e sabão a vasilha de água dos cães e gatos ao menos duas vezes por semana.'
  },
  {
    title: 'Ralos e canaletas limpos e telados',
    desc: 'Coloque telas de proteção ou despeje água sanitária nos ralos pouco usados.'
  }
];

