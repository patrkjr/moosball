import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calculateMatchElo, calculateTeamElo } from './elo';

describe('calculateTeamElo', () => {
  it('averages two player ratings', () => {
    assert.equal(calculateTeamElo(1200, 1400), 1300);
  });
});

describe('calculateMatchElo', () => {
  it('gives zero delta for equal teams when favorite loses expectation tie', () => {
    const result = calculateMatchElo({
      team1Player1Elo: 1200,
      team1Player2Elo: 1200,
      team2Player1Elo: 1200,
      team2Player2Elo: 1200,
      team1Won: true,
    });
    assert.equal(result.team1Delta, 16);
    assert.equal(result.team2Delta, -16);
  });

  it('penalizes heavy favorites who lose', () => {
    const result = calculateMatchElo({
      team1Player1Elo: 1600,
      team1Player2Elo: 1600,
      team2Player1Elo: 1200,
      team2Player2Elo: 1200,
      team1Won: false,
    });
    assert.ok(result.team1Delta < 0);
    assert.equal(result.team2Delta, -result.team1Delta);
  });
});
