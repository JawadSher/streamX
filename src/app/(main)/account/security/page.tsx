import AccountPageSkeleton from "@/components/skeletons/account-page-skeleton";
import React, { Suspense } from "react";
import AccountSecurityForm from "@/components/account-security-page-components/security-form";

export const revalidate = 60;

export default async function Security() {
  return (
    <div className="flex items-center justify-center w-full h-full pb-2">
      <div className="flex justify-center h-full w-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 md:px-10 lg:px-30 py-10 shadow-lg">
        <div className="flex justify-center w-full h-full">
          <Suspense fallback={<AccountPageSkeleton />}>
            <AccountSecurityForm  />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
