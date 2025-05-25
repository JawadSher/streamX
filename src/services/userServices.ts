import { ROUTES } from "@/lib/api/ApiRoutes";
import axiosInstance from "@/lib/axios";

export const fetchUserData = () => {
  return axiosInstance.get(ROUTES.API_ROUTES.USER_DATA_FETCH);
};

export const logoutUser = () => {
  return axiosInstance.post(ROUTES.API_ROUTES.USER_AUTH_SIGN_OUT);
};

export const signInUser = (data: { email: string; password: string }) => {
  return axiosInstance.post(ROUTES.API_ROUTES.USER_AUTH_SIGN_IN, { data });
};

export const signUpUser = (data: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}) => {
  return axiosInstance.post(ROUTES.API_ROUTES.USER_AUTH_SIGN_UP, { data });
};

export const checkUserName = (data: {
  userName: string;
  isAuthentic?: boolean
}) => {
  return axiosInstance.post(ROUTES.API_ROUTES.USER_NAME_CHECK, { data });
};
