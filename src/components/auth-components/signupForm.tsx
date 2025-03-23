"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { authSignUp } from "@/app/actions/auth-actions/authSignup";
import { useActionState, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import Link from "next/link";
import { authProviderSignIn } from "@/app/actions/auth-actions/authSignin";

type AuthSigninResult = {
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
    AuthSigninResult | null,
    FormData
  >(authSignUp, null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswdRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<any> => {
    const { name, value } = event.target;

    const firstNameValue =
      name === "firstName" ? value : firstNameRef.current?.value || "";
    const lastNameValue =
      name === "lastName" ? value : lastNameRef.current?.value || "";
    const userNameValue =
      name === "userName" ? value : userNameRef.current?.value || "";
    const emailValue = name === "email" ? value : emailRef.current?.value || "";
    const passwordValue =
      name === "password" ? value : passwordRef.current?.value || "";
    const confirmPasswdValue =
      name === "confirmPasswd" ? value : confirmPasswdRef.current?.value || "";

    const passwdData = {
      passwd: passwordValue,
      confPasswd: confirmPasswdValue,
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

    const data = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      userName: userNameValue,
      email: emailValue,
      password: passwordValue,
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
    } else {
      setErrors(null);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
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

    formAction(formData);
  };

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
                ref={firstNameRef}
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
                ref={lastNameRef}
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
                ref={userNameRef}
                aria-invalid={errors?.userName ? "true" : "false"}
              />
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
                ref={emailRef}
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
                ref={passwordRef}
                onChange={handleInputChange}
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
                ref={confirmPasswdRef}
                onChange={handleInputChange}
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
        <Form action={authProviderSignIn}>
          <Button variant="outline" className="w-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </Form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
