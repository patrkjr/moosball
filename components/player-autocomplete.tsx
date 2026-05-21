'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PlayerOption = {
  id: string;
  name: string;
};

type PlayerAutocompleteProps = {
  label: string;
  players: PlayerOption[];
  value: string;
  disabledIds: string[];
  onChange: (playerId: string) => void;
};

export function PlayerAutocomplete({
  label,
  players,
  value,
  disabledIds,
  onChange,
}: PlayerAutocompleteProps) {
  const selected = players.find((player) => player.id === value);
  const [query, setQuery] = useState(selected?.name ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const inputId = useId();

  useEffect(() => {
    setQuery(selected?.name ?? '');
  }, [selected?.name, value]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return players.filter((player) => {
      if (disabledIds.includes(player.id) && player.id !== value) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return player.name.toLowerCase().includes(normalizedQuery);
    });
  }, [players, query, disabledIds, value]);

  function selectPlayer(player: PlayerOption) {
    onChange(player.id);
    setQuery(player.name);
    setOpen(false);
    setActiveIndex(-1);
  }

  function resolveExactMatch(text: string) {
    const normalized = text.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    return (
      players.find((player) => {
        if (disabledIds.includes(player.id) && player.id !== value) {
          return false;
        }
        return player.name.toLowerCase() === normalized;
      }) ?? null
    );
  }

  function handleBlur() {
    window.setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setOpen(false);
        setActiveIndex(-1);
        const exact = resolveExactMatch(query);
        if (exact) {
          selectPlayer(exact);
          return;
        }
        if (selected && query.trim() !== selected.name) {
          onChange('');
          setQuery('');
        }
      }
    }, 0);
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Type player name..."
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          setActiveIndex(-1);
          if (selected && next !== selected.name) {
            onChange('');
          }
        }}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            setOpen(true);
            return;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((index) =>
              index < suggestions.length - 1 ? index + 1 : 0,
            );
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) =>
              index > 0 ? index - 1 : suggestions.length - 1,
            );
          }
          if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            const player = suggestions[activeIndex];
            if (player) selectPlayer(player);
          }
          if (event.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
      />
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {suggestions.map((player, index) => (
            <li
              key={player.id}
              role="option"
              aria-selected={value === player.id}
              className={cn(
                'cursor-pointer rounded-md px-2 py-1.5 text-sm outline-none',
                index === activeIndex && 'bg-accent text-accent-foreground',
                value === player.id && index !== activeIndex && 'font-medium',
              )}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectPlayer(player)}
            >
              {player.name}
            </li>
          ))}
        </ul>
      ) : null}
      {open && query.trim() && suggestions.length === 0 ? (
        <p className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-popover px-2 py-1.5 text-sm text-muted-foreground shadow-md">
          No matching players
        </p>
      ) : null}
    </div>
  );
}
