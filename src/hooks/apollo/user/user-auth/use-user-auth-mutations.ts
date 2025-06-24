import { ROUTES } from "@/lib/api/ApiRoutes";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SIGNUP_USER } from "@/graphql/mutations/user-auth-mutations/userSignup";

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
