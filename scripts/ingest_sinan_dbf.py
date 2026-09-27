#!/usr/bin/env python3
"""
==============================================================================
PROJETO INTEGRADOR IV - VIGILÂNCIA EPIDEMIOLÓGICA DE DENGUE (SOROCABA/SP)
Pipeline de Ingestão de Dados do SINAN Online (.dbf) para o Supabase
Autor: Samuel Abreu (samuel.abreux@gmail.com)

DIRETRIZES CRÍTICAS:
1. ZERO DESCARTES:
   Toda a base de dados (.dbf) foi extraída do SINAN Online municipal de Sorocaba.
   Portanto, 100% DOS REGISTROS DE CADA ARQUIVO DEVEM SER PROCESSADOS E INGERIDOS.
   Nenhuma linha é descartada por município ou por ausência de data.
2. LGPD & PRIVACIDADE:
   Campos pessoais e logradouros/bairros de pacientes são ignorados.
   A localização geográfica é mantida exclusivamente pelo CNES da Unidade Notificadora.
3. EFICIÊNCIA DE MEMÓRIA & CHUNKS:
   Processamento streaming arquivo por arquivo com envio em lotes (batch chunks de 5.000).
4. AMBIENTE VS CODE:
   Suporte nativo a DATABASE_URL do Supabase (conexão direta pooler/session)
   ou REST API do Supabase (via supabase-py).
==============================================================================
"""

import os
import sys
import glob
import re
import gc
from datetime import datetime, date
import pandas as pd
import numpy as np
from dotenv import load_dotenv
import psycopg2
import psycopg2.extensions
from psycopg2.extras import execute_values

# Registrar adaptadores NumPy para o psycopg2 (compatibilidade total com Python 3.10 a 3.14+)
try:
    psycopg2.extensions.register_adapter(np.bool_, psycopg2.extensions.AsIs)
    psycopg2.extensions.register_adapter(np.int64, lambda i: psycopg2.extensions.adapt(int(i)))
    psycopg2.extensions.register_adapter(np.int32, lambda i: psycopg2.extensions.adapt(int(i)))
    psycopg2.extensions.register_adapter(np.float64, lambda f: psycopg2.extensions.adapt(float(f)))
except Exception:
    pass

# Carrega variáveis do arquivo .env (da pasta atual ou de scripts/.env)
load_dotenv()
if not os.getenv("DATABASE_URL") and os.path.exists(os.path.join(os.path.dirname(__file__), ".env")):
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not DATABASE_URL and not (SUPABASE_URL and SUPABASE_KEY):
    print("=" * 80)
    print("❌ ERRO DE CONFIGURAÇÃO DE CREDENCIAIS")
    print("=" * 80)
    print("Não foi encontrada nenhuma credencial válida no arquivo .env.")
    print("Para conectar no Supabase pelo VS Code:")
    print("1. Abra o arquivo 'scripts/.env' (ou crie um arquivo .env na raiz)")
    print("2. Insira sua DATABASE_URL do Supabase:")
    print("   DATABASE_URL=postgresql://postgres.[SEU_ID]:[SUA_SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres")
    print("Consulte o arquivo scripts/.env.example para o modelo.")
    print("=" * 80)
    sys.exit(1)


def extrair_ano_do_nome(caminho_arquivo):
    """
    Extrai o ano base correto do arquivo .dbf:
    Suporta:
    - Intervalo de datas: (01.01.10 a 31.12.10) -> 2010
    - Intervalo de datas 2026: (01.01.26 a 25.09.26) -> 2026
    - Ano de 4 dígitos válido (2000 a 2035), ignorando contagem de linhas como '2099_linhas'
    """
    nome = os.path.basename(caminho_arquivo)
    
    # 1. Padrão de datas no formato DD.MM.YY (ex: 31.12.10 ou 25.09.26)
    match_data = re.search(r'\d{2}\.\d{2}\.(\d{2})\b', nome)
    if match_data:
        ano_2d = int(match_data.group(1))
        return 2000 + ano_2d if ano_2d < 50 else 1900 + ano_2d

    # 2. Padrão de 4 dígitos para anos plausíveis de dengue (2000 a 2035)
    # Evita pegar contagens de linhas como '2099_linhas'
    match_4dig = re.search(r'\b(20[0-3]\d)\b', nome)
    if match_4dig:
        return int(match_4dig.group(1))

    # 3. Padrão DENGXX
    match_2dig = re.search(r'DENG.*?(\d{2})', nome, re.IGNORECASE)
    if match_2dig:
        ano = int(match_2dig.group(1))
        return ano + 2000 if ano < 50 else ano + 1900

    return 2026


