"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import loginSchema from "@/schemas/loginSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { Toaster } from "sonner";
import { GoogleProviderBtn } from "./authProviderBtns";
import { ROUTES } from "@/constants/ApiRoutes";
import { useRouter } from "next/navigation";
import { signinHandler } from "@/auth-handlers/signinHandler";
import { useSession } from "next-auth/react";
import Loading from "../loading";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const isDisabled = loading || !email || !password;

  const onSubmit = async (data: LoginFormData) => {
    const response = await signinHandler(session, data, setLoading);
    if (response === true) {
      router.push(ROUTES.PAGES_ROUTES.HOME);
    }
  };

  return (
    <div className="flex flex-col gap-6 min-w-[350px]">
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="flex h-full w-full cursor-pointer"
              disabled={isDisabled}
            >
              {loading ? <Loading /> : "Login"}
            </Button>
          </form>

          <div className="relative text-center text-sm after:border-t after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <GoogleProviderBtn />

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardContent>

        <Toaster position="bottom-right" expand={false} />
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
