import { Skeleton } from "@/components/ui/skeleton"

export function SidebarItemsSkeleton() {
  return (
    <div className="flex items-center space-x-4 mb-2">
      <div className="space-y-2 flex w-full">
        <Skeleton className="h-7 flex w-full" />
      </div>
    </div>
  )
}
