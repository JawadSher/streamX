"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";

import loginSchema from "@/schemas/loginSchema";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authProviderSignIn } from "@/app/actions/auth-actions/authSignin.action";
import { toast, Toaster } from "sonner";
import { debounce } from "lodash";
import { useSignInUser } from "@/hooks/useUser";
import { ROUTES } from "@/lib/api/ApiRoutes";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  } | null>(null);

  const { data, mutate, isError, error, isPending } = useSignInUser();

  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.status === 400) {
      toast.error(data.data.message);
      setErrors({
        email: data?.data?.email?.[0] ?? "",
        password: data?.data?.password?.[0] ?? "",
      });
    } else if (data?.status === 401 || data?.status === 500) {
      setErrors({
        email: "",
        password: "",
      });
      toast.error(data.data.message, {
        duration: 3000,
      });
    } else if (data?.data.statusCode === 301) {
      setErrors({
        email: "",
        password: "",
      });
      toast.success(data.data.message, {
        duration: 3000,
      });
      router.push(ROUTES.PAGES_ROUTES.HOME);
    }
  }, [data, error, isError, data, router]);

  const debouncedValidate = useCallback(
    debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      const emailValue =
        name === "email" ? value : emailRef.current?.value || "";
      const passwordValue =
        name === "password" ? value : passwordRef.current?.value || "";

      const data = { email: emailValue, password: passwordValue };

      const result = loginSchema.safeParse(data);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: passwordValue.length > 0 ? fieldErrors.password?.[0] : "",
        });
      } else {
        setErrors(null);
      }
    }, 500),
    [debounce]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedValidate(event);
  };

  const handleSubmit = async (formData: FormData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    mutate(result.data as { email: string; password: string });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Form
          className={cn("flex flex-col gap-6", className)}
          {...props}
          action={handleSubmit}
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
                ref={emailRef}
                onChange={handleInputChange}
                aria-invalid={errors?.email ? "true" : "false"}
              />
              {errors?.email && (
                <p className="text-sm text-destructive">{errors?.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                ref={passwordRef}
                onChange={handleInputChange}
                type="password"
                name="password"
                placeholder="Password"
                required
                aria-invalid={errors?.password ? "true" : "false"}
              />
              {errors?.password && (
                <p className="text-sm text-destructive">{errors?.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={
                isPending ||
                !!errors ||
                !emailRef.current?.value ||
                !passwordRef.current?.value
              }
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Login"
              )}
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
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
      <Toaster position="bottom-right" expand={false} />
    </div>
  );
}
