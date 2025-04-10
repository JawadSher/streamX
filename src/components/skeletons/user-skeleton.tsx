import { Skeleton } from "@/components/ui/skeleton"

const UserSkeleton = () => {
  return (
    <div className="flex items-center justify-start space-x-2 p-2">
      <Skeleton className="h-[35px] min-w-[35px] rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-[70px]" />
        <Skeleton className="h-2 w-[130px]" />
      </div>
    </div>
  );
};

export default UserSkeleton;
