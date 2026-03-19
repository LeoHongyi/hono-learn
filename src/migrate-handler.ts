import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// @ts-ignore - pg default export works at runtime with ESM banner
const { Pool } = pg;

async function getConnectionString() {
  const secretArn = process.env.DB_SECRET_ARN!;
  const client = new SecretsManagerClient({});
  const resp = await client.send(
    new GetSecretValueCommand({ SecretId: secretArn })
  );
  const secret = JSON.parse(resp.SecretString!);
  return `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}`;
}

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
  // For Delete requests, just succeed
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
      ssl: false,
    });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./drizzle" });
    await pool.end();
    console.log("Migration complete");
    await sendResponse(event, "SUCCESS");
  } catch (err: any) {
    console.error("Migration failed:", err);
    await sendResponse(event, "FAILED", `Failed ${err.query || 'migration'}: ${err.message}`);
  }
}
