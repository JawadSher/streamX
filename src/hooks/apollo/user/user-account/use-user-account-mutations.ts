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
import { Toaster } from "@/components/toaster";

export const useUserAccountUpdate = () => {
  return useMutation(USER_ACCNT_UPDATE, {
    onCompleted: (res) => {
      Toaster.success("Account Updation", res.userAccountUpdate.message);
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      Toaster.error("Account Update Error", message);
    },
  });
};

export const useUserAccountVerification = () => {
  return useMutation(USER_ACCNT_VERIFY, {
    onCompleted: async (res) => {
      Toaster.success("Account Verification", res.userAccountVerify.message);
    },
    onError: (err: any) => {
      const { message } = extractGraphQLError(err);
      Toaster.error("Account Verification Error", message);
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
      Toaster.success("Account Deletion", message);
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      Toaster.error("Account Deletion Error", message);
    },
  });
};

export const useUserAccountPasswdUpdate = () => {
  return useMutation(USER_ACCNT_PASSWD_UPDATE, {
    onCompleted: (res) => {
      Toaster.success(
        "Account Password Update",
        res.userAccountPasswdUpdate.message
      );
    },
    onError: (error: any) => {
      const { message } = extractGraphQLError(error);
      Toaster.error("Account Password Update Error", message);
    },
  });
};
