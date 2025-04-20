import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { redirect } from "next/navigation";
import React from "react";

const Account = async () => {
  const session = await auth();
  
  if(!session?.user?._id) return redirect(API_ROUTES.HOME);
  
  return (
    <div className="flex w-full h-full border-2 p-10 border-white">
      <div className="w-full h-full">
        
      </div>
    </div>
  );
};

export default Account;