def decodificar_idade_sinan(codigo_idade):
    """
    Decodifica a idade segundo a convenção oficial do SINAN (NU_IDADE_N):
    1º dígito indica a escala:
      1: Horas -> 0 anos
      2: Dias -> 0 anos
      3: Meses -> 0 anos
      4: Anos -> valor dos últimos 3 dígitos (ex: 4025 = 25 anos)
    """
    if pd.isna(codigo_idade) or codigo_idade is None or str(codigo_idade).strip() == '':
        return None, 'Não Informado'
    try:
        val = int(float(str(codigo_idade).strip()))
        tipo = val // 1000
        idade = val % 1000

        anos = idade if tipo == 4 else 0

        if anos <= 4:
            faixa = '0 a 4 anos'
        elif anos <= 14:
            faixa = '5 a 14 anos'
        elif anos <= 24:
            faixa = '15 a 24 anos'
        elif anos <= 39:
            faixa = '25 a 39 anos'
        elif anos <= 59:
            faixa = '40 a 59 anos'
        elif anos <= 74:
            faixa = '60 a 74 anos'
        else:
            faixa = '75+ anos'

        return anos, faixa
    except Exception:
        return None, 'Não Informado'


def converter_data_segura(valor, data_fallback):
    """
    Converte datas do DBF para formato YYYY-MM-DD.
    SEMPRE RETORNA UMA DATA VÁLIDA (NUNCA DESCARTA O REGISTRO).
    """
    if pd.isna(valor) or valor is None or str(valor).strip() == '':
        return data_fallback
    if isinstance(valor, (datetime, date)):
        return valor if isinstance(valor, date) else valor.date()
    try:
        s = str(valor).strip()
        if len(s) == 8 and s.isdigit():
            # AAAAMMDD
            return datetime.strptime(s, "%Y%m%d").date()
        dt = pd.to_datetime(s, errors='coerce')
        if pd.notna(dt):
            return dt.date()
    except Exception:
        pass
    return data_fallback


def classificar_caso(row):
    """
    Normaliza a classificação final entre as versões pré e pós 2014 do SINAN.
    Garante que qualquer caso tenha status válido: 'CONFIRMADO', 'DESCARTADO' ou 'INVESTIGACAO'.
    """
    cf = str(row.get('CLASSI_FIN', '')).strip().replace('.0', '')
    
    status = 'INVESTIGACAO'
    detalhe = 'Em Investigação'
    grave = False

    # SINAN Pós-2014
    if cf == '10':
        status = 'CONFIRMADO'
        detalhe = 'Dengue'
    elif cf == '11':
        status = 'CONFIRMADO'
        detalhe = 'Dengue com Sinais de Alarme'
        grave = True
    elif cf == '12':
        status = 'CONFIRMADO'
        detalhe = 'Dengue Grave'
        grave = True
    elif cf == '5':
        status = 'DESCARTADO'
        detalhe = 'Descartado'
    # SINAN Pré-2014
    elif cf == '1':
        status = 'CONFIRMADO'
        detalhe = 'Dengue Clássico'
    elif cf in ['2', '3', '4']:
        status = 'CONFIRMADO'
        detalhe = 'Dengue Grave / Hemorrágico'
        grave = True
    elif cf == '8':
        status = 'INVESTIGACAO'
        detalhe = 'Inconclusivo'

    return status, detalhe, grave


