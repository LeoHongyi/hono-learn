import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { githubUsers } from "../db/schema.js";

const api = new Hono();

// Catch all errors and return JSON
api.onError((err, c) => {
  console.error("API error:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// POST /api/github-users — fetch GitHub user by token and store
api.post("/github-users", async (c) => {
  const { token } = await c.req.json<{ token: string }>();
  if (!token) {
    return c.json({ error: "token is required" }, 400);
  }

  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "hono-learn",
    },
  });

  if (!resp.ok) {
    const msg = await resp.text();
    return c.json({ error: `GitHub API error: ${resp.status}`, detail: msg }, 400);
  }

  const gh = await resp.json() as Record<string, unknown>;
  const db = await getDb();

  const existing = await db.query.githubUsers.findFirst({
    where: eq(githubUsers.githubId, gh.id as number),
  });

  if (existing) {
    const [updated] = await db
      .update(githubUsers)
      .set({
        login: gh.login as string,
        name: (gh.name as string) ?? null,
        avatarUrl: (gh.avatar_url as string) ?? null,
        bio: (gh.bio as string) ?? null,
        publicRepos: (gh.public_repos as number) ?? 0,
        followers: (gh.followers as number) ?? 0,
        following: (gh.following as number) ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(githubUsers.githubId, gh.id as number))
      .returning();
    return c.json(updated);
  }

  const [inserted] = await db
    .insert(githubUsers)
    .values({
      githubId: gh.id as number,
      login: gh.login as string,
      name: (gh.name as string) ?? null,
      avatarUrl: (gh.avatar_url as string) ?? null,
      bio: (gh.bio as string) ?? null,
      publicRepos: (gh.public_repos as number) ?? 0,
      followers: (gh.followers as number) ?? 0,
      following: (gh.following as number) ?? 0,
    })
    .returning();

  return c.json(inserted, 201);
});

// GET /api/github-users — list all stored users
api.get("/github-users", async (c) => {
  const db = await getDb();
  const users = await db.select().from(githubUsers);
  return c.json(users);
});

// DELETE /api/github-users/:id — delete a user
api.delete("/github-users/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "invalid id" }, 400);
  }

  const db = await getDb();
  const [deleted] = await db
    .delete(githubUsers)
    .where(eq(githubUsers.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "not found" }, 404);
  }

  return c.json({ ok: true });
});

export default api;
