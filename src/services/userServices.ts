import { IUserAsset } from "@/app/api/user/assets/route";
import { ROUTES } from "@/lib/api/ApiRoutes";
import axiosInstance from "@/lib/axios";

export const fetchUserData = () => {
  return axiosInstance.get(ROUTES.API_ROUTES.USER_DATA_FETCH, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const logoutUser = () => {
  return axiosInstance.post(ROUTES.API_ROUTES.USER_AUTH_SIGN_OUT, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const signInUser = (data: { email: string; password: string }) => {
  return axiosInstance.post(
    ROUTES.API_ROUTES.USER_AUTH_SIGN_IN,
    { data },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const signUpUser = (data: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}) => {
  return axiosInstance.post(
    ROUTES.API_ROUTES.USER_AUTH_SIGN_UP,
    { data },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const checkUserName = (data: {
  userName: string;
  isAuthentic?: boolean;
}) => {
  return axiosInstance.post(
    ROUTES.API_ROUTES.USER_NAME_CHECK,
    { data },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userAccountUpdate = (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
}) => {
  return axiosInstance.patch(
    ROUTES.API_ROUTES.USER_ACCNT_UPDATE,
    { data },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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

export const userAccountDeletion = () => {
  return axiosInstance.delete(ROUTES.API_ROUTES.USER_ACCNT_DELETE, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const userAssetsUpdate = (formData: FormData) => {
  return axiosInstance.patch(ROUTES.API_ROUTES.USER_ASSETS_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
