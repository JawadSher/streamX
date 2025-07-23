"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signupSchema } from "@/schemas/signupSchema";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import { useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useSignUpUser } from "@/hooks/apollo";
import { useCheckUserName } from "@/hooks/apollo/user/user-account/use-user-account-queries";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { GoogleProviderBtn } from "./authProviderBtns";
import Loading from "../loading";
import { Toaster } from "../toaster";

const combinedSchema = signupSchema.and(confPassSchema);

type SignupFormValues = z.infer<typeof combinedSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(combinedSchema),
  });

  const AllFields = watch();
  const isDisabled =
    Object.values(AllFields).some((val) => !val) || isSubmitting;

  const [signUp, { data: signUpData, error }] = useSignUpUser();
  const [userNameCheck] = useCheckUserName();

  const onSubmit = async (data: SignupFormValues) => {
    await signUp({
      variables: {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      },
    });
  };

  useEffect(() => {
    if (!signUpData) return;

    const status = signUpData.signUpUser.statusCode;
    if (status === 200 || status === 201) {
      Toaster.success("Signup successful", "Account is created successfully");
      reset();
    }
  }, [signUpData, reset]);

  useEffect(() => {
    if (!error) return;
    const { data, message } = extractGraphQLError(error);
    Object.entries(data || {}).forEach(([key, val]: [string, any]) => {
      setError(key as keyof SignupFormValues, {
        type: "manual",
        message: val[0],
      });
    });
    Toaster.error(message);
  }, [error, setError]);

  const userName = watch("userName");

  const debouncedCheck = useCallback(
    debounce((value: string) => {
      userNameCheck({
        variables: { userName: value, isAuthentic: true },
        onError: (err) => {
          const { message, data } = extractGraphQLError(err);
          if (data?.validationError) {
            setError("userName", {
              type: "manual",
              message: data.validationError,
            });
          } else {
            setError("userName", {
              type: "manual",
              message,
            });
          }
        },
      });
    }, 1000),
    [userNameCheck, setError]
  );

  useEffect(() => {
    if (userName) debouncedCheck(userName);
    return () => debouncedCheck.cancel();
  }, [userName, debouncedCheck]);

  return (
    <div className="flex flex-col gap-6 min-w-[350px]">
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Create New Account
          </CardTitle>
          <CardDescription>
            Enter your details to create new streamX account
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {(
              [
                ["firstName", "First name"],
                ["lastName", "Last name"],
                ["userName", "User name"],
                ["email", "Email"],
                ["password", "Password"],
                ["confPasswd", "Confirm Password"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  type={
                    field.includes("password") || field === "confPasswd"
                      ? "password"
                      : "text"
                  }
                  placeholder={label}
                  {...register(field)}
                  aria-invalid={!!errors[field]}
                />
                {errors[field] && (
                  <p className="text-sm text-destructive">
                    {errors[field]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isDisabled}
            >
              {isSubmitting ? <Loading /> : "Sign up"}
            </Button>
          </form>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
