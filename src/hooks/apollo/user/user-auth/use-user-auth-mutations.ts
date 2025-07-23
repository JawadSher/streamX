import { ROUTES } from "@/constants/ApiRoutes";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { SIGNUP_USER } from "@/graphql/mutations/user-auth-mutations/userSignup";
import { Toaster } from "@/components/toaster";

export const useSignUpUser = () => {
  const router = useRouter();

  return useMutation(SIGNUP_USER, {
    onCompleted: (res) => {
      Toaster.success(res.signUpUser.message);
      setTimeout(() => {
        router.push(ROUTES.PAGES_ROUTES.HOME);
      }, 1500);
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      Toaster.error(message);
    },
  });
};
