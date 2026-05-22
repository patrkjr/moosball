'use server';

import { revalidatePath } from 'next/cache';
import { eq, inArray } from 'drizzle-orm';

import { db } from '@/lib/db';
import { games, players } from '@/lib/db/schema';
import { calculateMatchElo } from '@/lib/elo';
import {
  playerNameSchema,
  recordMatchSchema,
  updatePlayerNameSchema,
} from '@/lib/validations';

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string };

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  if ('code' in error && (error as { code: string }).code === '23505') {
    return true;
  }
  if ('cause' in error) {
    return isUniqueViolation((error as { cause: unknown }).cause);
  }
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('duplicate');
  }
  return false;
}

export async function addPlayer(name: string): Promise<ActionResult> {
  const parsed = playerNameSchema.safeParse(name);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid name.' };
  }

  try {
    const [created] = await db
      .insert(players)
      .values({ name: parsed.data })
      .returning({ id: players.id });
    revalidatePath('/');
    if (created) {
      revalidatePath(`/players/${created.id}`);
    }
    return { ok: true };
  } catch (error) {
    const message = isUniqueViolation(error)
      ? 'A player with this name already exists.'
      : 'Could not add player. Please try again.';
    return { ok: false, message };
  }
}

export async function updatePlayerName(
  playerId: string,
  name: string,
): Promise<ActionResult> {
  const parsed = updatePlayerNameSchema.safeParse({ playerId, name });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid name.',
    };
  }

  const { playerId: id, name: nextName } = parsed.data;

  try {
    const updated = await db
      .update(players)
      .set({ name: nextName })
      .where(eq(players.id, id))
      .returning({ id: players.id, name: players.name });

    if (updated.length === 0) {
      return { ok: false, message: 'Player not found.' };
    }

    revalidatePath('/');
    revalidatePath(`/players/${id}`);
    return { ok: true };
  } catch (error) {
    const message = isUniqueViolation(error)
      ? 'A player with this name already exists.'
      : 'Could not update name. Please try again.';
    return { ok: false, message };
  }
}

export async function recordMatch(
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    team1Player1Id: formData.get('team1Player1Id'),
    team1Player2Id: formData.get('team1Player2Id'),
    team2Player1Id: formData.get('team2Player1Id'),
    team2Player2Id: formData.get('team2Player2Id'),
    team1Score: formData.get('team1Score'),
    team2Score: formData.get('team2Score'),
  };

  const parsed = recordMatchSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid match data.',
    };
  }

  const data = parsed.data;
  const playerIds = [
    data.team1Player1Id,
    data.team1Player2Id,
    data.team2Player1Id,
    data.team2Player2Id,
  ];

  try {
    await db.transaction(async (tx) => {
      const foundPlayers = await tx
        .select()
        .from(players)
        .where(inArray(players.id, playerIds));

      if (foundPlayers.length !== 4) {
        throw new Error('One or more selected players were not found.');
      }

      const playerById = new Map(
        foundPlayers.map((player) => [player.id, player]),
      );

      const t1p1 = playerById.get(data.team1Player1Id)!;
      const t1p2 = playerById.get(data.team1Player2Id)!;
      const t2p1 = playerById.get(data.team2Player1Id)!;
      const t2p2 = playerById.get(data.team2Player2Id)!;

      const team1Won = data.team1Score === 10;
      const { team1Delta, team2Delta } = calculateMatchElo({
        team1Player1Elo: t1p1.elo,
        team1Player2Elo: t1p2.elo,
        team2Player1Elo: t2p1.elo,
        team2Player2Elo: t2p2.elo,
        team1Won,
      });

      await tx
        .update(players)
        .set({ elo: t1p1.elo + team1Delta })
        .where(eq(players.id, t1p1.id));
      await tx
        .update(players)
        .set({ elo: t1p2.elo + team1Delta })
        .where(eq(players.id, t1p2.id));
      await tx
        .update(players)
        .set({ elo: t2p1.elo + team2Delta })
        .where(eq(players.id, t2p1.id));
      await tx
        .update(players)
        .set({ elo: t2p2.elo + team2Delta })
        .where(eq(players.id, t2p2.id));

      await tx.insert(games).values({
        team1Player1Id: data.team1Player1Id,
        team1Player2Id: data.team1Player2Id,
        team2Player1Id: data.team2Player1Id,
        team2Player2Id: data.team2Player2Id,
        team1Score: data.team1Score,
        team2Score: data.team2Score,
        team1EloChange: team1Delta,
        team2EloChange: team2Delta,
      });
    });

    revalidatePath('/');
    for (const playerId of playerIds) {
      revalidatePath(`/players/${playerId}`);
    }
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Could not record match. Please try again.';
    return { ok: false, message };
  }
}
