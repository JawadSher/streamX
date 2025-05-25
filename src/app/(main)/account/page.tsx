import AccountPageSkeleton from "@/components/skeletons/account-page-skeleton";
import React, { Suspense } from "react";
import AccountForm from "@/components/account-page-components/account-form";
import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/api/ApiRoutes";

export const revalidate = 60;

const Account = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect(ROUTES.PAGES_ROUTES.HOME);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex justify-center h-full w-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 md:px-10 lg:px-30 py-10 shadow-lg">
        <div className="flex justify-center w-full h-full">
          <Suspense fallback={<AccountPageSkeleton />}>
            <AccountForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Account;
