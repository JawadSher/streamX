import { auth } from "@/app/api/auth/[...nextauth]/configs";
import AccountForm from "@/components/account-page-components/account-form";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { redirect } from "next/navigation";
import React from "react";

const Account = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect(API_ROUTES.HOME);

  return (
    <div className="flex items-center justify-center w-full h-full pb-2">
      <div className="flex justify-center h-full w-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 md:px-10 lg:px-30 py-10 shadow-lg">
        <div className="flex justify-center w-full h-full">
          <AccountForm />
        </div>
      </div>
    </div>
  );
};

export default Account;
