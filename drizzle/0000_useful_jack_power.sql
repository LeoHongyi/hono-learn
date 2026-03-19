CREATE TABLE "github_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" integer NOT NULL,
	"login" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar_url" text,
	"bio" text,
	"public_repos" integer DEFAULT 0,
	"followers" integer DEFAULT 0,
	"following" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "github_users_github_id_unique" UNIQUE("github_id")
);
