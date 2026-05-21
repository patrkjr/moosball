import { z } from 'zod';

export const playerNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required.')
  .max(64, 'Name must be 64 characters or fewer.');

export const foosballScoreSchema = z
  .object({
    team1Score: z.coerce.number().int().min(0).max(10),
    team2Score: z.coerce.number().int().min(0).max(10),
  })
  .refine(
    (scores) =>
      (scores.team1Score === 10 &&
        scores.team2Score >= 0 &&
        scores.team2Score <= 9) ||
      (scores.team2Score === 10 &&
        scores.team1Score >= 0 &&
        scores.team1Score <= 9),
    {
      message:
        'One team must score exactly 10; the other must score between 0 and 9.',
    },
  );

export const recordMatchSchema = z
  .object({
    team1Player1Id: z.string().uuid(),
    team1Player2Id: z.string().uuid(),
    team2Player1Id: z.string().uuid(),
    team2Player2Id: z.string().uuid(),
    team1Score: z.coerce.number().int().min(0).max(10),
    team2Score: z.coerce.number().int().min(0).max(10),
  })
  .refine(
    (data) => {
      const ids = [
        data.team1Player1Id,
        data.team1Player2Id,
        data.team2Player1Id,
        data.team2Player2Id,
      ];
      return new Set(ids).size === 4;
    },
    { message: 'Each player can only be selected once.' },
  )
  .refine(
    (data) =>
      (data.team1Score === 10 &&
        data.team2Score >= 0 &&
        data.team2Score <= 9) ||
      (data.team2Score === 10 &&
        data.team1Score >= 0 &&
        data.team1Score <= 9),
    {
      message:
        'One team must score exactly 10; the other must score between 0 and 9.',
    },
  );
