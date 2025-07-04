import { ROUTES } from "@/constants/ApiRoutes";
import axiosInstance from "@/lib/axios";

export const userAssetsUpdate = (formData: FormData) => {
  return axiosInstance.patch(ROUTES.API_ROUTES.USER_ASSETS_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
