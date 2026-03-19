import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { serve } from "@hono/node-server";
import api from "./routes/api.js";
import pages from "./routes/pages.js";

const app = new Hono();

app.route("/", pages);
app.route("/api", api);

// Lambda handler
export const handler = handle(app);

// Local dev server
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const port = Number(process.env.PORT) || 3000;
  console.log(`Server running at http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
}
