"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/schemas/loginSchema";
import { useReducer, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import { GoogleProviderBtn } from "./authProviderBtns";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { useRouter } from "next/navigation";
import { signinHandler } from "@/auth-handlers/signinHandler";
import { useSession } from "next-auth/react";

type State = {
  email: string;
  password: string;
  errors: Record<string, string[] | undefined>;
  error: string[] | null;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_ERRORS"; errors: Partial<State["errors"]> }
  | { type: "SET_ERROR"; error: string[] | null }
  | { type: "RESET_ERRORS" }
  | { type: "SET_FIELD_EMPTY"; values: Partial<State> };

const initialState = {
  email: "",
  password: "",
  errors: {
    email: undefined,
    password: undefined,
  },
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.errors,
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "RESET_ERRORS":
      return {
        ...state,
        errors: {
          email: undefined,
          password: undefined,
        },
        error: null,
      };
    case "SET_FIELD_EMPTY":
      return {
        ...state,
        ...action.values,
      };
    default:
      return state;
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();

  const handleSubmit = async (formData: FormData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      dispatch({
        type: "SET_ERRORS",
        errors: {
          email: fieldErrors.email,
          password: fieldErrors.password,
        },
      });
      return;
    }

    const credentials = {
      email: result.data.email!,
      password: result.data.password!,
    };

    const response = await signinHandler(session, credentials, setLoading);

    if (response === true) {
      dispatch({
        type: "RESET_ERRORS",
      });
      router.push(ROUTES.PAGES_ROUTES.HOME);
    } else {
      dispatch({
        type: "SET_ERROR",
        error: ["Invalid credentials"],
      });
    }

    return;
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {state.error && (
          <div className=" border-red-400 rounded-md w-full px-2 py-1 bg-red-900 text-red-100 flex-grow ">
            {state.error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                });
                dispatch({
                  type: "SET_ERRORS",
                  errors: {
                    email: undefined,
                  },
                });
              }}
              aria-invalid={state.errors?.email ? "true" : "false"}
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
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
              name="password"
              placeholder="••••••••"
              required
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "password",
                  value: e.target.value,
                });
                dispatch({
                  type: "SET_ERRORS",
                  errors: {
                    password: undefined,
                  },
                });
              }}
              aria-invalid={state.errors?.password ? "true" : "false"}
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={
              loading ||
              !!state.errors.email ||
              !!state.errors.password ||
              !state.email ||
              !state.password
            }
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Login"}
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

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>

      <Toaster position="bottom-right" expand={false} />
    </div>
  );
}
