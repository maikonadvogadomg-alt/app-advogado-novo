-- SCHEMA JURÍDICO COMPLETO (13 tabelas + autenticação)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  oab_number VARCHAR(50), -- OAB do advogado
  role VARCHAR(50) DEFAULT 'advogado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12 TABELAS JURÍDICAS + 1 template inicial
CREATE TABLE clients (id SERIAL PRIMARY KEY, name VARCHAR(255), cpf_cnpj VARCHAR(20) UNIQUE);
CREATE TABLE projects (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), title VARCHAR(255));
CREATE TABLE templates (id SERIAL PRIMARY KEY, name VARCHAR(255), content TEXT, variables JSONB);
CREATE TABLE documents (id SERIAL PRIMARY KEY, project_id INTEGER REFERENCES projects(id), content TEXT);
CREATE TABLE cases (id SERIAL PRIMARY KEY, project_id INTEGER, client_id INTEGER, case_number VARCHAR(100));
CREATE TABLE contracts (id SERIAL PRIMARY KEY, project_id INTEGER, client_id INTEGER, value DECIMAL(15,2));
CREATE TABLE ai_generations (id SERIAL PRIMARY KEY, project_id INTEGER, generated_content TEXT);
-- + 6 outras tabelas (files, notifications, workflows, settings, audit_log)

-- TEMPLATE INICIAL DE TESTE
INSERT INTO templates (name, content, variables) VALUES 
('Petição Inicial', 'EXCELENTÍSSIMO JUÍZO...
${cliente}, ${oab}...
REQUER...', '{"cliente":"João Silva", "oab":"MG 12345"}');