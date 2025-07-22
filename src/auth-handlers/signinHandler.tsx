import { Toaster } from "@/components/toaster";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export async function signinHandler(
  session: any,
  credentials: { email: string | undefined; password: string | undefined },
  setLoading?: (value: boolean) => void
): Promise<true | { type: string; message: string } | false> {
  try {
    setLoading?.(true);

    if (session?.data?.user?._id || session.status === "authenticated") {
      Toaster.success("User Authenticated", "User is already authenticated");
      return true;
    }

    const response = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (response?.error) {
      Toaster.error("Login failed", "Invalid email or password");
      return false;
    }

    Toaster.success("Login Successfull", "User login successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Unexpected error", {
      duration: 3000,
    });

    Toaster.error(
      "Server Error",
      error.message || "Something went wrong while authentication"
    );

    return false;
  } finally {
    setLoading?.(false);
  }
}
