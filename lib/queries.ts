import { alias } from 'drizzle-orm/pg-core';
import { desc, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { games, players } from '@/lib/db/schema';

export type LeaderboardEntry = {
  id: string;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  rank: number;
};

export type RecentGameEntry = {
  id: string;
  createdAt: Date;
  team1Score: number;
  team2Score: number;
  team1EloChange: number;
  team2EloChange: number;
  team1Player1Name: string;
  team1Player2Name: string;
  team2Player1Name: string;
  team2Player2Name: string;
};

const team1Player1 = alias(players, 'team1_player1');
const team1Player2 = alias(players, 'team1_player2');
const team2Player1 = alias(players, 'team2_player1');
const team2Player2 = alias(players, 'team2_player2');

export async function getAllPlayers() {
  return db.select().from(players).orderBy(players.name);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const rows = await db
    .select({
      id: players.id,
      name: players.name,
      elo: players.elo,
      wins: sql<number>`coalesce(sum(
        case
          when (${games.team1Player1Id} = ${players.id} or ${games.team1Player2Id} = ${players.id})
            and ${games.team1Score} = 10 then 1
          when (${games.team2Player1Id} = ${players.id} or ${games.team2Player2Id} = ${players.id})
            and ${games.team2Score} = 10 then 1
          else 0
        end
      ), 0)::int`.as('wins'),
      losses: sql<number>`coalesce(sum(
        case
          when (${games.team1Player1Id} = ${players.id} or ${games.team1Player2Id} = ${players.id})
            and ${games.team2Score} = 10 then 1
          when (${games.team2Player1Id} = ${players.id} or ${games.team2Player2Id} = ${players.id})
            and ${games.team1Score} = 10 then 1
          else 0
        end
      ), 0)::int`.as('losses'),
    })
    .from(players)
    .leftJoin(
      games,
      sql`${games.team1Player1Id} = ${players.id}
        or ${games.team1Player2Id} = ${players.id}
        or ${games.team2Player1Id} = ${players.id}
        or ${games.team2Player2Id} = ${players.id}`,
    )
    .groupBy(players.id, players.name, players.elo)
    .orderBy(desc(players.elo), players.name);

  return rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}

export async function getRecentGames(limit = 10): Promise<RecentGameEntry[]> {
  return db
    .select({
      id: games.id,
      createdAt: games.createdAt,
      team1Score: games.team1Score,
      team2Score: games.team2Score,
      team1EloChange: games.team1EloChange,
      team2EloChange: games.team2EloChange,
      team1Player1Name: team1Player1.name,
      team1Player2Name: team1Player2.name,
      team2Player1Name: team2Player1.name,
      team2Player2Name: team2Player2.name,
    })
    .from(games)
    .innerJoin(
      team1Player1,
      eq(games.team1Player1Id, team1Player1.id),
    )
    .innerJoin(
      team1Player2,
      eq(games.team1Player2Id, team1Player2.id),
    )
    .innerJoin(
      team2Player1,
      eq(games.team2Player1Id, team2Player1.id),
    )
    .innerJoin(
      team2Player2,
      eq(games.team2Player2Id, team2Player2.id),
    )
    .orderBy(desc(games.createdAt))
    .limit(limit);
}
