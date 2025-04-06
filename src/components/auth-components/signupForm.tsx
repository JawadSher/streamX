"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { authSignUp } from "@/app/actions/auth-actions/authSignup";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import Link from "next/link";
import { GoogleProviderBtn } from "./authProviderBtns";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { checkUserName } from "@/app/actions/checkUserName";
import { debounce } from "lodash";

type AuthSignupResult = {
  success: boolean;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userName?: string[];
    email?: string[];
    password?: string[];
    confirmPasswd?: string[];
  };
  error?: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    password?: string;
    confirmPasswd?: string;
  } | null>(null);

  const [state, formAction, isPending] = useActionState<
    AuthSignupResult | null,
    FormData
  >(authSignUp, null);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [userNameAvailable, setUsernameAvailable] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success("Account created successfully", {
        duration: 3000,
      });

      setErrors(null);
      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setConfirmPasswd("");
      setUsernameAvailable("");

      router.push(API_ROUTES.HOME);
    }
  }, [state]);

  const handleSubmit = async (formData: FormData) => {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confPasswd: formData.get("confirmPasswd"),
    };

    const result = signupSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        userName: fieldErrors.userName?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    const passwdData = {
      password: data.password,
      confPasswd: data.confPasswd,
    };

    const passwdResult = confPassSchema.safeParse(passwdData);
    if (!passwdResult.success) {
      const fieldErrors = passwdResult.error.flatten().fieldErrors;
      setErrors({
        confirmPasswd: fieldErrors.confPasswd?.[0],
      });
    } else {
      setErrors(null);
    }

    const readyData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      email: data.email,
      password: data.password,
    };

    formAction(readyData);
  };

  const getUsername = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
  };

  const debouncedCheck = debounce(async (value) => {
    if (value) {
      const result = await checkUserName(value);

      if (result?.status === "available") {
        setUsernameAvailable(result.message);
        setErrors({
          userName: "",
        });
      } else if (result?.status === "error") {
        setErrors({
          userName: result.message,
        });
        setUsernameAvailable("");
      } else {
        setErrors({
          userName: "",
        });
        setUsernameAvailable("");
      }
    }
  }, 1000);

  useEffect(() => {
    debouncedCheck(userName);

    if (userName.length === 0) {
      setErrors({
        userName: "",
      });
      setUsernameAvailable("");
    }
    return () => debouncedCheck.cancel();
  }, [userName]);

  return (
    <div className="flex flex-col gap-4 ">
      <div>
        <Form
          className={cn("flex flex-col gap-6", className)}
          {...props}
          action={handleSubmit}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create new account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your details to create new streamX account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                required
                aria-invalid={errors?.firstName ? "true" : "false"}
              />
              {errors?.firstName && (
                <p className="text-sm text-destructive">{errors?.firstName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                required
                aria-invalid={errors?.lastName ? "true" : "false"}
              />
              {errors?.lastName && (
                <p className="text-sm text-destructive">{errors?.lastName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userName">User name</Label>
              <Input
                id="userName"
                type="text"
                name="userName"
                placeholder="@username"
                required
                aria-invalid={errors?.userName ? "true" : "false"}
                value={userName}
                onChange={getUsername}
              />
              {userNameAvailable && (
                <p className="text-sm text-green-400">{userNameAvailable}</p>
              )}
              {errors?.userName && (
                <p className="text-sm text-destructive">{errors?.userName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                aria-invalid={errors?.email ? "true" : "false"}
              />
              {errors?.password && (
                <p className="text-sm text-destructive">{errors?.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                aria-invalid={errors?.password ? "true" : "false"}
              />
              {errors?.password && (
                <p className="text-sm text-destructive">{errors?.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPasswd">Confirm Password</Label>
              <Input
                id="confirmPasswd"
                type="password"
                name="confirmPasswd"
                required
                aria-invalid={errors?.confirmPasswd ? "true" : "false"}
              />
              {errors?.confirmPasswd && (
                <p className="text-sm text-destructive">
                  {errors?.confirmPasswd}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              Sign up {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </Form>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <GoogleProviderBtn />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
