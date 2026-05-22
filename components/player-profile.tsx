import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { EditablePlayerName } from '@/components/editable-player-name';
import { MatchHistory } from '@/components/match-history';
import type { PlayerProfile, RecentGameEntry } from '@/lib/queries';

type PlayerProfileProps = {
  player: PlayerProfile;
  games: RecentGameEntry[];
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-background/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function formatWinRate(wins: number, losses: number) {
  const total = wins + losses;
  if (total === 0) return '—';
  return `${Math.round((wins / total) * 100)}%`;
}

export function PlayerProfile({ player, games }: PlayerProfileProps) {
  const memberSince = player.createdAt.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to league
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-2.5 text-3xl font-semibold tracking-tight">
              <Image
                src="/images/emojis/holding-ball.png"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0"
                aria-hidden
              />
              <EditablePlayerName playerId={player.id} name={player.name} />
            </h1>
            <p className="text-muted-foreground">
              Rank #{player.rank} · {player.elo} ELO
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Record"
            value={`${player.wins}-${player.losses}`}
            hint={`${player.gamesPlayed} matches played`}
          />
          <StatCard
            label="Win rate"
            value={formatWinRate(player.wins, player.losses)}
            hint="Across all 2v2 matches"
          />
          <StatCard label="ELO" value={String(player.elo)} />
          <StatCard label="Member since" value={memberSince} />
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <MatchHistory
            games={games}
            title="Matches"
            description="Games this player has played"
            emptyMessage="No matches yet for this player."
          />
        </section>
      </div>
    </main>
  );
}
