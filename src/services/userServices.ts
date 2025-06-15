import { USER_ACCOUNT_VERIFY } from "@/graphql/mutations/user/userAccountVerify";
import { ROUTES } from "@/lib/api/ApiRoutes";
import axiosInstance from "@/lib/axios";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const userAccountVerification = () => {
  return useMutation(USER_ACCOUNT_VERIFY, {
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

export const userAccountPasswdUpdate = (data: { password?: string }) => {
  return axiosInstance.patch(
    ROUTES.API_ROUTES.USER_ACCNT_PASSWD_UPDATE,
    {
      data,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userAssetsUpdate = (formData: FormData) => {
  return axiosInstance.patch(ROUTES.API_ROUTES.USER_ASSETS_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
