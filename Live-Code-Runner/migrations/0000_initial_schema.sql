-- Migration gerada automaticamente pelo Drizzle Kit
-- Tabelas definidas em: shared/schema.ts

-- ─────────────────────────────────────────────
-- Tabela: users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "users" (
  "id"       varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" text NOT NULL UNIQUE,
  "password" text NOT NULL
);

-- ─────────────────────────────────────────────
-- Tabela: snippets
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "snippets" (
  "id"    varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text    NOT NULL DEFAULT 'Untitled',
  "html"  text    NOT NULL DEFAULT '',
  "css"   text    NOT NULL DEFAULT '',
  "js"    text    NOT NULL DEFAULT '',
  "mode"  text    NOT NULL DEFAULT 'html'
);

-- ─────────────────────────────────────────────
-- Tabela: custom_actions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "custom_actions" (
  "id"          varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "label"       text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "prompt"      text NOT NULL
);

-- ─────────────────────────────────────────────
-- Tabela: ementas
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ementas" (
  "id"        varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "titulo"    text NOT NULL,
  "categoria" text NOT NULL DEFAULT 'Geral',
  "texto"     text NOT NULL
);

-- ─────────────────────────────────────────────
-- Tabela: ai_history
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ai_history" (
  "id"            varchar   PRIMARY KEY DEFAULT gen_random_uuid(),
  "action"        text      NOT NULL,
  "input_preview" text      NOT NULL DEFAULT '',
  "result"        text      NOT NULL,
  "created_at"    timestamp NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: prompt_templates
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "prompt_templates" (
  "id"        varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "titulo"    text NOT NULL,
  "categoria" text NOT NULL DEFAULT 'Geral',
  "texto"     text NOT NULL
);

-- ─────────────────────────────────────────────
-- Tabela: doc_templates
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "doc_templates" (
  "id"             varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "titulo"         text NOT NULL,
  "categoria"      text NOT NULL DEFAULT 'Geral',
  "conteudo"       text NOT NULL,
  "docx_base64"    text,
  "docx_filename"  text
);

-- ─────────────────────────────────────────────
-- Tabela: shared_pareceres
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "shared_pareceres" (
  "id"         varchar   PRIMARY KEY,
  "html"       text      NOT NULL,
  "processo"   text      NOT NULL DEFAULT '',
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: processos_monitorados
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "processos_monitorados" (
  "id"                       varchar   PRIMARY KEY DEFAULT gen_random_uuid(),
  "numero"                   text      NOT NULL,
  "tribunal"                 text      NOT NULL,
  "apelido"                  text      NOT NULL DEFAULT '',
  "classe"                   text      NOT NULL DEFAULT '',
  "orgao_julgador"           text      NOT NULL DEFAULT '',
  "data_ajuizamento"         text      NOT NULL DEFAULT '',
  "ultima_movimentacao"      text      NOT NULL DEFAULT '',
  "ultima_movimentacao_data" text      NOT NULL DEFAULT '',
  "assuntos"                 text      NOT NULL DEFAULT '',
  "status"                   text      NOT NULL DEFAULT 'ativo',
  "created_at"               timestamp NOT NULL DEFAULT now(),
  "updated_at"               timestamp NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: app_settings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "app_settings" (
  "key"        text      PRIMARY KEY,
  "value"      text      NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Tabela: tramitacao_publicacoes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "tramitacao_publicacoes" (
  "id"                       varchar   PRIMARY KEY DEFAULT gen_random_uuid(),
  "ext_id"                   text      NOT NULL UNIQUE,
  "idempotency_key"          text,
  "numero_processo"          text      NOT NULL DEFAULT '',
  "numero_processo_mascara"  text      NOT NULL DEFAULT '',
  "tribunal"                 text      NOT NULL DEFAULT '',
  "orgao"                    text      NOT NULL DEFAULT '',
  "classe"                   text      NOT NULL DEFAULT '',
  "texto"                    text      NOT NULL DEFAULT '',
  "disponibilizacao_date"    text      NOT NULL DEFAULT '',
  "publicacao_date"          text      NOT NULL DEFAULT '',
  "inicio_prazo_date"        text      NOT NULL DEFAULT '',
  "link_tramitacao"          text      NOT NULL DEFAULT '',
  "link_tribunal"            text      NOT NULL DEFAULT '',
  "destinatarios"            text      NOT NULL DEFAULT '[]',
  "advogados"                text      NOT NULL DEFAULT '[]',
  "lida"                     text      NOT NULL DEFAULT 'nao',
  "created_at"               timestamp NOT NULL DEFAULT now()
);
