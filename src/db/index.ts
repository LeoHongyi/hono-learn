import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import * as schema from "./schema.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

async function getConnectionString(): Promise<string> {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const secretArn = process.env.DB_SECRET_ARN;
  if (!secretArn) {
    throw new Error("DATABASE_URL or DB_SECRET_ARN required");
  }

  const client = new SecretsManagerClient({});
  const resp = await client.send(
    new GetSecretValueCommand({ SecretId: secretArn })
  );
  const secret = JSON.parse(resp.SecretString!);

  return `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}`;
}

export async function getDb() {
  if (!pool) {
    const connectionString = await getConnectionString();
    pool = new Pool({ connectionString, max: 5 });
  }
  return drizzle(pool, { schema });
}
