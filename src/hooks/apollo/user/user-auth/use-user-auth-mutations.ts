import { LOGOUT_USER } from "@/graphql/mutations/auth/userLogout";
import { ROUTES } from "@/lib/api/ApiRoutes";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { persistPurge } from "@/lib/persistPurge";
import { LogoutUserResponse } from "@/reseponseTypes/LogoutUserResponse";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LOGIN_USER } from "@/graphql/mutations/auth/userLogin";
import { SIGNUP_USER } from "@/graphql/mutations/auth/userSignup";

export const useSignInUser = () => {
  const router = useRouter();
  return useMutation(LOGIN_USER, {
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

export const useLogoutUser = () => {
  const router = useRouter();
  return useMutation<LogoutUserResponse>(LOGOUT_USER, {
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

export const useSignUpUser = () => {
  const router = useRouter();

  return useMutation(SIGNUP_USER, {
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
