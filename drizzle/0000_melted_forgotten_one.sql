CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_1_player_1_id" uuid NOT NULL,
	"team_1_player_2_id" uuid NOT NULL,
	"team_2_player_1_id" uuid NOT NULL,
	"team_2_player_2_id" uuid NOT NULL,
	"team_1_score" integer NOT NULL,
	"team_2_score" integer NOT NULL,
	"team_1_elo_change" integer NOT NULL,
	"team_2_elo_change" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "valid_foosball_score" CHECK ((
        ("games"."team_1_score" = 10 AND "games"."team_2_score" >= 0 AND "games"."team_2_score" <= 9)
        OR ("games"."team_2_score" = 10 AND "games"."team_1_score" >= 0 AND "games"."team_1_score" <= 9)
      ))
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"elo" integer DEFAULT 1200 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_team_1_player_1_id_players_id_fk" FOREIGN KEY ("team_1_player_1_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_team_1_player_2_id_players_id_fk" FOREIGN KEY ("team_1_player_2_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_team_2_player_1_id_players_id_fk" FOREIGN KEY ("team_2_player_1_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_team_2_player_2_id_players_id_fk" FOREIGN KEY ("team_2_player_2_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;