export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlayerProfile } from '@/components/player-profile';
import { getPlayerById, getPlayerGames, getPlayerProfile } from '@/lib/queries';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) {
    return { title: 'Player not found' };
  }
  return {
    title: `${player.name} · Moosball League`,
    description: `Stats and match history for ${player.name}`,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const [player, games] = await Promise.all([
    getPlayerProfile(id),
    getPlayerGames(id),
  ]);

  if (!player) {
    notFound();
  }

  return <PlayerProfile player={player} games={games} />;
}