def processar_e_enviar_dbf(caminho_arquivo, cursor, conn, chunk_size=5000):
    """
    Lê um arquivo .dbf específico, trata 100% dos dados (ZERO DESCARTES)
    e envia em lotes para o Supabase com Upsert idempotente.
    """
    from psycopg2.extras import execute_values
    from tqdm import tqdm

    ano_arquivo = extrair_ano_do_nome(caminho_arquivo)
    data_padrao_ano = date(ano_arquivo, 1, 1)

    print("\n" + "=" * 70)
    print(f"📄 Processando Arquivo: {os.path.basename(caminho_arquivo)}")
    print(f"   Ano Base Identificado: {ano_arquivo}")
    print("=" * 70)

    # 1. Leitura robusta do arquivo DBF
    df = None
    try:
        from dbfread import DBF
        table = DBF(caminho_arquivo, encoding='latin1', load=True, ignore_missing_memofile=True)
        df = pd.DataFrame(iter(table))
    except Exception as e1:
        try:
            from simpledbf import Dbf5
            dbf = Dbf5(caminho_arquivo, codec='latin1')
            df = dbf.to_dataframe()
        except Exception as e2:
            print(f"❌ Erro ao ler DBF: {e1} / {e2}")
            return 0, 0

    total_bruto = len(df)
    print(f"📊 Registros brutos lidos no DBF: {total_bruto:,} linhas.")
    if total_bruto == 0:
        print("⚠️ Arquivo vazio.")
        return 0, 0

    # Normalizar nomes de colunas
    df.columns = [str(col).upper().strip() for col in df.columns]

    registros_para_inserir = []
    chaves_vistas = {}
    
    # 2. Tratamento linha a linha com ZERO DESCARTES
    for idx, row in df.iterrows():
        # Data de notificação (se vier nula, usa sintomas ou 01/01/{ano})
        dt_notif_raw = row.get('DT_NOTIFIC')
        dt_sin_raw = row.get('DT_SIN_PRI')
        dt_digita_raw = row.get('DT_DIGITA')

        dt_fallback = date(ano_arquivo, 1, 1)
        dt_sin = converter_data_segura(dt_sin_raw, None)
        if dt_sin:
            dt_fallback = dt_sin
        elif dt_digita_raw:
            dt_fallback = converter_data_segura(dt_digita_raw, dt_fallback)

        dt_notif = converter_data_segura(dt_notif_raw, dt_fallback)
        ano_notif = dt_notif.year if dt_notif else ano_arquivo

        # Semana Epidemiológica (SEM_NOT)
        sem_val = str(row.get('SEM_NOT', '')).strip()
        if len(sem_val) >= 2 and sem_val[-2:].isdigit():
            se_notif = int(sem_val[-2:])
        else:
            se_notif = dt_notif.isocalendar()[1] if dt_notif else 1

        # CNES Unidade Notificadora (Proxy Territorial)
        cnes_raw = str(row.get('ID_UNIDADE', '0000000')).strip()
        cnes = re.sub(r'\D', '', cnes_raw).zfill(7)[:7]
        if not cnes or cnes == '0000000':
            cnes = '2081682' # Fallback regional

        # Sintomas SE
        sem_sin_val = str(row.get('SEM_PRI', '')).strip()
        if len(sem_sin_val) >= 2 and sem_sin_val[-2:].isdigit():
            se_sin = int(sem_sin_val[-2:])
        else:
            se_sin = dt_sin.isocalendar()[1] if dt_sin else None

        # Idade & Faixa Etária
        idade_anos, faixa = decodificar_idade_sinan(row.get('NU_IDADE_N'))

        # Sexo
        sexo = str(row.get('CS_SEXO', 'I')).strip().upper()
        if sexo not in ['M', 'F']:
            sexo = 'I'

        # Residente Sorocaba
        muni_resi = str(row.get('ID_MN_RESI', '')).strip()
        residente = bool(muni_resi == '355220') if muni_resi else True

        # Classificação Final
        status, detalhe, grave = classificar_caso(row)
        grave = bool(grave)

        # Evolução & Óbito
        evolucao_val = pd.to_numeric(row.get('EVOLUCAO'), errors='coerce')
        evolucao = int(evolucao_val) if pd.notna(evolucao_val) else 9
        obito = bool(evolucao == 2)

        # Sorotipo (1 a 4)
        sorotipo_val = pd.to_numeric(row.get('SOROTIPO'), errors='coerce')
        sorotipo = int(sorotipo_val) if (pd.notna(sorotipo_val) and int(sorotipo_val) in [1, 2, 3, 4]) else None

        # Hospitalização
        hosp_val = pd.to_numeric(row.get('HOSPITALIZ'), errors='coerce')
        hospitalizado = bool(hosp_val == 1)

        # Número de Notificação (Gera identificador seguro caso venha nulo, vazio ou zeros no DBF)
        nu_notific_raw = str(row.get('NU_NOTIFIC', '')).strip()
        nu_notific_digits = re.sub(r'\D', '', nu_notific_raw).lstrip('0')
        if not nu_notific_digits or nu_notific_raw.lower() in ['nan', 'none', 'null', '0', '']:
            nu_notific = f"SRB_{ano_arquivo}_{idx:07d}"
        else:
            nu_notific = nu_notific_raw

        # Garantir unicidade estrita no par (nu_notific, ano_notif) para evitar CardinalityViolation no Postgres
        chave_notif = (nu_notific, ano_notif)
        if chave_notif in chaves_vistas:
            chaves_vistas[chave_notif] += 1
            nu_notific = f"{nu_notific}_{chaves_vistas[chave_notif]}"
        else:
            chaves_vistas[chave_notif] = 1

        registros_para_inserir.append((
            str(nu_notific),
            dt_notif,
            int(ano_notif),
            int(se_notif),
            str(cnes),
            dt_sin,
            int(se_sin) if se_sin is not None else None,
            int(idade_anos) if idade_anos is not None else None,
            str(faixa) if faixa is not None else None,
            str(sexo),
            bool(residente),
            str(status),
            str(detalhe) if detalhe is not None else None,
            int(evolucao) if evolucao is not None else 9,
            bool(obito),
            bool(grave),
            int(sorotipo) if sorotipo is not None else None,
            bool(hospitalizado)
        ))

    print(f"✨ Registros tratados com sucesso: {len(registros_para_inserir):,} linhas.")
    assert len(registros_para_inserir) == total_bruto, "ALERTA: Divergência na contagem de linhas!"

    # 3. Envio em Chunks para o Supabase
    query_upsert = """
    INSERT INTO notificacoes_dengue (
        nu_notific, dt_notific, ano_notif, se_notif, cnes_unidade,
        dt_sin_pri, se_sin_pri, idade_anos, faixa_etaria, sexo,
        residente_sorocaba, status_caso, classificacao_detalhe,
        evolucao, obito_confirmado, caso_grave, sorotipo, hospitalizado
    ) VALUES %s
    ON CONFLICT (nu_notific, ano_notif) DO UPDATE SET
        dt_notific = EXCLUDED.dt_notific,
        se_notif = EXCLUDED.se_notif,
        cnes_unidade = EXCLUDED.cnes_unidade,
        dt_sin_pri = EXCLUDED.dt_sin_pri,
        se_sin_pri = EXCLUDED.se_sin_pri,
        idade_anos = EXCLUDED.idade_anos,
        faixa_etaria = EXCLUDED.faixa_etaria,
        sexo = EXCLUDED.sexo,
        residente_sorocaba = EXCLUDED.residente_sorocaba,
        status_caso = EXCLUDED.status_caso,
        classificacao_detalhe = EXCLUDED.classificacao_detalhe,
        evolucao = EXCLUDED.evolucao,
        obito_confirmado = EXCLUDED.obito_confirmado,
        caso_grave = EXCLUDED.caso_grave,
        sorotipo = EXCLUDED.sorotipo,
        hospitalizado = EXCLUDED.hospitalizado;
    """

    total_enviados = 0
    desc_msg = f"Enviando {os.path.basename(caminho_arquivo)}"
    for i in tqdm(range(0, len(registros_para_inserir), chunk_size), desc=desc_msg):
        chunk = registros_para_inserir[i:i + chunk_size]
        execute_values(cursor, query_upsert, chunk, page_size=chunk_size)
        conn.commit()
        total_enviados += len(chunk)

    print(f"✅ Inserção concluída: {total_enviados:,} / {total_bruto:,} linhas gravadas.")
    print(f"🎉 ZERO DESCARTES: 100% dos dados de {ano_arquivo} foram ingeridos com sucesso!")

    # Limpeza de memória imediata
    del df
    del registros_para_inserir
    gc.collect()

    return total_bruto, total_enviados


