#!/usr/bin/env node
/**
 * db:migrate — Aplica todas as migrações SQL em migrations/*.sql ao Neon/Postgres.
 * Uso: npm run db:migrate
 * Requer: DATABASE_URL no ambiente.
 */
import fs from "fs";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌  DATABASE_URL não definido. Configure a variável de ambiente e tente novamente.");
  process.exit(1);
}

const requireSsl =
  databaseUrl.includes("neon.tech") || databaseUrl.includes("sslmode=require");

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: requireSsl ? { rejectUnauthorized: false } : false,
});

const migrationsDir = path.join(__dirname, "..", "migrations");

async function run() {
  await client.connect();
  console.log("🔌  Conectado ao banco de dados.");

  // Cria tabela de controle de migrações se ainda não existir
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  const { rows: applied } = await client.query("SELECT filename FROM _migrations");
  const appliedSet = new Set(applied.map((r) => r.filename));

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`⏭️   ${file} — já aplicada, pulando.`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`▶️   Aplicando ${file}…`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`✅  ${file} aplicada com sucesso.`);
      count++;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`❌  Erro ao aplicar ${file}:`, err.message);
      await client.end();
      process.exit(1);
    }
  }

  if (count === 0) {
    console.log("✔️   Nenhuma migração nova para aplicar.");
  } else {
    console.log(`\n🎉  ${count} migração(ões) aplicada(s) com sucesso!`);
  }

  await client.end();
}

run().catch((err) => {
  console.error("❌  Falha na migração:", err.message);
  process.exit(1);
});
