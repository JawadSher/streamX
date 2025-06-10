import { GET_USER } from "@/graphql/queries/user";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { persistPurge } from "@/lib/persistPurge";
import {
  userAccountPasswdUpdate,
  userAccountUpdate,
  userAssetsUpdate,
} from "@/services/userServices";
import { clearUser, updateUser } from "@/store/features/user/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  useQuery as apolloUserQuery,
  useLazyQuery,
  useMutation as apolloMutation,
} from "@apollo/client";
import { UserResponse } from "@/reseponseTypes/UserResponse";
import { CHECK_USER_NAME } from "@/graphql/queries/checkUserName";
import { LOGOUT_USER } from "@/graphql/mutations/auth/userLogout";
import { LogoutUserResponse } from "@/reseponseTypes/LogoutUserResponse";
import { UserNameResponse } from "@/reseponseTypes/UserNameCheckResponse";
import { LOGIN_USER } from "@/graphql/mutations/auth/userLogin";
import { SIGNUP_USER } from "@/graphql/mutations/auth/userSignup";
import { USER_ACCNT_DELETE } from "@/graphql/mutations/user/userAccountDel";
import { USER_ACCNT_UPDATE } from "@/graphql/mutations/user/userAccountUpdate";
import { extractGraphQLError } from "@/lib/extractGraphqlError";

export const useFetchUserData = (enabled: boolean) => {
  return apolloUserQuery<UserResponse>(GET_USER, {
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
};

export const useCheckUserName = () => {
  return useLazyQuery<UserNameResponse>(CHECK_USER_NAME, {
    fetchPolicy: "cache-and-network",
  });
};

export const useLogoutUser = () => {
  const router = useRouter();
  return apolloMutation<LogoutUserResponse>(LOGOUT_USER, {
    onCompleted: async (res) => {
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
      await persistPurge();
      toast.success(res.logoutUser.message, {
        duration: 3000,
      });
    },
    onError: (err: any) => {
      const { message } = extractGraphQLError(err);
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useSignInUser = () => {
  const router = useRouter();
  return apolloMutation(LOGIN_USER, {
    onCompleted: (res) => {
      toast.success(res.loginUser.message, {
        duration: 3000,
      });
      setTimeout(() => {
        router.push(ROUTES.PAGES_ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useSignUpUser = () => {
  const router = useRouter();

  return apolloMutation(SIGNUP_USER, {
    onCompleted: (res) => {
      toast.success(res.signUpUser.message, {
        duration: 3000,
      });
      setTimeout(() => {
        router.push(ROUTES.PAGES_ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAccountUpdate = () => {
  return apolloMutation(USER_ACCNT_UPDATE, {
    onCompleted: (res) => {
      toast.success(res.userAccountUpdate.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAccountDeletion = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return apolloMutation(USER_ACCNT_DELETE, {
    onCompleted: (res) => {
      dispatch(clearUser());
      async function purge() {
        await persistPurge();
      }
      purge();
      router.push(ROUTES.PAGES_ROUTES.SIGN_IN);
      const message = res.userAccountDel.message;
      toast.success("Account Deletion", {
        description: message,
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
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
