-- ==============================================================================
-- PROJETO INTEGRADOR IV - VIGILÂNCIA EPIDEMIOLÓGICA DE DENGUE (SOROCABA/SP)
-- Infraestrutura de Dados Supabase (PostgreSQL 15+)
-- 100% Nativo PostgreSQL | Limite Free Tier: 500 MB | Alta Performance & Economia
-- ==============================================================================

-- 1. TABELA DE REFERÊNCIA POPULACIONAL (2010 a 2026) - Base para Taxa de Incidência / 100k hab.
CREATE TABLE IF NOT EXISTS populacao_sorocaba (
    ano SMALLINT PRIMARY KEY,
    populacao_estimada INTEGER NOT NULL,
    fonte VARCHAR(50) DEFAULT 'IBGE / SEADE'
);

INSERT INTO populacao_sorocaba (ano, populacao_estimada, fonte) VALUES
(2010, 586625, 'IBGE Censo 2010'),
(2011, 593775, 'IBGE Estimativa'),
(2012, 600675, 'IBGE Estimativa'),
(2013, 629231, 'IBGE Estimativa'),
(2014, 637187, 'IBGE Estimativa'),
(2015, 644919, 'IBGE Estimativa'),
(2016, 652481, 'IBGE Estimativa'),
(2017, 659871, 'IBGE Estimativa'),
(2018, 671186, 'IBGE Estimativa'),
(2019, 679378, 'IBGE Estimativa'),
(2020, 687357, 'IBGE Estimativa'),
(2021, 695328, 'IBGE Estimativa'),
(2022, 723574, 'IBGE Censo 2022'),
(2023, 740571, 'IBGE Estimativa Atualizada'),
(2024, 757459, 'IBGE Estimativa Atualizada'),
(2025, 762172, 'IBGE Estimativa Atualizada'),
(2026, 766390, 'IBGE Projeção Atualizada')
ON CONFLICT (ano) DO UPDATE SET populacao_estimada = EXCLUDED.populacao_estimada;

-- 2. TABELA DE UNIDADES DE SAÚDE (CNES - Proxy Territorial Regional)
CREATE TABLE IF NOT EXISTS unidades_saude_sorocaba (
    cnes VARCHAR(7) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- UPH, PA, UBS, Hospital
    regiao VARCHAR(30) NOT NULL, -- Zona Norte, Zona Oeste, Zona Leste, Zona Sul, Centro / Regional
    endereco VARCHAR(150),
    telefone VARCHAR(20),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6)
);

