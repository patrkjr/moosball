import { RecordMatchDialog } from '@/components/record-match-dialog';
import { MatchHistory } from '@/components/match-history';
import type { PlayerOption } from '@/components/player-autocomplete';
import type { RecentGameEntry } from '@/lib/queries';

type MatchPanelProps = {
  players: PlayerOption[];
  games: RecentGameEntry[];
};

export function MatchPanel({ players, games }: MatchPanelProps) {
  return (
    <section className="flex h-full flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Log a new 2v2 match and update ELO
          </p>
        </div>
        <RecordMatchDialog players={players} />
      </div>
      <MatchHistory games={games} />
    </section>
  );
}
