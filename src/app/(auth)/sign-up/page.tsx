import { SignupForm } from "@/components/auth-components/signupForm";
import { Home } from "lucide-react";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="relative hidden bg-muted lg:flex items-center justify-center">
        <h1 className="text-6xl font-mono cursor-pointer hover:text-gray-800">
          streamX
        </h1>
      </div>
      <div className="flex flex-col h-screen">
        <div className="flex flex-col gap-4 p-6 md:p-10 flex-grow overflow-auto">
          <div className="hidden lg:flex justify-start gap-2 absolute">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Home className="size-4" />
              </div>
              streamX
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs p-4">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
