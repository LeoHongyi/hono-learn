import { build } from "esbuild";
import { cpSync } from "fs";

const shared = {
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  target: "node20",
  format: "esm",
  external: ["@aws-sdk/*"],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
};

await Promise.all([
  build({
    ...shared,
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.mjs",
  }),
  build({
    ...shared,
    entryPoints: ["src/migrate-handler.ts"],
    outfile: "dist/migrate/index.mjs",
  }),
]);

// Copy drizzle migration files for the migrate Lambda
cpSync("drizzle", "dist/migrate/drizzle", { recursive: true });

console.log("Build complete: dist/index.mjs, dist/migrate/index.mjs");