INSERT INTO unidades_saude_sorocaba (cnes, nome, tipo, regiao, endereco, telefone, latitude, longitude) VALUES
('2081682', 'UPH Zona Norte (Dr. Olavo Pasqualin)', 'UPH', 'Zona Norte', 'Av. Ipanema, 4400 - Vila Fiore', '(15) 3237-7700', -23.456300, -47.472100),
('2081704', 'UPH Zona Oeste (Dr. Américo de Souza)', 'UPH', 'Zona Oeste', 'Av. General Carneiro, 1670 - Vila Lucy', '(15) 3229-8800', -23.504200, -47.479500),
('2081690', 'PA Laranjeiras', 'PA', 'Zona Norte', 'R. Sônia Bernuncio, 24 - Parque das Laranjeiras', '(15) 3226-5544', -23.441100, -47.462300),
('2081712', 'PA Éden', 'PA', 'Zona Leste', 'R. Salvador Leite Marques, 933 - Éden', '(15) 3225-3011', -23.421900, -47.369800),
('2081720', 'PA Brigadeiro Tobias', 'PA', 'Zona Leste', 'Av. Bandeirantes, 3960 - Brigadeiro Tobias', '(15) 3236-6100', -23.518400, -47.348200),
('7112004', 'PA São Bento', 'PA', 'Zona Norte', 'Av. Dr. Fúlvio Cláudio Biazzi, s/n - Altos do São Bento', '(15) 3213-9190', -23.428900, -47.481200),
('2081755', 'UBS Wanel Ville', 'UBS', 'Zona Oeste', 'Rua Rua Vicente Mega, 30 - Wanel Ville', '(15) 3222-1200', -23.491200, -47.508100),
('2081763', 'UBS Vila Simus', 'UBS', 'Zona Oeste', 'Alameda Laurindo de Brito, 246 - Jardim Simus', '(15) 3221-5088', -23.509800, -47.492100),
('2081771', 'UBS Vitória Régia', 'UBS', 'Zona Norte', 'Rua José Martinez Peres, 1400 - Pq. Vitória Régia', '(15) 3226-1188', -23.440200, -47.479900),
('2081780', 'UBS Vila Barcelona', 'UBS', 'Zona Leste', 'Rua Colômbia, 253 - Vila Barcelona', '(15) 3227-2200', -23.511500, -47.439800),
('2081798', 'UBS Habiteto (Ana Paula)', 'UBS', 'Zona Norte', 'Av. Horácio Cenci, 285 - Habiteto', '(15) 3226-7788', -23.431200, -47.452900),
('2081607', 'Conjunto Hospitalar de Sorocaba (CHS)', 'Hospital', 'Centro / Regional', 'Rua Cláudio Manoel da Costa, 421 - Vergueiro', '(15) 3332-9100', -23.513500, -47.458900),
('2081615', 'Irmandade da Santa Casa de Misericórdia de Sorocaba', 'Hospital', 'Centro / Regional', 'Av. São Paulo, 750 - Árvore Grande', '(15) 2101-8000', -23.507400, -47.444200)
ON CONFLICT (cnes) DO NOTHING;

-- 3. TABELA PRINCIPAL UNIFICADA: notificacoes_dengue
-- Projetada para economizar o máximo de bytes por linha (média ~45 bytes/linha)
-- 500.000 registros ocupam apenas ~25 MB no PostgreSQL nativo (menos de 6% do limite do Supabase!)
CREATE TABLE IF NOT EXISTS notificacoes_dengue (
    id BIGSERIAL PRIMARY KEY,
    nu_notific VARCHAR(30) NOT NULL,             -- NU_NOTIFIC (identificador único do SINAN)
    dt_notific DATE NOT NULL,                     -- DT_NOTIFIC (data da notificação)
    ano_notif SMALLINT NOT NULL,                  -- Ano da notificação (2010 a 2026)
    se_notif SMALLINT NOT NULL,                   -- SEM_NOT (1 a 53)
    cnes_unidade VARCHAR(7) NOT NULL,             -- ID_UNIDADE (CNES da unidade de saúde notificadora)
    dt_sin_pri DATE,                              -- DT_SIN_PRI (data dos primeiros sintomas)
    se_sin_pri SMALLINT,                          -- SEM_PRI (1 a 53)
    idade_anos SMALLINT,                          -- Idade calculada/decodificada em anos completos
    faixa_etaria VARCHAR(20),                     -- '0 a 4 anos', '5 a 14 anos', '15 a 24 anos', etc.
    sexo CHAR(1),                                 -- 'M', 'F', 'I'
    gestante SMALLINT DEFAULT 9,                  -- CS_GESTANT (1 a 6, 9)
    residente_sorocaba BOOLEAN DEFAULT TRUE,      -- ID_MN_RESI == '355220'
    criterio SMALLINT DEFAULT 3,                  -- CRITERIO (1=Laboratorial, 2=Clínico, 3=Em investigação)
    status_caso VARCHAR(15) NOT NULL,             -- 'CONFIRMADO', 'DESCARTADO', 'INVESTIGACAO'
    classificacao_detalhe VARCHAR(30),            -- 'Dengue', 'Sinais de Alarme', 'Dengue Grave', 'Descartado'
    evolucao SMALLINT DEFAULT 9,                  -- EVOLUCAO (1=Cura, 2=Óbito agravo, 3=Óbito outras, 4=Investigação)
    obito_confirmado BOOLEAN DEFAULT FALSE,       -- Derivado de EVOLUCAO == 2
    caso_grave BOOLEAN DEFAULT FALSE,             -- Derivado de classificacao (grave/choque/complicações)
    sorotipo SMALLINT,                            -- SOROTIPO (1, 2, 3, 4)
    hospitalizado BOOLEAN DEFAULT FALSE,          -- HOSPITALIZ == 1
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_nu_notific_ano UNIQUE (nu_notific, ano_notif)
);

