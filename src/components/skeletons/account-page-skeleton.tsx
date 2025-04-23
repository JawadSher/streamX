import { Skeleton } from '../ui/skeleton';
import ButtonSkeleton from './button-skeleton';

const AccountPageSkeleton = () => {
  return (
    <div className="flex items-center justify-center w-full h-full pb-2">
      <div className="flex justify-center h-full w-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 md:px-10 lg:px-30 py-10 shadow-lg">
        <div className="flex justify-center w-full h-full">
          <div className="grid grid-cols-1 grid-rows-5 md:grid-cols-2 max-w-[1100px] w-full gap-4">
            
            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2 w-full px-2 h-fit">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="md:col-span-2 flex justify-center px-4 pt-6 md:pt-2">
              <ButtonSkeleton className="h-9 w-full md:w-64"  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPageSkeleton;