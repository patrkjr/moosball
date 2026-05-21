import { AddPlayerDialog } from '@/components/add-player-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LeaderboardEntry } from '@/lib/queries';

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Ranked by current ELO rating
          </p>
        </div>
        <AddPlayerDialog />
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No players yet. Add your first player to get started.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">ELO</TableHead>
              <TableHead className="text-right">W-L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.elo}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.wins}-{entry.losses}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
