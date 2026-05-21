import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  elo: integer('elo').notNull().default(1200),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const games = pgTable(
  'games',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    team1Player1Id: uuid('team_1_player_1_id')
      .notNull()
      .references(() => players.id),
    team1Player2Id: uuid('team_1_player_2_id')
      .notNull()
      .references(() => players.id),
    team2Player1Id: uuid('team_2_player_1_id')
      .notNull()
      .references(() => players.id),
    team2Player2Id: uuid('team_2_player_2_id')
      .notNull()
      .references(() => players.id),
    team1Score: integer('team_1_score').notNull(),
    team2Score: integer('team_2_score').notNull(),
    team1EloChange: integer('team_1_elo_change').notNull(),
    team2EloChange: integer('team_2_elo_change').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'valid_foosball_score',
      sql`(
        (${table.team1Score} = 10 AND ${table.team2Score} >= 0 AND ${table.team2Score} <= 9)
        OR (${table.team2Score} = 10 AND ${table.team1Score} >= 0 AND ${table.team1Score} <= 9)
      )`,
    ),
  ],
);

export type Player = typeof players.$inferSelect;
export type Game = typeof games.$inferSelect;
