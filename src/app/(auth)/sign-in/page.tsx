import { LoginForm } from "@/components/auth-components/loginForm";
import { Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:flex items-center justify-center">
        <h1 className="text-6xl font-mono cursor-pointer hover:text-gray-800">streamX</h1>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="hidden lg:flex justify-start gap-2">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Home className="size-4" />
            </div>
            streamX
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
