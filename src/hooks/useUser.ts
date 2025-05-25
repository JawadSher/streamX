import { ROUTES } from "@/lib/api/ApiRoutes";
import { persistPurge } from "@/lib/persistPurge";
import { checkUserName, fetchUserData, logoutUser, signInUser, signUpUser } from "@/services/userServices";
import { clearUser } from "@/store/features/user/userSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useFetchUserData = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserData,
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCheckUserName = () => {
  return useMutation({
    mutationKey: ["checkUserName"],
    mutationFn: checkUserName,
  });
};

export const useLogoutUser = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  return useMutation({
    mutationKey: ["userLogout"],
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(clearUser());
      async function purge() {
        await persistPurge();
      }
      purge();
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
      const message = data?.data?.message || "Logout Successful";
      toast.success(message);
    },
  });
};

export const useSignInUser = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["userSignIn"],
    mutationFn: signInUser,
    onSuccess: () => {
      toast.success("Login Successfull");
      setTimeout(() => {
        router.push(ROUTES.PAGES_ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};

export const useSignUpUser = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["userSignUp"],
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("Account Created Successfully");
      setTimeout(() => {
        router.push(ROUTES.PAGES_ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};
