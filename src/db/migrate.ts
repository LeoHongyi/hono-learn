import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb } from "./index.js";

async function main() {
  console.log("Running migrations...");
  const db = await getDb();
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
