"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useReducer } from "react";
import { Loader2 } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { debounce } from "lodash";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { useSignUpUser } from "@/hooks/apollo";
import { GoogleProviderBtn } from "./authProviderBtns";
import { useCheckUserName } from "@/hooks/apollo/user/user-account/use-user-account-queries";

type State = {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPasswd: string;
  userNameAvailable: string;
  errors: Record<string, string[] | undefined>;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "SET_FIELDS_EMPTY"; values: Partial<State> }
  | { type: "SET_ERRORS"; errors: Partial<State["errors"]> }
  | { type: "RESET_ERRORS" }
  | { type: "SET_MULTI_STATE"; payload: Partial<State> };

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  password: "",
  confirmPasswd: "",
  userNameAvailable: "",
  errors: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
    confirmPasswd: undefined,
    userName: undefined,
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_FIELDS_EMPTY":
      return {
        ...state,
        ...action.values,
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
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          userName: undefined,
          password: undefined,
          confirmPasswd: undefined,
        },
      };
    case "SET_MULTI_STATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
      dispatch({
        type: "SET_ERRORS",
        errors: {
          firstName: fieldErrors.firstName,
          lastName: fieldErrors.lastName,
          userName: fieldErrors.userName,
          email: fieldErrors.email,
          password: fieldErrors.password,
        },
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
      dispatch({
        type: "SET_ERRORS",
        errors: {
          confirmPasswd: fieldErrors.confPasswd,
        },
      });
      return;
    }

    signUp({
      variables: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        userName: result.data.userName,
        password: result.data.password,
      },
    });
  };

  useEffect(() => {
    if (!signUpData) return;

    const status = signUpData.signUpUser.statusCode;

    if (status === 200 || status === 201) {
      dispatch({ type: "RESET_ERRORS" });
      dispatch({
        type: "SET_FIELDS_EMPTY",
        values: initialState,
      });
      toast.success("Signup successful!");
    }
  }, [signUpData]);

  useEffect(() => {
    if (!error) return;

    const { data, message } = extractGraphQLError(error);
    dispatch({
      type: "SET_ERRORS",
      errors: {
        firstName: data?.firstName?.[0],
        lastName: data?.lastName?.[0],
        userName: data?.userName?.[0],
        email: data?.email?.[0],
        password: data?.password?.[0],
      },
    });
    toast.error(message, {
      duration: 3000,
    });
  }, [error]);

  const [userNameCheck] = useCheckUserName();
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (value) {
        userNameCheck({
          variables: { userName: value, isAuthentic: true },
          onCompleted: (res: any) => {
            console.log(res);
            dispatch({
              type: "SET_MULTI_STATE",
              payload: {
                userNameAvailable: res.checkUserName.message,
                errors: {
                  userName: undefined,
                },
              },
            });
          },
          onError: (err: any) => {
            const { message, statusCode, data } = extractGraphQLError(err);
            const isAvailable = data?.available;
            if ([422, 400, 500].includes(statusCode)) {
              dispatch({
                type: "SET_MULTI_STATE",
                payload: {
                  userNameAvailable: "",
                  errors: {
                    userName: data.validationError,
                  },
                },
              });
            } else if (statusCode === 409 || isAvailable === false) {
              dispatch({
                type: "SET_MULTI_STATE",
                payload: {
                  userNameAvailable: "",
                  errors: {
                    userName: message,
                  },
                },
              });
            }
          },
        });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedCheck(state.userName);

    if (state.userName.length === 0) {
      dispatch({
        type: "SET_MULTI_STATE",
        payload: {
          userNameAvailable: "",
          errors: {
            userName: undefined,
          },
        },
      });
    }

    return () => debouncedCheck.cancel();
  }, [state.userName, debouncedCheck]);

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
              value={state.firstName}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "firstName",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.firstName}
            />
            {state.errors?.firstName && (
              <p className="text-sm text-destructive">
                {state.errors?.firstName}
              </p>
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
              value={state.lastName}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "lastName",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.lastName}
            />
            {state.errors?.lastName && (
              <p className="text-sm text-destructive">
                {state.errors?.lastName}
              </p>
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
              value={state.userName}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "userName",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.userName}
            />
            {state.userNameAvailable && (
              <p className="text-sm text-green-400">
                {state.userNameAvailable}
              </p>
            )}
            {state.errors?.userName && (
              <p className="text-sm text-destructive">
                {state.errors?.userName}
              </p>
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
              value={state.email}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.email}
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors?.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              value={state.password}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "password",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.password}
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors?.password}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPasswd">Confirm Password</Label>
            <Input
              id="confirmPasswd"
              type="password"
              name="confirmPasswd"
              required
              value={state.confirmPasswd}
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD",
                  field: "confirmPasswd",
                  value: e.target.value,
                });
              }}
              aria-invalid={!!state.errors?.confirmPasswd}
            />
            {state.errors?.confirmPasswd && (
              <p className="text-sm text-destructive">
                {state.errors?.confirmPasswd}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={
              loading ||
              !state.firstName ||
              !state.lastName ||
              !state.userName ||
              !state.email ||
              !state.password ||
              !state.confirmPasswd ||
              !!state.errors?.userName ||
              state.confirmPasswd !== state.password
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
