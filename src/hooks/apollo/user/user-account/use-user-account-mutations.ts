import { USER_ACCNT_DELETE } from "@/graphql/mutations/user-account-mutations/userAccountDel";
import { USER_ACCNT_PASSWD_UPDATE } from "@/graphql/mutations/user-account-mutations/userAccountPasswdUpdate";
import { USER_ACCNT_UPDATE } from "@/graphql/mutations/user-account-mutations/userAccountUpdate";
import { USER_ACCNT_VERIFY } from "@/graphql/mutations/user-account-mutations/userAccountVerify";
import { ROUTES } from "@/constants/ApiRoutes";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { persistPurge } from "@/lib/persistPurge";
import { clearUser } from "@/store/features/user/userSlice";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useUserAccountUpdate = () => {
  return useMutation(USER_ACCNT_UPDATE, {
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

export const useUserAccountVerification = () => {
  return useMutation(USER_ACCNT_VERIFY, {
    onCompleted: async (res) => {
      toast.success(res.userAccountVerify.message, {
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

export const useUserAccountDeletion = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation(USER_ACCNT_DELETE, {
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

export const useUserAccountPasswdUpdate = () => {
  return useMutation(USER_ACCNT_PASSWD_UPDATE, {
    onCompleted: (res) => {
      toast.success(res.userAccountPasswdUpdate.message, {
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
