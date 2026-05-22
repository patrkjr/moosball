'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

import { updatePlayerName } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type EditablePlayerNameProps = {
  playerId: string;
  name: string;
};

export function EditablePlayerName({ playerId, name }: EditablePlayerNameProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isEditing) {
      setDraft(name);
    }
  }, [name, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function cancelEdit() {
    setDraft(name);
    setError(null);
    setIsEditing(false);
  }

  function startEdit() {
    setDraft(name);
    setError(null);
    setIsEditing(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = draft.trim();
    if (trimmed === name) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updatePlayerName(playerId, trimmed);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      toast.success('Name updated');
      setIsEditing(false);
      router.refresh();
    });
  }

  if (!isEditing) {
    return (
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className="truncate">{name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          onClick={startEdit}
          aria-label={`Edit name for ${name}`}
        >
          <Pencil className="size-4" aria-hidden />
        </Button>
      </span>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-1 flex-col gap-2"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 text-3xl font-semibold tracking-tight shadow-none focus-visible:ring-0"
          autoComplete="off"
          maxLength={64}
          disabled={isPending}
          aria-label="Player name"
          aria-invalid={error ? true : undefined}
        />
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            aria-label="Save name"
          >
            <Check className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={cancelEdit}
            disabled={isPending}
            aria-label="Cancel editing"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </form>
  );
}
