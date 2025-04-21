import { auth } from "@/app/api/auth/[...nextauth]/configs";
import AccountForm from "@/components/account-page-components/account-form";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { redirect } from "next/navigation";
import React from "react";

const Account = async () => {
  const session = await auth();
  if (!session?.user?._id) return redirect(API_ROUTES.HOME);

  return (
    <div className="flex w-full h-full pb-2">
      <div className="w-full h-full rounded-lg bg-[#fafafa] dark:bg-[rgb(24_24_27)] transition-colors duration-300 px-5 md:px-10 lg:px-30 md:pt-10">
        <AccountForm />
      </div>
    </div>
  );
};

export default Account;
