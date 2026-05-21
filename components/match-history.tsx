import type { RecentGameEntry } from '@/lib/queries';

type MatchHistoryProps = {
  games: RecentGameEntry[];
};

function formatDelta(delta: number) {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

function MatchHistoryItem({ game }: { game: RecentGameEntry }) {
  const team1Won = game.team1Score > game.team2Score;
  const team2Won = game.team2Score > game.team1Score;

  return (
    <li className="rounded-lg border bg-background/60 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 max-w-[38%] shrink flex-col items-start gap-0.5 text-left text-sm">
          <span className="truncate font-medium">{game.team1Player1Name}</span>
          <span className="truncate font-medium">{game.team1Player2Name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDelta(game.team1EloChange)} ELO
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <div
            className="flex items-baseline gap-2 tabular-nums"
            aria-label={`Score ${game.team1Score} to ${game.team2Score}`}
          >
            <span
              className={`text-4xl font-bold tracking-tight sm:text-5xl ${
                team2Won ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {game.team1Score}
            </span>
            <span className="text-3xl font-black text-muted-foreground sm:text-4xl">
              –
            </span>
            <span
              className={`text-4xl font-bold tracking-tight sm:text-5xl ${
                team1Won ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {game.team2Score}
            </span>
          </div>
          <time
            className="text-xs text-muted-foreground"
            dateTime={game.createdAt.toISOString()}
          >
            {game.createdAt.toLocaleString()}
          </time>
        </div>

        <div className="flex min-w-0 max-w-[38%] shrink flex-col items-end gap-0.5 text-right text-sm">
          <span className="truncate font-medium">{game.team2Player1Name}</span>
          <span className="truncate font-medium">{game.team2Player2Name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDelta(game.team2EloChange)} ELO
          </span>
        </div>
      </div>
    </li>
  );
}

export function MatchHistory({ games }: MatchHistoryProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold">Match History</h2>
        <p className="text-sm text-muted-foreground">Recent 2v2 results</p>
      </div>

      {games.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No matches recorded yet.
        </p>
      ) : (
        <ul className="flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1">
          {games.map((game) => (
            <MatchHistoryItem key={game.id} game={game} />
          ))}
        </ul>
      )}
    </section>
  );
}