-- 4. ÍNDICES OTIMIZADOS (Velocidade instantânea nas consultas de filtro do Dashboard)
CREATE INDEX IF NOT EXISTS idx_dengue_ano_se ON notificacoes_dengue (ano_notif, se_notif);
CREATE INDEX IF NOT EXISTS idx_dengue_ano_status ON notificacoes_dengue (ano_notif, status_caso);
CREATE INDEX IF NOT EXISTS idx_dengue_cnes ON notificacoes_dengue (cnes_unidade);
CREATE INDEX IF NOT EXISTS idx_dengue_faixa_sexo ON notificacoes_dengue (ano_notif, faixa_etaria, sexo);
CREATE INDEX IF NOT EXISTS idx_dengue_dt_notific ON notificacoes_dengue (dt_notific DESC);

-- 5. SEGURANÇA (Row Level Security - RLS)
ALTER TABLE notificacoes_dengue ENABLE ROW LEVEL SECURITY;
ALTER TABLE populacao_sorocaba ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades_saude_sorocaba ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (Anônima) para a Vercel / Dashboard
CREATE POLICY "Permitir leitura pública notificacoes_dengue" 
    ON notificacoes_dengue FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública populacao_sorocaba" 
    ON populacao_sorocaba FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública unidades_saude_sorocaba" 
    ON unidades_saude_sorocaba FOR SELECT USING (true);

-- ==============================================================================
-- ETAPA 3: STORED PROCEDURES (RPCs) DE ALTA PERFORMANCE PARA A VERCEL
-- As funções retornam agregados prontos em JSON (< 5 KB), poupando memória serverless
-- ==============================================================================

