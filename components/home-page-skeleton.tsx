import { MatchItemSkeleton } from '@/components/match-item-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

function LeaderboardRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-2 align-middle">
        <Skeleton className="h-4 w-6" />
      </td>
      <td className="p-2 align-middle">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-2 align-middle">
        <Skeleton className="ml-auto h-4 w-10" />
      </td>
      <td className="p-2 align-middle">
        <Skeleton className="ml-auto h-4 w-12" />
      </td>
    </tr>
  );
}

export function HomePageSkeleton() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 shrink-0 rounded-md" />
            <Skeleton className="h-9 w-52" />
          </div>
          <Skeleton className="h-5 max-w-2xl w-full" />
          <Skeleton className="h-5 max-w-xl w-full" />
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <section className="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-1 h-4 w-44" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="h-10 w-16 px-2 text-left">
                      <Skeleton className="h-4 w-8" />
                    </th>
                    <th className="h-10 px-2 text-left">
                      <Skeleton className="h-4 w-12" />
                    </th>
                    <th className="h-10 px-2 text-right">
                      <Skeleton className="ml-auto h-4 w-8" />
                    </th>
                    <th className="h-10 px-2 text-right">
                      <Skeleton className="ml-auto h-4 w-8" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <LeaderboardRowSkeleton />
                  <LeaderboardRowSkeleton />
                  <LeaderboardRowSkeleton />
                  <LeaderboardRowSkeleton />
                  <LeaderboardRowSkeleton />
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex h-full flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-1 h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-full rounded-lg sm:w-36" />
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
              <ul className="flex flex-col gap-3">
                <MatchItemSkeleton />
                <MatchItemSkeleton />
                <MatchItemSkeleton />
                <MatchItemSkeleton />
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
