import { Skeleton } from '@/components/ui/skeleton';

export function MatchItemSkeleton() {
  return (
    <li className="rounded-lg border bg-background/60 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 max-w-[38%] shrink flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex min-w-0 max-w-[38%] shrink flex-col items-end gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </li>
  );
}
