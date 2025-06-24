import { signIn } from "next-auth/react";
import { toast } from "sonner";

export async function signinHandler(
  session: any,
  credentials: { email: string; password: string },
  setLoading?: (value: boolean) => void
): Promise<true | { type: string; message: string } | false> {
  try {
    setLoading?.(true);

    if (session?.data?.user?._id || session.status === "authenticated") {
      toast.error("User is already authenticated", { duration: 3000 });
      return true;
    }

    const response = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (response?.error) return false;

    toast.success("User login successfully", {
      duration: 3000,
    });

    return true;
  } catch (error: any) {
    toast.error(error.message || "Unexpected error", {
      duration: 3000,
    });
    
    return false;
  } finally {
    setLoading?.(false);
  }
}
