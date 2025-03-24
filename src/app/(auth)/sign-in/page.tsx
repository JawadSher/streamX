"use client";

import { LoginForm } from "@/components/auth-components/loginForm";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { Home, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if(status === 'authenticated' && session?.user){
    toast.success(`Already signed in with ${session?.user?.email}`, {
      duration: 3000,
    });

    setTimeout(() => {
      router.push(API_ROUTES.HOME);
    }, 1000);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:flex items-center justify-center">
        <h1 className="text-6xl font-mono cursor-pointer hover:text-gray-800">
          streamX
        </h1>
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
            {status === "loading" ? (
              <Loader2 className="animate-spin w-10 h-10" />
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
        <Toaster position="bottom-right" expand={false} />
      </div>
    </div>
  );
}
