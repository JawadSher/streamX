"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import Link from "next/link";
import { GoogleProviderBtn } from "./authProviderBtns";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { debounce } from "lodash";
import { authSignUp } from "@/app/actions/auth-actions/authSignUp.action";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { checkUniqueUserName } from "@/app/actions/user-actions/checkUserName.action";

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
  const router = useRouter();

  type FormState =
  | { success: boolean }
  | ActionResponseType
  | ActionErrorType;

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
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
      return { success: false };
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
      return { success: false };
    }

    const response: ActionResponseType | ActionErrorType = await authSignUp({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      userName: result.data.userName,
      password: result.data.password,
    });

    return response;
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    success: false,
  } as FormState );

  useEffect(() => {
    if ("statusCode" in state) {
      if (state.statusCode === 200) {
        toast.success("Account created successfully", {
          description: state.message,
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

        router.push(ROUTES.PAGES_ROUTES.HOME);
      } else if (state.statusCode === 400 && state.data?.fieldErrors) {
        const fieldErrors = state.data.fieldErrors;
        setErrors({
          firstName: fieldErrors.firstName?.[0],
          lastName: fieldErrors.lastName?.[0],
          userName: fieldErrors.userName?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        toast.error("Signup failed", {
          description: state.message,
          duration: 3000,
        });
      } else if (state.statusCode === 400) {
        toast.error("Signup failed", {
          description: state.message,
          duration: 3000,
        });
      } else if (state.statusCode === 401) {
        toast.error("Signup failed", {
          description: state.message,
          duration: 3000,
        });
      } else if (state.statusCode === 409) {
        toast.error("Signup failed", {
          description: state.message,
          duration: 3000,
        });
      } else if (state.statusCode === 500) {
        toast.error("Signup failed", {
          description: state.message,
          duration: 3000,
        });
      }
    }
  }, [state, router]);



  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (value) {
        const result = await checkUniqueUserName({userName: value});

        if (result?.statusCode === 422) {
          toast.error(result.message)
          setErrors((prev) => ({ ...prev, userName: "" }));
          setUsernameAvailable("");
        } else if (result?.statusCode === 409) {
          setUsernameAvailable("");
          setErrors((prev) => ({ ...prev, userName: result.message }));
        } else if(result.statusCode === 400) {
          toast.error(result.message)
          setErrors((prev) => ({ ...prev, userName: "" }));
          setUsernameAvailable("");
        }else if(result.statusCode === 500){
          toast.error(result.message)
          setErrors((prev) => ({ ...prev, userName: "" }));
          setUsernameAvailable("");
        }else{
          setErrors((prev) => ({ ...prev, userName: "" }));
          setUsernameAvailable(result.message);
        }
      }
    }, 1000),
    [debounce]
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
        action={formAction}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-invalid={errors?.userName ? "true" : "false"}
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
              aria-invalid={errors?.email ? "true" : "false"}
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
              value={confirmPasswd}
              onChange={(e) => setConfirmPasswd(e.target.value)}
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
            Sign up {isPending && <Loader2 className="animate-spin ml-2" />}
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
