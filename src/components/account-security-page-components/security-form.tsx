"use client";

import { Toaster } from "../ui/sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/ApiRoutes";
import PasswordUpdate from "./password-update";
import AccountDelete from "./account-delete";

const AccountSecurityForm = () => {
  const { data: session } = useSession();

  if (!session?.user?._id) return redirect(ROUTES.PAGES_ROUTES.HOME);
  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:border-1 md:rounded-2xl overflow-auto">
      <h1 className="text-4xl font-semibold mb-15 text-center mt-2">
        Account Security Information
      </h1>
      <PasswordUpdate />
      <AccountDelete />
      <Toaster position="bottom-right" expand={false} />
    </div>
  );
};

export default AccountSecurityForm;
