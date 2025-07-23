"use client";

import LeftSideComponent from "@/components/auth-components/leftSide-component";
import { SignupForm } from "@/components/auth-components/signupForm";
import { ROUTES } from "@/constants/ApiRoutes";
import { Home } from "lucide-react";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="grid h-full w-full lg:grid-cols-2 rounded-2xl border overflow-clip">
      <LeftSideComponent />

      <div className="flex flex-col justify-between p-4">
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href={ROUTES.PAGES_ROUTES.HOME}
            className="flex items-center gap-2 font-medium"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Home className="size-4" />
            </div>
            <span>Home</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
