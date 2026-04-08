import { cn } from '../lib/utils'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  const r = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  return <div className={cn('skeleton', r, className)} />
}

export function MatchCardSkeleton() {
  return (
    <div className="bg-ink-card border border-ink-border rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16" rounded="sm" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12" rounded="full" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12" rounded="full" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-3 w-36 mt-2" />
    </div>
  )
}

export function StatTileSkeleton() {
  return (
    <div className="bg-ink-card border border-ink-border rounded-lg p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

export function ScorecardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
