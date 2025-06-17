import { ROUTES } from "@/lib/api/ApiRoutes";
import axiosInstance from "@/lib/axios";

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
