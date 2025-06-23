"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/schemas/loginSchema";
import { useEffect, useReducer } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { useSignInUser } from "@/hooks/apollo";
import { GoogleProviderBtn } from "./authProviderBtns";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { useRouter } from "next/navigation";

type State = {
  email: string;
  password: string;
  errors: Record<string, string[] | undefined>;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_ERRORS"; errors: Partial<State["errors"]> }
  | { type: "RESET_ERRORS" }
  | { type: "SET_FIELD_EMPTY"; values: Partial<State> };

const initialState = {
  email: "",
  password: "",
  errors: {
    email: undefined,
    password: undefined,
  },
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
    case "RESET_ERRORS":
      return {
        ...state,
        errors: {
          email: undefined,
          password: undefined,
        },
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
  const [loginUser, { loading, error }] = useSignInUser();

  useEffect(() => {
    if (error) {
      const { statusCode, data } = extractGraphQLError(error);
      if (statusCode === 400) {
        dispatch({
          type: "SET_ERRORS",
          errors: {
            email: data?.email?.[0] ?? "",
            password: data?.password?.[0] ?? "",
          },
        });
      } else if (statusCode === 401 || statusCode === 500) {
        dispatch({ type: "RESET_ERRORS" });
      } else if (statusCode === 409) {
        dispatch({ type: "RESET_ERRORS" });
        setTimeout(() => {
          router.push(ROUTES.PAGES_ROUTES.HOME);
        }, 2000);
      }
    }
  }, [error]);

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

    loginUser({
      variables: {
        email: result.data.email,
        password: result.data.password,
      },
    });
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
