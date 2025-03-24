"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import {
  authSignin,
} from "@/app/actions/auth-actions/authSignin";
import loginSchema from "@/schemas/loginSchema";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { GoogleProviderBtn } from "./authProviderBtns";

type AuthSigninResult = {
  success: boolean;
  errors?: { email?: string[]; password?: string[] };
  error?: string;
  redirect?: string;
  message?: string;
};

const initialState: AuthSigninResult = {
  success: false,
  errors: {},
  error: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [clientErrors, setClientErrors] = useState<{
    email?: string;
    password?: string;
  } | null>(null);

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(authSignin, initialState);

  const validateForm = (formData: FormData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setClientErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return false;
    } else {
      setClientErrors(null);
      return true;
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (validateForm(formData)) {
      formAction(formData);
    }
  };

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }

    if (state.success && state.redirect) {
      toast.success(state.message || "Login successful", {
        duration: 3000,
      });

      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="flex flex-col gap-4">
      <Form
        action={handleSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              aria-invalid={
                clientErrors?.email || state.errors?.email ? "true" : "false"
              }
            />
            {(clientErrors?.email || state.errors?.email) && (
              <p className="text-sm text-destructive">
                {clientErrors?.email || state.errors?.email?.[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
              aria-invalid={
                clientErrors?.password || state.errors?.password
                  ? "true"
                  : "false"
              }
            />
            {(clientErrors?.password || state.errors?.password) && (
              <p className="text-sm text-destructive">
                {clientErrors?.password || state.errors?.password?.[0]}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            Login{" "}
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </Form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <GoogleProviderBtn />
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
