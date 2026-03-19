import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// @ts-ignore - pg default export works at runtime with ESM banner
const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function sendResponse(event: any, status: string, reason?: string) {
  const body = JSON.stringify({
    Status: status,
    Reason: reason || "OK",
    PhysicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
  });
  await fetch(event.ResponseURL, {
    method: "PUT",
    body,
    headers: { "Content-Type": "" },
  });
}

export async function handler(event: any) {
  if (event.RequestType === "Delete") {
    await sendResponse(event, "SUCCESS");
    return;
  }

  try {
    const secretArn = process.env.DB_SECRET_ARN!;
    const smClient = new SecretsManagerClient({});
    const resp = await smClient.send(
      new GetSecretValueCommand({ SecretId: secretArn })
    );
    const secret = JSON.parse(resp.SecretString!);
    console.log("Connecting to DB at", secret.host, secret.port, secret.dbname);

    const pool = new Pool({
      host: secret.host,
      port: Number(secret.port),
      user: secret.username,
      password: secret.password,
      database: secret.dbname,
      max: 1,
      ssl: { rejectUnauthorized: false },
    });

    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL UNIQUE,
        created_at BIGINT
      )
    `);

    // Read and execute SQL migration files in order
    const migrationsDir = join(__dirname, "drizzle");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const hash = file.replace(".sql", "");
      const { rowCount } = await pool.query(
        `SELECT 1 FROM "__drizzle_migrations" WHERE hash = $1`,
        [hash]
      );
      if (rowCount && rowCount > 0) {
        console.log(`Skipping already applied: ${file}`);
        continue;
      }

      const sql = readFileSync(join(migrationsDir, file), "utf-8");
      console.log(`Applying migration: ${file}`);
      await pool.query(sql);
      await pool.query(
        `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
        [hash, Date.now()]
      );
      console.log(`Applied: ${file}`);
    }

    await pool.end();
    console.log("Migration complete");
    await sendResponse(event, "SUCCESS");
  } catch (err: any) {
    console.error("Migration failed:", err);
    await sendResponse(event, "FAILED", `Migration error: ${err.message}`);
  }
}
