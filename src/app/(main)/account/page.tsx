import { auth } from "@/app/api/auth/[...nextauth]/configs";
import AccountPageSkeleton from "@/components/skeletons/account-page-skeleton";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import AccountForm from "@/components/account-page-components/account-form";
import { getUserData } from "@/app/actions/user-actions/getUserData.action";

export const revalidate = 60;

const Account = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect(API_ROUTES.HOME);

  const userData: IRedisDBUser | null = await getUserData();

  if (!userData) {
    return (
      <div className="text-red-500 text-center">No user data available.</div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full pb-2">
      <div className="flex justify-center h-full w-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 md:px-10 lg:px-30 py-10 shadow-lg">
        <div className="flex justify-center w-full h-full">
          <Suspense fallback={<AccountPageSkeleton />}>
            <AccountForm initialData={userData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Account;
