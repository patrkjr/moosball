import { MatchItemSkeleton } from '@/components/match-item-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-background/60 px-4 py-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-2 h-8 w-20" />
      <Skeleton className="mt-1.5 h-3 w-28" />
    </div>
  );
}

export function PlayerProfileSkeleton() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4">
          <Skeleton className="h-4 w-28" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-40" />
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-3">
            <div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="mt-1 h-4 w-56" />
            </div>
            <ul className="flex flex-col gap-3">
              <MatchItemSkeleton />
              <MatchItemSkeleton />
              <MatchItemSkeleton />
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
