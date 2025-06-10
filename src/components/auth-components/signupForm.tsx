"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import Link from "next/link";
import { GoogleProviderBtn } from "./authProviderBtns";
import { toast, Toaster } from "sonner";
import { debounce } from "lodash";
import { useCheckUserName, useSignUpUser } from "@/hooks/useUser";
import { extractGraphQLError } from "@/lib/extractGraphqlError";

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [userNameAvailable, setUsernameAvailable] = useState("");

  const [signUp, { loading, data: signUpData, error }] = useSignUpUser();
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
      return;
    }

    signUp({
      variables: {
        firstName,
        lastName,
        email,
        userName,
        password,
      },
    });
  };

  useEffect(() => {
    if (signUpData) {
      const status = signUpData.signUpUser.statusCode;

      if (status === 200 || status === 201) {
        setErrors(null);
        setFirstName("");
        setLastName("");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPasswd("");
        setUsernameAvailable("");
      } else if (error) {
        const { data, message } = extractGraphQLError(error);
        setErrors({
          firstName: data?.firstName?.[0],
          lastName: data?.lastName?.[0],
          userName: data?.userName?.[0],
          email: data?.email?.[0],
          password: data?.password?.[0],
        });
        toast.error(message, {
          duration: 3000,
        });
      }
    }
  }, [signUpData, error]);

  const [checkUserName] = useCheckUserName();
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (value) {
        checkUserName({
          variables: { userName: value, isAuthentic: true },
          fetchPolicy: "no-cache",
          onCompleted: (res) => {
            setErrors((prev) => ({ ...prev, userName: "" }));
            setUsernameAvailable(res.checkUserName.message);
          },
          onError: (err: any) => {
            const { message, statusCode, data } = extractGraphQLError(err);

            const isAvailable = data?.available;
            if ([422, 400, 500].includes(statusCode)) {
              setErrors((prev) => ({
                ...prev,
                userName: data.validationError,
              }));
              setUsernameAvailable("");
            } else if (statusCode === 409 || isAvailable === false) {
              setErrors((prev) => ({ ...prev, userName: message }));
              setUsernameAvailable("");
            }
          },
        });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedCheck(userName);

    if (userName.length === 0) {
      setErrors((prev) => ({ ...prev, userName: "" }));
      setUsernameAvailable("");
    }

    return () => debouncedCheck.cancel();
  }, [userName, debouncedCheck]);

  return (
    <div className="flex flex-col gap-4">
      <form
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={!!errors?.firstName}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={!!errors?.lastName}
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-invalid={!!errors?.userName}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors?.email}
            />
            {errors?.email && (
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors?.password}
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
              value={confirmPasswd}
              onChange={(e) => setConfirmPasswd(e.target.value)}
              aria-invalid={!!errors?.confirmPasswd}
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
            disabled={
              loading ||
              !firstName ||
              !lastName ||
              !userName ||
              !email ||
              !password ||
              !confirmPasswd ||
              !!errors?.userName ||
              confirmPasswd !== password
            }
          >
            {loading ? <Loader2 className="animate-spin ml-2" /> : "Sign up"}
          </Button>
        </div>
      </form>
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
