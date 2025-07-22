import { auth } from "@/app/api/auth/[...nextauth]/configs";
import LeftSideComponent from "@/components/auth-components/leftSide-component";
import { LoginForm } from "@/components/auth-components/loginForm";
import { ROUTES } from "@/constants/ApiRoutes";
import { Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user || session?.user?._id) {
    redirect(ROUTES.PAGES_ROUTES.HOME);
  }

  return (
    <div className="w-full grid lg:grid-cols-2 rounded-2xl border-1 overflow-clip">
      <LeftSideComponent />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="hidden lg:flex justify-start gap-2">
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
          <div className="w-full max-w-xs ">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
