export const dynamic = 'force-dynamic';

import { Leaderboard } from '@/components/leaderboard';
import { MatchPanel } from '@/components/match-panel';
import {
  getAllPlayers,
  getLeaderboard,
  getRecentGames,
} from '@/lib/queries';

export default async function Page() {
  const [leaderboard, allPlayers, recentGames] = await Promise.all([
    getLeaderboard(),
    getAllPlayers(),
    getRecentGames(10),
  ]);

  const playerOptions = allPlayers.map((player) => ({
    id: player.id,
    name: player.name,
  }));

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Moosball League
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            2v2 table football tracker with team-average ELO rankings and match
            history.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Leaderboard entries={leaderboard} />
          <MatchPanel players={playerOptions} games={recentGames} />
        </div>
      </div>
    </main>
  );
}
