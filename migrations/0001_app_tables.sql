-- ============================================================
-- Migração 0001: tabelas principais do app (Drizzle schema)
-- Aplique com: npm run db:migrate
-- ============================================================

-- Usuários
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Snippets de código
CREATE TABLE IF NOT EXISTS snippets (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled',
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'html'
);

-- Ações customizadas de IA
CREATE TABLE IF NOT EXISTS custom_actions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  prompt TEXT NOT NULL
);

-- Ementas jurídicas
CREATE TABLE IF NOT EXISTS ementas (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  texto TEXT NOT NULL
);

-- Histórico de IA
CREATE TABLE IF NOT EXISTS ai_history (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  input_preview TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Templates de prompt
CREATE TABLE IF NOT EXISTS prompt_templates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  texto TEXT NOT NULL
);

-- Templates de documentos
CREATE TABLE IF NOT EXISTS doc_templates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Geral',
  conteudo TEXT NOT NULL,
  docx_base64 TEXT,
  docx_filename TEXT
);

-- Pareceres compartilhados
CREATE TABLE IF NOT EXISTS shared_pareceres (
  id VARCHAR PRIMARY KEY,
  html TEXT NOT NULL,
  processo TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Processos monitorados
CREATE TABLE IF NOT EXISTS processos_monitorados (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  tribunal TEXT NOT NULL,
  apelido TEXT NOT NULL DEFAULT '',
  classe TEXT NOT NULL DEFAULT '',
  orgao_julgador TEXT NOT NULL DEFAULT '',
  data_ajuizamento TEXT NOT NULL DEFAULT '',
  ultima_movimentacao TEXT NOT NULL DEFAULT '',
  ultima_movimentacao_data TEXT NOT NULL DEFAULT '',
  assuntos TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Configurações do app (chaves de API, tokens, etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Publicações de tramitação inteligente
CREATE TABLE IF NOT EXISTS tramitacao_publicacoes (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT,
  numero_processo TEXT NOT NULL DEFAULT '',
  numero_processo_mascara TEXT NOT NULL DEFAULT '',
  tribunal TEXT NOT NULL DEFAULT '',
  orgao TEXT NOT NULL DEFAULT '',
  classe TEXT NOT NULL DEFAULT '',
  texto TEXT NOT NULL DEFAULT '',
  disponibilizacao_date TEXT NOT NULL DEFAULT '',
  publicacao_date TEXT NOT NULL DEFAULT '',
  inicio_prazo_date TEXT NOT NULL DEFAULT '',
  link_tramitacao TEXT NOT NULL DEFAULT '',
  link_tribunal TEXT NOT NULL DEFAULT '',
  destinatarios TEXT NOT NULL DEFAULT '[]',
  advogados TEXT NOT NULL DEFAULT '[]',
  lida TEXT NOT NULL DEFAULT 'nao',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Arquivos armazenados (PEM, chaves, configs pequenas)
CREATE TABLE IF NOT EXISTS stored_files (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mime TEXT NOT NULL DEFAULT 'application/octet-stream',
  size_bytes TEXT NOT NULL DEFAULT '0',
  content_text TEXT,
  content_base64 TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  setting_key TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Log de execuções do Robô Jurídico
CREATE TABLE IF NOT EXISTS robo_runs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP DEFAULT NOW() NOT NULL,
  finished_at TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending',
  output TEXT,
  error TEXT
);