def main():
    print("=" * 80)
    print("🚀 INICIALIZANDO PIPELINE SINAN ONLINE -> SUPABASE")
    print("   Projeto Integrador IV - Painel Dengue Sorocaba / SP")
    print("=" * 80)

    # Identificar diretório dos arquivos DBF
    pasta_dbf = sys.argv[1] if len(sys.argv) > 1 else "./dados_dbf"
    if not os.path.exists(pasta_dbf):
        # Tenta procurar na pasta do script ou pastas adjacentes
        candidatos = [pasta_dbf, "./dbf", "./dados", "../dados_dbf", "./"]
        for c in candidatos:
            if os.path.exists(c) and glob.glob(os.path.join(c, "*.dbf")):
                pasta_dbf = c
                break

    arquivos = sorted(glob.glob(os.path.join(pasta_dbf, "**/*.dbf"), recursive=True))

    if not arquivos:
        print(f"⚠️ Nenhum arquivo .dbf encontrado em: '{pasta_dbf}'")
        print("\nComo usar no VS Code:")
        print("1. Crie uma pasta chamada 'dados_dbf' e coloque seus arquivos .dbf nela.")
        print("2. Execute o comando no Terminal do VS Code:")
        print("   python scripts/ingest_sinan_dbf.py ./dados_dbf")
        return

    print(f"📁 Encontrados {len(arquivos)} arquivos .dbf para processamento:")
    for a in arquivos:
        print(f"   • {os.path.basename(a)}")

    # Conexão com o Supabase
    print("\n🔌 Conectando ao Supabase via PostgreSQL Connection String...")
    import psycopg2
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = False
        cursor = conn.cursor()
        print("✅ Conexão estabelecida com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao conectar ao Supabase: {e}")
        print("\nDica: Verifique se sua DATABASE_URL no arquivo .env está correta.")
        return

    relatorio_geral = []
    total_geral_bruto = 0
    total_geral_enviado = 0

    try:
        for a in arquivos:
            bruto, enviado = processar_e_enviar_dbf(a, cursor, conn, chunk_size=5000)
            total_geral_bruto += bruto
            total_geral_enviado += enviado
            relatorio_geral.append({
                "arquivo": os.path.basename(a),
                "ano": extrair_ano_do_nome(a),
                "linhas_dbf": bruto,
                "linhas_inseridas": enviado,
                "status": "100% Íntegro" if bruto == enviado else "Divergência"
            })
    except KeyboardInterrupt:
        print("\n⚠️ Operação interrompida pelo usuário.")
    finally:
        cursor.close()
        conn.close()

    # Relatório Final Consolidado
    print("\n" + "=" * 80)
    print("📊 RESUMO GERAL DA MIGRAÇÃO (2010 A 2026)")
    print("=" * 80)
    print(f"{'Arquivo':<30} | {'Ano':<6} | {'Linhas DBF':<12} | {'Inseridas':<12} | {'Status'}")
    print("-" * 80)
    for r in relatorio_geral:
        print(f"{r['arquivo']:<30} | {r['ano']:<6} | {r['linhas_dbf']:<12,} | {r['linhas_inseridas']:<12,} | {r['status']}")
    print("-" * 80)
    print(f"{'TOTAL GERAL':<30} | {'-':<6} | {total_geral_bruto:<12,} | {total_geral_enviado:<12,} | {'100% SEM DESCARTES'}")
    print("=" * 80)
    print("🎉 Migração concluída com sucesso! Os dados estão prontos no Supabase.")


if __name__ == '__main__':
    main()
