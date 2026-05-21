export const ELO_K_FACTOR = 32;

export function calculateTeamElo(player1Elo: number, player2Elo: number): number {
  return (player1Elo + player2Elo) / 2;
}

export function calculateExpectedScore(
  teamElo: number,
  opponentTeamElo: number,
): number {
  return 1 / (1 + Math.pow(10, (opponentTeamElo - teamElo) / 400));
}

export type MatchEloInput = {
  team1Player1Elo: number;
  team1Player2Elo: number;
  team2Player1Elo: number;
  team2Player2Elo: number;
  team1Won: boolean;
};

export type MatchEloResult = {
  team1Delta: number;
  team2Delta: number;
  team1Won: boolean;
};

export function calculateMatchElo(input: MatchEloInput): MatchEloResult {
  const team1Elo = calculateTeamElo(
    input.team1Player1Elo,
    input.team1Player2Elo,
  );
  const team2Elo = calculateTeamElo(
    input.team2Player1Elo,
    input.team2Player2Elo,
  );

  const expectedTeam1 = calculateExpectedScore(team1Elo, team2Elo);
  const actualTeam1 = input.team1Won ? 1 : 0;
  const team1Delta = Math.round(
    ELO_K_FACTOR * (actualTeam1 - expectedTeam1),
  );

  return {
    team1Delta,
    team2Delta: -team1Delta,
    team1Won: input.team1Won,
  };
}
