'use client';

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { recordMatch } from '@/app/actions';
import {
  PlayerAutocomplete,
  type PlayerOption,
} from '@/components/player-autocomplete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { foosballScoreSchema } from '@/lib/validations';

type RecordMatchDialogProps = {
  players: PlayerOption[];
};

const emptySelections = {
  team1Player1Id: '',
  team1Player2Id: '',
  team2Player1Id: '',
  team2Player2Id: '',
};

function isValidFoosballScore(team1Score: number, team2Score: number) {
  return foosballScoreSchema.safeParse({ team1Score, team2Score }).success;
}

export function RecordMatchDialog({ players }: RecordMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState(emptySelections);
  const [team1Score, setTeam1Score] = useState('10');
  const [team2Score, setTeam2Score] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedIds = useMemo(
    () => Object.values(selections).filter(Boolean),
    [selections],
  );

  const canSubmit =
    players.length >= 4 &&
    selectedIds.length === 4 &&
    new Set(selectedIds).size === 4 &&
    isValidFoosballScore(Number(team1Score), Number(team2Score));

  function resetForm() {
    setSelections(emptySelections);
    setTeam1Score('10');
    setTeam2Score('0');
    setError(null);
  }

  function updateSelection(
    key: keyof typeof emptySelections,
    playerId: string,
  ) {
    setSelections((current) => ({ ...current, [key]: playerId }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError(
        'Select four unique players and enter a valid score (10 vs 0–9).',
      );
      return;
    }

    const formData = new FormData();
    formData.set('team1Player1Id', selections.team1Player1Id);
    formData.set('team1Player2Id', selections.team1Player2Id);
    formData.set('team2Player1Id', selections.team2Player1Id);
    formData.set('team2Player2Id', selections.team2Player2Id);
    formData.set('team1Score', team1Score);
    formData.set('team2Score', team2Score);

    startTransition(async () => {
      const result = await recordMatch(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      toast.success('Match recorded');
      resetForm();
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Record Match Result
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Match Result</DialogTitle>
          <DialogDescription>
            Pick four unique players and enter a valid foosball score.
          </DialogDescription>
        </DialogHeader>
        {players.length < 4 ? (
          <p className="text-sm text-muted-foreground">
            Add at least four players before recording a match.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PlayerAutocomplete
                label="Team 1 — Player 1"
                players={players}
                value={selections.team1Player1Id}
                disabledIds={selectedIds.filter(
                  (id) => id !== selections.team1Player1Id,
                )}
                onChange={(id) => updateSelection('team1Player1Id', id)}
              />
              <PlayerAutocomplete
                label="Team 1 — Player 2"
                players={players}
                value={selections.team1Player2Id}
                disabledIds={selectedIds.filter(
                  (id) => id !== selections.team1Player2Id,
                )}
                onChange={(id) => updateSelection('team1Player2Id', id)}
              />
              <PlayerAutocomplete
                label="Team 2 — Player 1"
                players={players}
                value={selections.team2Player1Id}
                disabledIds={selectedIds.filter(
                  (id) => id !== selections.team2Player1Id,
                )}
                onChange={(id) => updateSelection('team2Player1Id', id)}
              />
              <PlayerAutocomplete
                label="Team 2 — Player 2"
                players={players}
                value={selections.team2Player2Id}
                disabledIds={selectedIds.filter(
                  (id) => id !== selections.team2Player2Id,
                )}
                onChange={(id) => updateSelection('team2Player2Id', id)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="team1-score">Team 1 Score</Label>
                <Input
                  id="team1-score"
                  type="number"
                  min={0}
                  max={10}
                  value={team1Score}
                  onChange={(event) => setTeam1Score(event.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="team2-score">Team 2 Score</Label>
                <Input
                  id="team2-score"
                  type="number"
                  min={0}
                  max={10}
                  value={team2Score}
                  onChange={(event) => setTeam2Score(event.target.value)}
                  required
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              One team must score exactly 10; the other scores 0–9.
            </p>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <DialogFooter>
              <Button type="submit" disabled={isPending || !canSubmit}>
                {isPending ? 'Saving...' : 'Submit Match'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