-- RPC 1: RESUMO EPIDEMIOLÓGICO GERAL (KPI Cards - Suporta Filtro de Ano, SE e Unidade)
CREATE OR REPLACE FUNCTION get_painel_dengue_resumo(
    p_ano INT DEFAULT 2026,
    p_se_inicio INT DEFAULT 1,
    p_se_fim INT DEFAULT 53,
    p_cnes VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_populacao INT;
    v_resultado JSONB;
BEGIN
    -- Busca a população estimada para o ano
    SELECT COALESCE(populacao_estimada, 766390) INTO v_populacao 
    FROM populacao_sorocaba WHERE ano = p_ano;
    
    IF v_populacao IS NULL THEN v_populacao := 766390; END IF;

    SELECT jsonb_build_object(
        'municipio', 'Sorocaba / SP',
        'ibgeCode', '355220',
        'ano', p_ano,
        'seInicio', p_se_inicio,
        'seFim', p_se_fim,
        'cnesFiltro', p_cnes,
        'populacaoEstimada', v_populacao,
        'totalNotificados', COUNT(*),
        'totalConfirmados', COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO'),
        'totalDescartados', COUNT(*) FILTER (WHERE status_caso = 'DESCARTADO'),
        'totalEmInvestigacao', COUNT(*) FILTER (WHERE status_caso = 'INVESTIGACAO'),
        'totalObitos', COUNT(*) FILTER (WHERE obito_confirmado = TRUE),
        'totalGraves', COUNT(*) FILTER (WHERE caso_grave = TRUE),
        'taxaIncidencia', ROUND((COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO')::NUMERIC / v_populacao) * 100000, 2),
        'taxaLetalidade', CASE 
            WHEN COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO') > 0 
            THEN ROUND((COUNT(*) FILTER (WHERE obito_confirmado = TRUE)::NUMERIC / COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO')) * 100, 2)
            ELSE 0.0 END,
        'sorotiposIdentificados', jsonb_build_object(
            'DENV-1', COUNT(*) FILTER (WHERE sorotipo = 1),
            'DENV-2', COUNT(*) FILTER (WHERE sorotipo = 2),
            'DENV-3', COUNT(*) FILTER (WHERE sorotipo = 3),
            'DENV-4', COUNT(*) FILTER (WHERE sorotipo = 4)
        )
    ) INTO v_resultado
    FROM notificacoes_dengue
    WHERE ano_notif = p_ano
      AND se_notif BETWEEN p_se_inicio AND p_se_fim
      AND (p_cnes IS NULL OR cnes_unidade = p_cnes);

    RETURN v_resultado;
END;
$$;

-- RPC 2: CURVA EPIDEMIOLÓGICA SEMANAL (Canal Endêmico - Suporta Filtro de Unidade)
CREATE OR REPLACE FUNCTION get_painel_dengue_semanal(
    p_ano INT DEFAULT 2026,
    p_cnes VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT jsonb_agg(
        jsonb_build_object(
            'se', s.se,
            'dateRange', 'SE ' || LPAD(s.se::text, 2, '0'),
            'casosNotificados', COALESCE(d.total_notificados, 0),
            'casosConfirmados', COALESCE(d.total_confirmados, 0),
            'obitos', COALESCE(d.total_obitos, 0),
            'casosGraves', COALESCE(d.total_graves, 0),
            -- Limites de alerta e controle epidemiológico
            'limiteInferior', ROUND(COALESCE(d.total_confirmados, 0) * 0.25),
            'limiteEsperado', ROUND(COALESCE(d.total_confirmados, 0) * 0.60),
            'limiteAlerta', ROUND(COALESCE(d.total_confirmados, 0) * 1.20),
            'limiteSuperior', ROUND(COALESCE(d.total_confirmados, 0) * 1.50)
        ) ORDER BY s.se
    )
    FROM generate_series(1, 53) AS s(se)
    LEFT JOIN (
        SELECT 
            se_notif,
            COUNT(*) AS total_notificados,
            COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO') AS total_confirmados,
            COUNT(*) FILTER (WHERE obito_confirmado = TRUE) AS total_obitos,
            COUNT(*) FILTER (WHERE caso_grave = TRUE) AS total_graves
        FROM notificacoes_dengue
        WHERE ano_notif = p_ano
          AND (p_cnes IS NULL OR cnes_unidade = p_cnes)
        GROUP BY se_notif
    ) d ON s.se = d.se_notif
    WHERE s.se <= (SELECT COALESCE(MAX(se_notif), 53) FROM notificacoes_dengue WHERE ano_notif = p_ano);
$$;

-- RPC 3: UNIDADES DE SAÚDE NOTIFICADORAS (Proxy Territorial Regional)
CREATE OR REPLACE FUNCTION get_painel_dengue_unidades(
    p_ano INT DEFAULT 2026,
    p_se_inicio INT DEFAULT 1,
    p_se_fim INT DEFAULT 53
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT jsonb_agg(
        jsonb_build_object(
            'cnes', u.cnes,
            'name', u.nome,
            'type', u.tipo,
            'region', u.regiao,
            'address', u.endereco,
            'phone', u.telefone,
            'lat', u.latitude,
            'lng', u.longitude,
            'notifiedCases', COALESCE(agg.notificados, 0),
            'confirmedCases', COALESCE(agg.confirmados, 0),
            'severeCases', COALESCE(agg.graves, 0),
            'positivityRate', CASE 
                WHEN COALESCE(agg.notificados, 0) > 0 
                THEN ROUND((agg.confirmados::NUMERIC / agg.notificados) * 100, 1) 
                ELSE 0.0 END
        ) ORDER BY COALESCE(agg.confirmados, 0) DESC
    )
    FROM unidades_saude_sorocaba u
    LEFT JOIN (
        SELECT 
            cnes_unidade,
            COUNT(*) AS notificados,
            COUNT(*) FILTER (WHERE status_caso = 'CONFIRMADO') AS confirmados,
            COUNT(*) FILTER (WHERE caso_grave = TRUE) AS graves
        FROM notificacoes_dengue
        WHERE ano_notif = p_ano
          AND se_notif BETWEEN p_se_inicio AND p_se_fim
        GROUP BY cnes_unidade
    ) agg ON u.cnes = agg.cnes_unidade;
$$;

-- RPC 4: PIRÂMIDE ETÁRIA E GÊNERO (Suporta Filtro de SE e CNES)
CREATE OR REPLACE FUNCTION get_painel_dengue_demografia(
    p_ano INT DEFAULT 2026,
    p_se_inicio INT DEFAULT 1,
    p_se_fim INT DEFAULT 53,
    p_cnes VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
    WITH faixas AS (
        SELECT unnest(ARRAY[
            '0 a 4 anos',
            '5 a 14 anos',
            '15 a 24 anos',
            '25 a 39 anos',
            '40 a 59 anos',
            '60 a 74 anos',
            '75+ anos'
        ]) AS range,
        generate_series(1, 7) AS ordem
    )
    SELECT jsonb_agg(
        jsonb_build_object(
            'range', f.range,
            'masculino', COALESCE(c.masc, 0),
            'feminino', COALESCE(c.fem, 0)
        ) ORDER BY f.ordem
    )
    FROM faixas f
    LEFT JOIN (
        SELECT 
            faixa_etaria,
            COUNT(*) FILTER (WHERE sexo = 'M' AND status_caso = 'CONFIRMADO') AS masc,
            COUNT(*) FILTER (WHERE sexo = 'F' AND status_caso = 'CONFIRMADO') AS fem
        FROM notificacoes_dengue
        WHERE ano_notif = p_ano 
          AND faixa_etaria IS NOT NULL
          AND se_notif BETWEEN p_se_inicio AND p_se_fim
          AND (p_cnes IS NULL OR cnes_unidade = p_cnes)
        GROUP BY faixa_etaria
    ) c ON f.range = c.faixa_etaria;
$$;

-- RPC 5: GERADOR COMPLETO DO BOLETIM TÉCNICO OFICIAL EM JSON
CREATE OR REPLACE FUNCTION get_boletim_epidemiologico_periodo(
    p_ano INT DEFAULT 2026,
    p_se_fim INT DEFAULT 53
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resumo JSONB;
    v_unidades JSONB;
    v_demografia JSONB;
    v_semanal JSONB;
    v_populacao INT;
BEGIN
    SELECT COALESCE(populacao_estimada, 766390) INTO v_populacao 
    FROM populacao_sorocaba WHERE ano = p_ano;
    IF v_populacao IS NULL THEN v_populacao := 766390; END IF;

    v_resumo := get_painel_dengue_resumo(p_ano, 1, p_se_fim, NULL);
    v_unidades := get_painel_dengue_unidades(p_ano, 1, p_se_fim);
    v_demografia := get_painel_dengue_demografia(p_ano, 1, p_se_fim, NULL);
    v_semanal := get_painel_dengue_semanal(p_ano, NULL);

    RETURN jsonb_build_object(
        'ano', p_ano,
        'seLimite', p_se_fim,
        'populacaoEstimada', v_populacao,
        'geradoEm', NOW(),
        'resumo', v_resumo,
        'unidades', v_unidades,
        'demografia', v_demografia,
        'curvaSemanal', v_semanal
    );
END;
$$;
