import { Skeleton } from '../ui/skeleton'

const ButtonSkeleton = ({ className }: { className: string }) => {

  return (
    <div className="flex items-center space-x-4 mb-2">
      <div className="space-y-3 flex flex-col w-full">
        <Skeleton className={className} />
      </div>
    </div>
  )
}


export default ButtonSkeleton