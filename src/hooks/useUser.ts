import { GET_USER } from "@/graphql/queries/user";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { persistPurge } from "@/lib/persistPurge";
import {
  checkUserName,
  logoutUser,
  signInUser,
  signUpUser,
  userAccountDeletion,
  userAccountPasswdUpdate,
  userAccountUpdate,
  userAssetsUpdate,
} from "@/services/userServices";
import { clearUser, updateUser } from "@/store/features/user/userSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useQuery as apolloUserQuery } from "@apollo/client";
import { UserResponse } from "@/reseponseTypes/UserResponse";

export const useFetchUserData = (enabled: boolean) => {
  return apolloUserQuery<UserResponse>(GET_USER, {
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["userLogout"],
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log("statement executed");
      queryClient.removeQueries({
        queryKey: ["user"],
      });

      dispatch(clearUser());
      async function purge() {
        await persistPurge();
      }
      purge();
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
      const message = data?.data?.message || "Logout Successfull";
      toast.success(message);
    },
  });
};

export const useSignInUser = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["userSignIn"],
    mutationFn: signInUser,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 3000,
      });
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
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 3000,
      });
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

export const useUserAccountUpdate = () => {
  return useMutation({
    mutationKey: ["userAccountUpdate"],
    mutationFn: userAccountUpdate,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAccountDeletion = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["userAccountDelete"],
    mutationFn: userAccountDeletion,
    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });

      dispatch(clearUser());
      async function purge() {
        await persistPurge();
      }
      purge();
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
      const message = data?.data?.message;
      toast.success("Account Deletion", {
        description: message,
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAssetsUpdate = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["userAssetsUpdate"],
    mutationFn: userAssetsUpdate,
    onSuccess: (data) => {
      dispatch(
        updateUser({
          avatarURL: data.data.data.avatar,
        })
      );
      toast.success(data.data.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAccountPasswdUpdate = () => {
  return useMutation({
    mutationKey: ["userAccountPasswdUpdate"],
    mutationFn: userAccountPasswdUpdate,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};
